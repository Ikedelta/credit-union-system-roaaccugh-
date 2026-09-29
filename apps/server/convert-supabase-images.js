const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const prisma = new PrismaClient();

async function convertSupabaseImages() {
  console.log('Fetching files from Supabase...');
  const { data: files, error } = await supabase.storage.from('cms-media').list();
  if (error) {
    console.error('Supabase list error:', error);
    return;
  }

  const filesToConvert = files.filter(f => f.name.endsWith('.jpg') || f.name.endsWith('.png') || f.name.endsWith('.jpeg'));
  console.log(`Found ${filesToConvert.length} images to convert.`);

  for (const file of filesToConvert) {
    console.log(`Converting ${file.name}...`);
    // Download
    const { data: fileData, error: downloadError } = await supabase.storage.from('cms-media').download(file.name);
    if (downloadError) {
      console.error(`Failed to download ${file.name}:`, downloadError);
      continue;
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    
    // Convert
    const parsed = path.parse(file.name);
    const newName = `${parsed.name}.webp`;
    
    const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
    
    // Upload new
    const { error: uploadError } = await supabase.storage.from('cms-media').upload(newName, webpBuffer, {
      contentType: 'image/webp',
      upsert: true
    });
    
    if (uploadError) {
      console.error(`Failed to upload ${newName}:`, uploadError);
      continue;
    }

    // Delete old
    await supabase.storage.from('cms-media').remove([file.name]);
    console.log(`Successfully converted and replaced ${file.name} with ${newName}`);
  }

  // Update DB references
  console.log('Updating database references...');
  const contents = await prisma.websiteContent.findMany();
  for (const content of contents) {
    if (content.value) {
      const originalValue = content.value;
      let newValue = originalValue;
      for (const file of filesToConvert) {
        const parsed = path.parse(file.name);
        const newName = `${parsed.name}.webp`;
        // Replace exact occurrences of the filename in the JSON payload
        newValue = newValue.split(file.name).join(newName);
      }
      
      if (originalValue !== newValue) {
        await prisma.websiteContent.update({
          where: { id: content.id },
          data: { value: newValue }
        });
        console.log(`Updated DB references for CMS key: ${content.key}`);
      }
    }
  }

  console.log('Done.');
  process.exit(0);
}

convertSupabaseImages().catch(err => {
  console.error(err);
  process.exit(1);
});

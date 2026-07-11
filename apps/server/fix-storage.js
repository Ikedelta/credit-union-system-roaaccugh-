const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Ensuring cms-media bucket exists...');
  
  try {
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('cms-media', 'cms-media', true)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);
    console.log('Bucket cms-media created/updated successfully!');
  } catch(e) { 
    console.error('Failed to create bucket:', e.message);
  }

  console.log('Applying Supabase Storage Policies for cms-media...');
  
  try {
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow public uploads cms" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'cms-media');
    `);
    console.log('Added INSERT policy');
  } catch(e) { console.log('INSERT policy might already exist:', e.message) }

  try {
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow public deletes cms" ON storage.objects FOR DELETE TO public USING (bucket_id = 'cms-media');
    `);
    console.log('Added DELETE policy');
  } catch(e) { console.log('DELETE policy might already exist:', e.message) }

  try {
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow public updates cms" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'cms-media');
    `);
    console.log('Added UPDATE policy');
  } catch(e) { console.log('UPDATE policy might already exist:', e.message) }

  try {
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow public selects cms" ON storage.objects FOR SELECT TO public USING (bucket_id = 'cms-media');
    `);
    console.log('Added SELECT policy');
  } catch(e) { console.log('SELECT policy might already exist:', e.message) }
  
  console.log('All policies applied successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

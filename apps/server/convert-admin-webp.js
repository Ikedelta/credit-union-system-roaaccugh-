const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const adminPublicDir = path.join(__dirname, '../admin/public');
const adminAssetsDir = path.join(__dirname, '../admin/src/assets');

async function convertDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      if (file.endsWith('.bak')) continue; // Skip .bak
      const inputPath = path.join(dir, file);
      const parsed = path.parse(inputPath);
      const outputPath = path.join(dir, `${parsed.name}.webp`);
      await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);
      console.log(`Converted ${file} to ${parsed.name}.webp in ${dir}`);
    }
  }
}

async function run() {
  await convertDir(adminPublicDir);
  await convertDir(adminAssetsDir);
}

run().catch(console.error);

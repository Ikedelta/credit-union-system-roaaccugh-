const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../website/public');

const filesToConvert = [
  'logo.png',
  'roa1.jpg',
  'roa3.jpg',
  'slider1.jpg',
  'slider2.jpg',
  'slider3.jpg'
];

async function convert() {
  for (const file of filesToConvert) {
    const inputPath = path.join(publicDir, file);
    const parsed = path.parse(inputPath);
    const outputPath = path.join(publicDir, `${parsed.name}.webp`);

    if (fs.existsSync(inputPath)) {
      await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);
      console.log(`Converted ${file} to ${parsed.name}.webp`);
    } else {
      console.log(`File not found: ${file}`);
    }
  }
}

convert().catch(console.error);

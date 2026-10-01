const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const content = await prisma.websiteContent.findUnique({
    where: { key: 'photo_gallery' }
  });
  console.log(content.value);
  process.exit(0);
}
run();

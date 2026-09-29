import { PrismaClient } from '@prisma/client'; 
const prisma = new PrismaClient(); 
async function main() { 
  const item = await prisma.websiteContent.findUnique({ where: { key: 'photo_gallery' } }); 
  console.log(item); 
} 
main().finally(() => prisma.$disconnect());

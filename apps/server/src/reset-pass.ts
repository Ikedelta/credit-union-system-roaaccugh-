import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.admin.update({
    where: { email: 'admin@creditunion.com' },
    data: { password: hashedPassword }
  });
  console.log("Password reset successfully for admin@creditunion.com");
}

main().catch(console.error).finally(() => prisma.$disconnect());

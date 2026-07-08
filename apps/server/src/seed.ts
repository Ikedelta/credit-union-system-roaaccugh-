import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: "admin@creditunion.com" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.admin.create({
      data: {
        name: "Super Admin",
        email: "admin@creditunion.com",
        password: hashedPassword,
        role: "SUPERADMIN"
      },
    });
    console.log("Admin seeded: admin@creditunion.com / admin123");
  } else {
    await prisma.admin.update({
      where: { email: "admin@creditunion.com" },
      data: { role: "SUPERADMIN" }
    });
    console.log("Admin already exists. Updated role to SUPERADMIN.");
  }

  // Seed default CMS content
  const defaultContent = [
    { key: "home_hero_title", value: "Welcome to Our Credit Union" },
    { key: "home_hero_subtitle", value: "Secure your financial future with us." },
    { key: "about_text", value: "We are dedicated to providing excellent financial services to our members." },
  ];

  for (const item of defaultContent) {
    await prisma.websiteContent.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }
  console.log("CMS content seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

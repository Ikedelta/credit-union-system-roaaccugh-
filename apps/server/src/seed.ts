import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: "admin@roaaccugh.com" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.admin.create({
      data: {
        name: "Super Admin",
        email: "admin@roaaccugh.com",
        password: hashedPassword,
        role: "SUPERADMIN"
      },
    });
    console.log("Admin seeded: admin@roaaccugh.com / admin123");
  } else {
    await prisma.admin.update({
      where: { email: "admin@roaaccugh.com" },
      data: { role: "SUPERADMIN", password: await bcrypt.hash("admin123", 10) }
    });
    console.log("Admin already exists. Updated role to SUPERADMIN.");
  }

  // Seed default CMS content
  const defaultContent = [
    { key: "home_hero_title", value: "Welcome to Our Credit Union", type: "TEXT" },
    { key: "home_hero_subtitle", value: "Secure your financial future with us.", type: "TEXT" },
    { key: "about_text", value: "We are dedicated to providing excellent financial services to our members.", type: "TEXT" },
    { key: "sms_template_membership_approved", value: "Hello {name}, your ROAACCU membership is APPROVED. Your Member ID is: {memberId}. Please keep this safe for future reference.", type: "TEXT" },
    { key: "sms_template_membership_submission", value: "Hello {name}, your ROAACCU membership application has been received and is currently under review.", type: "TEXT" },
    { key: "sms_template_membership_status", value: "Hello {name}, your ROAACCU membership application status has been updated to: {status}.", type: "TEXT" },
    { key: "sms_template_welfare_submission", value: "Hello {name}, your ROAACCU welfare application has been received and is currently under review.", type: "TEXT" },
    { key: "sms_template_welfare_status", value: "Hello {name}, your ROAACCU welfare application status has been updated to: {status}.", type: "TEXT" },
    { key: "sms_template_loan_submission", value: "Hello {name}, your ROAACCU loan application has been received and is currently under review. We will notify you when the status changes.", type: "TEXT" },
    { key: "sms_template_loan_status", value: "Hello {name}, your ROAACCU loan application status has been updated to: {status}.", type: "TEXT" },
    { key: "photo_gallery", value: "[]", type: "JSON" },
    { key: "new_photo_gallery", value: "[]", type: "JSON" }
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

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialContent = [
  { key: 'home_hero_title', value: 'Your Future Starts Here', type: 'TEXT' },
  { key: 'home_hero_subtitle', value: "Ghana's trusted financial co-operative — built by members, for members. Join over 11,000 people growing together.", type: 'TEXT' },
  { key: 'about_text', value: 'ROAA Co-operative Credit Union Ltd. (ROAACCU) was established in November 2011...', type: 'TEXT' },
  { key: 'contact_email', value: 'info@roaaccugh.com', type: 'TEXT' },
  { key: 'contact_phone', value: '+233 24 123 4567', type: 'TEXT' },
  { key: 'contact_address', value: 'Western Region, Ghana', type: 'TEXT' },
  { key: 'working_hours', value: 'Mon - Fri: 8:00 AM - 4:00 PM', type: 'TEXT' },
  { key: 'footer_text', value: 'Building sustainable wealth together.', type: 'TEXT' }
];

async function seedContent() {
  for (const item of initialContent) {
    await prisma.websiteContent.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }
  console.log('CMS seeded successfully');
}

seedContent()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

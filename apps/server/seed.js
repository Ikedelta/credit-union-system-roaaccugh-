const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.admin.upsert({
    where: { email: 'admin@roaaccugh.com' },
    update: {
      password: hashedPassword,
      role: 'SUPERADMIN'
    },
    create: {
      name: 'Super Admin',
      email: 'admin@roaaccugh.com',
      password: hashedPassword,
      role: 'SUPERADMIN'
    }
  });

  const defaultContent = [
    { key: 'home_hero_title', value: 'Your Future Starts Here', type: 'TEXT' },
    { key: 'home_hero_subtitle', value: "Ghana's trusted financial co-operative — built by members, for members. Join over 11,000 people growing together.", type: 'TEXT' },
    { key: 'about_text', value: 'ROAA Co-operative Credit Union Ltd. (ROAACCU) was established in November 2011 through the initiative of the National Executive Council (NEC) of the Rubber Outgrowers and Agents Association (ROAA) under the Management of an Interim Management Board instituted by the NEC, with Mr. Kwame Awuah Asante as Chairman. Mr. Rexford N. Norvieku-Tekpetey was the first hired staff to see to the realization of the Association’s dream.', type: 'TEXT' }
  ];

  for (const item of defaultContent) {
    await prisma.websiteContent.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }

  console.log('Seeded Admin and CMS content');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

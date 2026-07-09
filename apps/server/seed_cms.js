const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const defaultContent = [
    { key: 'home_hero_title', value: 'Your Future Starts Here', type: 'TEXT' },
    { key: 'home_hero_subtitle', value: "Ghana's trusted financial co-operative — built by members, for members. Join over 11,000 people growing together.", type: 'TEXT' },
    { key: 'about_text', value: 'ROAA Co-operative Credit Union Ltd. (ROAACCU) was established in November 2011 through the initiative of the National Executive Council (NEC) of the Rubber Outgrowers and Agents Association (ROAA) under the Management of an Interim Management Board instituted by the NEC, with Mr. Kwame Awuah Asante as Chairman. Mr. Rexford N. Norvieku-Tekpetey was the first hired staff to see to the realization of the Association’s dream.', type: 'TEXT' },
    { key: 'contact_email', value: 'info@roaaccugh.com', type: 'TEXT' },
    { key: 'contact_phone', value: '+233 24 123 4567', type: 'TEXT' },
    { key: 'contact_address', value: 'Western Region, Ghana', type: 'TEXT' },
    { key: 'footer_text', value: 'Building sustainable wealth together.', type: 'TEXT' },
    { key: 'stats_members', value: '11,880', type: 'TEXT' },
    { key: 'stats_branches', value: '5', type: 'TEXT' },
    { key: 'stats_assets', value: 'GHS 72.2M+', type: 'TEXT' },
    { key: 'stats_years', value: '10+', type: 'TEXT' },
    { 
      key: 'home_slides', 
      type: 'JSON',
      value: JSON.stringify([
        {
          id: 1,
          image: "/slider1.jpg",
          eyebrow: "Me Daakye Anidaso",
          title: "Your Future Starts Here",
          subtitle: "Ghana's trusted financial co-operative — built by members, for members. Join over 11,000 people growing together."
        },
        {
          id: 2,
          image: "/slider2.jpg",
          eyebrow: "Save. Borrow. Grow.",
          title: "Savings That Work As Hard As You Do",
          subtitle: "High-yield savings accounts and low-interest loans designed around your real life goals — not a bank's bottom line."
        },
        {
          id: 3,
          image: "/slider3.jpg",
          eyebrow: "Business & Personal Loans",
          title: "Capital When Opportunity Knocks",
          subtitle: "Fast-approval loans from GHS 1,000 to GHS 500,000. Competitive rates, flexible terms, local decisions."
        }
      ]) 
    },
    {
      key: 'social_links',
      type: 'JSON',
      value: JSON.stringify([
        { platform: 'Facebook', url: '#' },
        { platform: 'Twitter', url: '#' },
        { platform: 'Instagram', url: '#' },
        { platform: 'LinkedIn', url: '#' }
      ])
    }
  ];

  for (const item of defaultContent) {
    await prisma.websiteContent.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }

  console.log('Seeded CMS content');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

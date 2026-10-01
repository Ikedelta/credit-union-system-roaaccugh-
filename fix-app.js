const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'apps', 'server', 'src', 'app.ts');
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `    let newsItems = [];
    if (content && content.value) {
      try {
        newsItems = JSON.parse(content.value);
      } catch (e) {}
    }
    
    if (!newsItems || newsItems.length === 0) {
      newsItems = [
        {
          title: "Annual General Meeting 2026",
          date: "August 15, 2026",
          image: "https://roaaccugh.com/assets/img/slider2.webp",
          content: "Join us for our upcoming AGM where we will discuss the financial performance of the past year and outline our strategic goals for the future. All registered members are encouraged to attend."
        },
        {
          title: "New Mobile Banking Features",
          date: "July 2, 2026",
          image: "https://roaaccugh.com/assets/img/slider1.webp",
          content: "We are excited to announce new features to our mobile banking app, including instant loan approvals and improved security measures."
        },
        {
          title: "Community Outreach Program",
          date: "June 10, 2026",
          image: "https://roaaccugh.com/assets/img/slider3.webp",
          content: "ROAACCU recently partnered with local farmers to provide financial literacy training and subsidized farming equipment to help boost local agriculture."
        }
      ];
    }
    
    let newsItem = null;
    const generateSlug = (text: string) => text ? text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
    newsItem = newsItems.find((item: any, index: number) => item.id?.toString() === id || index.toString() === id || generateSlug(item.title) === id);`;

const regex = /let newsItem = null;[\s\S]*?newsItem = newsItems\.find[^;]+;/;
if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully replaced app.ts content');
} else {
  console.log('Regex did not match.');
}

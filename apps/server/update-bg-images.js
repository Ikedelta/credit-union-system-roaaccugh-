const fs = require('fs');
const path = require('path');
const dir = 'c:/Projects/credit-union-system/apps/website/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const mapping = {
  'About.tsx': 'bg_about',
  'Organogram.tsx': 'bg_organogram',
  'BoardAndManagement.tsx': 'bg_organogram',
  'Services.tsx': 'bg_services',
  'Products.tsx': 'bg_products',
  'Branches.tsx': 'bg_branches',
  'NewsAndBlog.tsx': 'bg_news',
  'NewsDetail.tsx': 'bg_news',
  'Faq.tsx': 'bg_faqs',
  'Gallery.tsx': 'bg_gallery',
  'PhotoGallery.tsx': 'bg_gallery',
  'Awards.tsx': 'bg_awards',
  'Videos.tsx': 'bg_videos',
  'Agm.tsx': 'bg_agm',
  'Contact.tsx': 'bg_contact',
  'ApplyLoan.tsx': 'bg_services',
  'JoinNow.tsx': 'bg_contact',
  'Events.tsx': 'bg_news',
  'ByLaw.tsx': 'bg_about',
  'OperationalPolicy.tsx': 'bg_about',
  'Welfare.tsx': 'bg_about'
};

for (const f of files) {
  if (!mapping[f]) continue;
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('<PageHeader')) continue;

  const bgKey = mapping[f];
  
  // Ensure useCMS is imported
  if (!content.includes('useCMS')) {
    content = content.replace(/(import .*?;[\r\n]+)/, "$1import { useCMS } from '../context/CMSContext';\n");
  }

  // Ensure getText is extracted
  if (!content.includes('getText')) {
    // find the first component definition
    content = content.replace(/(export function [a-zA-Z0-9_]+\(.*?\)\s*\{)/, "$1\n  const { getText } = useCMS();");
  } else if (!content.includes('const { getText }') && !content.includes('const { getJSON, getText }') && !content.includes('getText =') && !content.includes('const { getText,')) {
      content = content.replace(/(const \{\s*[a-zA-Z0-9_,\s]*)\s*\}/, "$1, getText }");
  }

  // Replace bgImage prop
  // Match bgImage="..."
  content = content.replace(/bgImage=["'](.*?)["']/, (match, defaultBg) => {
    return `bgImage={getText('${bgKey}', '${defaultBg}')}`;
  });

  fs.writeFileSync(filePath, content);
}
console.log('Done');

const fs = require('fs');
const path = require('path');
const dir = 'c:/Projects/credit-union-system/apps/website/src/components';
const files = fs.readdirSync(dir);
let changed = 0;
for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, 'utf8');
  if (content.includes('<img ')) {
    content = content.replace(/<img(?!.*loading=)/g, '<img loading="lazy" decoding="async"');
    fs.writeFileSync(fp, content);
    changed++;
    console.log('Updated', file);
  }
}
console.log('Total files updated:', changed);

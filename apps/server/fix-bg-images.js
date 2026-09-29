const fs = require('fs');
const path = require('path');
const dir = 'c:/Projects/credit-union-system/apps/website/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const f of files) {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('getText')) {
    content = content.replace(/getText/g, 'get');
    // Ensure we don't end up with const { get, get }
    content = content.replace(/const \{\s*get\s*,\s*get\s*\}/g, 'const { get }');
    fs.writeFileSync(filePath, content);
  }
}
console.log('Done fixing');

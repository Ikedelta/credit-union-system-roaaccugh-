const fs = require('fs');
const path = require('path');
const dir = 'c:/Projects/credit-union-system/apps/website/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const f of files) {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('\\n  const {')) {
    const compName = f.split('.')[0];
    content = content.replace('\\n  const {', `export function ${compName}() {\n  const {`);
    fs.writeFileSync(filePath, content);
  } else if (content.includes('\\n  const { get }')) {
    // just in case
    const compName = f.split('.')[0];
    content = content.replace('\\n  const { get }', `export function ${compName}() {\n  const { get }`);
    fs.writeFileSync(filePath, content);
  }
}
console.log('Fixed syntax errors');

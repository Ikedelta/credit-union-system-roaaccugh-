const fs = require('fs');
const { execSync } = require('child_process');

console.log('Building workspaces...');
execSync('npm run build --workspaces', { stdio: 'inherit' });

console.log('Copying website build to public...');
fs.cpSync('apps/website/dist', 'public', { recursive: true });

console.log('Copying admin build to public/admin...');
fs.cpSync('apps/admin/dist', 'public/admin', { recursive: true });

console.log('Build completed successfully!');

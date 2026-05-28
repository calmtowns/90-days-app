const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="80" fill="#8B6F47"/>
  <text x="256" y="320" text-anchor="middle" font-family="system-ui, sans-serif" font-size="220" font-weight="bold" fill="white">90</text>
  <text x="256" y="420" text-anchor="middle" font-family="system-ui, sans-serif" font-size="80" fill="rgba(255,255,255,0.7)">DAYS</text>
</svg>`;

const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent);
console.log('SVG icon created. For PNG icons, use a tool like sharp or imagemagick.');

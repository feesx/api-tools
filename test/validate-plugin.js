// 简单的插件验证脚本
const fs = require('fs');
const path = require('path');

const pluginDir = path.resolve(__dirname, '../src');

console.log('=== JSON Formatter Plugin Validation ===');
console.log('Checking plugin files in:', pluginDir);
console.log('');

const requiredFiles = [
  'manifest.json',
  'background.js',
  'popup.html',
  'popup.js',
  'content.js',
  'icons/icon16.svg',
  'icons/icon48.svg',
  'icons/icon128.svg'
];

console.log('1. Checking required files:');
requiredFiles.forEach(file => {
  const fullPath = path.join(pluginDir, file);
  try {
    fs.accessSync(fullPath, fs.constants.F_OK);
    console.log(`✅ ${file}`);
  } catch (error) {
    console.log(`❌ ${file} - NOT FOUND`);
  }
});
console.log('');

console.log('2. Checking manifest.json validity:');
try {
  const manifestPath = path.join(pluginDir, 'manifest.json');
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);
  
  console.log('✅ manifest.json parsing successful');
  console.log(`   Name: ${manifest.name}`);
  console.log(`   Version: ${manifest.version}`);
  console.log(`   Description: ${manifest.description}`);
  console.log(`   Manifest Version: ${manifest.manifest_version}`);
  
  if (manifest.manifest_version === 3) {
    console.log('✅ Using Manifest V3 (latest)');
  } else {
    console.log('⚠️ Manifest version should be 3 for modern Chrome extensions');
  }
} catch (error) {
  console.log(`❌ ${error.message}`);
}
console.log('');

console.log('3. Checking JavaScript file syntax:');
const jsFiles = ['background.js', 'popup.js', 'content.js'];
jsFiles.forEach(file => {
  try {
    const filePath = path.join(pluginDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 简单的语法检查（通过eval）
    new Function(content);
    console.log(`✅ ${file}`);
  } catch (error) {
    console.log(`❌ ${file} - ${error.message}`);
  }
});
console.log('');

console.log('=== Validation Complete ===');
console.log('');
console.log('Next steps to test:');
console.log('1. Load the plugin in Chrome (chrome://extensions)');
console.log('2. Enable "Developer mode"');
console.log('3. Click "Load unpacked" and select the src/ folder');
console.log('4. Open test-simple.html to verify functionality');
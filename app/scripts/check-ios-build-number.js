const fs = require('fs');
const path = require('path');

const expected = process.argv[2] || '43';
const root = path.resolve(__dirname, '..');

const appJson = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8'));
const plist = fs.readFileSync(path.join(root, 'ios/OLFi/Info.plist'), 'utf8');
const pbxproj = fs.readFileSync(path.join(root, 'ios/OLFi.xcodeproj/project.pbxproj'), 'utf8');

const values = [
  ['Expo ios.buildNumber', appJson.expo?.ios?.buildNumber],
  ['Info.plist CFBundleVersion', plist.match(/<key>CFBundleVersion<\/key>\s*<string>([^<]+)<\/string>/)?.[1]],
  ['Xcode CURRENT_PROJECT_VERSION', [...pbxproj.matchAll(/CURRENT_PROJECT_VERSION = ([^;]+);/g)].map((match) => match[1]).join(', ')],
];

const failures = values.filter(([, value]) => {
  if (!value) return true;
  return String(value).split(',').map((item) => item.trim()).some((item) => item !== expected);
});

for (const [label, value] of values) {
  console.log(`${label}: ${value || 'missing'}`);
}

if (failures.length > 0) {
  console.error(`iOS build number check failed. Expected ${expected}.`);
  process.exit(1);
}

console.log(`iOS build number is ready for TestFlight build ${expected}.`);

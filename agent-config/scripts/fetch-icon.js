const https = require('https');
const fs = require('fs');
const path = require('path');

// Check arguments
if (process.argv.length < 4) {
    console.error('Usage: node fetch-icon.js <icon-name> <destination-directory>');
    console.error('Example: node fetch-icon.js user app/assets/images');
    process.exit(1);
}

const iconName = process.argv[2];
const destDir = process.argv[3];
const url = `https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/${iconName}.svg`;

// Ensure destination directory exists
const absoluteDestDir = path.resolve(process.cwd(), destDir);
if (!fs.existsSync(absoluteDestDir)) {
    fs.mkdirSync(absoluteDestDir, { recursive: true });
}

const destFile = path.join(absoluteDestDir, `${iconName}.svg`);

console.log(`Fetching '${iconName}' from Lucide...`);

https.get(url, (response) => {
    if (response.statusCode === 200) {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            fs.writeFileSync(destFile, data);
            console.log(`✅ Successfully saved icon to: ${destFile}`);
        });
    } else if (response.statusCode === 404) {
        console.error(`❌ Icon '${iconName}' not found. Please check the name at https://lucide.dev/icons`);
        process.exit(1);
    } else {
        console.error(`❌ Failed to fetch icon. Status code: ${response.statusCode}`);
        process.exit(1);
    }
}).on('error', (err) => {
    console.error(`❌ Request failed: ${err.message}`);
    process.exit(1);
});

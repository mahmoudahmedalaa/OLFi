import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '../public/assets/partners');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const logos = [
    { name: 'careem.svg', url: 'https://cdn.worldvectorlogo.com/logos/careem.svg' },
    { name: 'tamara.svg', url: 'https://cdn.tamara.co/assets/svg/tamara-logo-en.svg' },
    { name: 'dewa.png', url: 'https://www.dewa.gov.ae/~/media/Files/New%20Structure%202021/Logos/dewa_logo_en.png' },
    { name: 'tabby.svg', url: 'https://cdn.worldvectorlogo.com/logos/tabby.svg' },
    { name: 'noon.svg', url: 'https://f.nooncdn.com/s/app/com/noon/images/logos/noon-black-en.svg' },
    { name: 'etisalat.svg', url: 'https://www.etisalat.ae/en/assets/images/header/en-logo.svg' }
];

const fetchLogo = (logo) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(dir, logo.name);
        // Use an aggressive User-Agent to pass basic WAF
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        };

        https.get(logo.url, options, (res) => {
            // Handle redirects
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 308) {
                https.get(res.headers.location, options, (res2) => {
                    const file = fs.createWriteStream(filePath);
                    res2.pipe(file);
                    file.on('finish', () => { file.close(); resolve(logo.name); });
                }).on('error', reject);
                return;
            }

            if (res.statusCode !== 200) {
                // Fallback for tricky CDNs
                console.warn(`Failed to fetch ${logo.name} from ${logo.url} with status ${res.statusCode}`);
                resolve('Failed ' + logo.name);
                return;
            }

            const file = fs.createWriteStream(filePath);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(logo.name);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

Promise.all(logos.map(fetchLogo))
    .then((results) => {
        console.log('Finished downloading files:', results);
        // Verify file sizes
        logos.forEach(logo => {
            const p = path.join(dir, logo.name);
            if (fs.existsSync(p)) {
                console.log(`${logo.name}: ${fs.statSync(p).size} bytes`);
            }
        });
    })
    .catch(console.error);

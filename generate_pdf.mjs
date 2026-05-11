import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const filePath = `file://${path.resolve('docs/design/OLFi_Brand_Identity.html')}`;
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.pdf({ path: 'docs/design/OLFi_Brand_Identity.pdf', format: 'A4', printBackground: true });
  await browser.close();
})();

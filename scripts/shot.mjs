#!/usr/bin/env node
// Chụp ảnh trang (máy tính + điện thoại) tại mục đang góp ý. Dùng trong GitHub Actions với Playwright.
//   node shot.mjs <baseUrl> <pagePath> <section|-> <outPrefix>
//   → <outPrefix>-desktop.png, <outPrefix>-mobile.png
import { chromium } from 'playwright';

const [base, pagePath = '/', section = '-', out] = process.argv.slice(2);
if (!base || !out) { console.error('usage: shot.mjs <baseUrl> <pagePath> <section|-> <outPrefix>'); process.exit(1); }
const url = base.replace(/\/$/, '') + (pagePath.startsWith('/') ? pagePath : '/' + pagePath);
const sizes = { desktop: { width: 1280, height: 800, isMobile: false }, mobile: { width: 390, height: 844, isMobile: true } };

const browser = await chromium.launch();
for (const [name, s] of Object.entries(sizes)) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: 1.5, isMobile: s.isMobile, hasTouch: s.isMobile });
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForFunction(() => document.querySelector('#root')?.children.length > 0, null, { timeout: 30000 });
    await page.addStyleTag({ content: '.fb-fab{display:none!important} html{scroll-behavior:auto!important} *{animation:none!important;transition:none!important}' });
    await page.waitForTimeout(800);
    if (section && section !== '-') {
      const id = section.replace(/^#/, '');
      await page.evaluate(id => { const el = document.getElementById(id); if (el) window.scrollTo(0, Math.max(0, el.offsetTop - 72)); }, id);
    }
    await page.waitForTimeout(1200); // ảnh lazy-load
    await page.screenshot({ path: `${out}-${name}.png` });
    console.log(`✔ ${name}: ${url} ${section}`);
  } catch (e) {
    console.error(`! ${name}: ${e.message}`);
  }
  await page.close();
}
await browser.close();

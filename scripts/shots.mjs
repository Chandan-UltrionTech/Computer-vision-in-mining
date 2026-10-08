import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

// Usage: node scripts/shots.mjs 1440x900 core:.5 blast:.55 ...
const [size, ...targets] = process.argv.slice(2);
const [width, height] = size.split('x').map(Number);
mkdirSync('test-results/shots', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
const errors = [];
page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));
await page.goto('http://localhost:3000');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(600);
for (const target of targets) {
  const [id, fraction] = target.split(':');
  const y = await page.evaluate(({ id, fraction }) => {
    const chapters = [...document.querySelectorAll('[data-scroll-chapter]')];
    const i = chapters.findIndex(c => c.dataset.scrollChapter === id);
    if (i < 0) { const el = document.getElementById(id); return el.offsetTop + el.offsetHeight * Number(fraction); }
    return chapters.slice(0, i).reduce((s, el) => s + el.offsetHeight, 0) + chapters[i].offsetHeight * Number(fraction);
  }, { id, fraction });
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
  await page.waitForTimeout(350);
  const path = `test-results/shots/${width}-${id}-${fraction}.png`;
  await page.screenshot({ path });
  console.log(path);
}
console.log(JSON.stringify({ errors: [...new Set(errors)].slice(0, 10) }));
await browser.close();

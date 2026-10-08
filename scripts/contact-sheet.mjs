import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

// Usage: node scripts/contact-sheet.mjs [width] [height] [scene,scene,...] [fractions]
const [width = 1440, height = 900] = process.argv.slice(2, 4).map(Number);
const only = process.argv[4] && process.argv[4] !== 'all' ? process.argv[4].split(',') : null;
const fractions = process.argv[5] ? process.argv[5].split(',').map(Number) : [0, .12, .3, .5, .7, .88, .97];
const reverse = process.env.REVERSE === '1';
mkdirSync('test-results/sheets', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
const errors = [];
page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));
await page.goto('http://localhost:3000');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(800);
const ids = await page.evaluate(() => [...document.querySelectorAll('[data-scroll-chapter]')].map(c => c.dataset.scrollChapter));
const targets = only ?? ids;

async function jump(id, fraction) {
  const y = await page.evaluate(({ id, fraction }) => {
    const chapters = [...document.querySelectorAll('[data-scroll-chapter]')];
    const i = chapters.findIndex(c => c.dataset.scrollChapter === id);
    return chapters.slice(0, i).reduce((s, el) => s + el.offsetHeight, 0) + chapters[i].offsetHeight * fraction;
  }, { id, fraction });
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
  await page.waitForTimeout(220);
}

const rows = [];
const order = reverse ? [...targets].reverse() : targets;
for (const id of order) {
  const frames = [];
  for (const f of reverse ? [...fractions].reverse() : fractions) {
    await jump(id, f);
    const buf = await page.screenshot({ type: 'jpeg', quality: 70 });
    frames.push({ f, src: `data:image/jpeg;base64,${buf.toString('base64')}` });
  }
  rows.push({ id, frames });
}

const cols = fractions.length;
const tileW = Math.floor(2100 / cols);
const tileH = Math.round(tileW * height / width);
const sheet = await browser.newPage({ viewport: { width: tileW * cols + 120, height: 400 } });
const perSheet = Math.max(1, Math.floor(2400 / (tileH + 22)));
for (let s = 0; s * perSheet < rows.length; s++) {
  const chunk = rows.slice(s * perSheet, (s + 1) * perSheet);
  await sheet.setContent(`<body style="margin:0;font:12px sans-serif;background:#333;color:#fff">${chunk.map(r => `<div style="display:flex;align-items:center;gap:0;margin-bottom:4px"><div style="width:120px;padding:4px">${r.id}</div>${r.frames.map(fr => `<div style="position:relative"><img src="${fr.src}" style="width:${tileW}px;height:${tileH}px;display:block;border-right:1px solid #333"><span style="position:absolute;left:3px;top:2px;background:#000a;padding:1px 3px">${fr.f}</span></div>`).join('')}</div>`).join('')}</body>`);
  const name = `test-results/sheets/${width}${reverse ? '-rev' : ''}-${only ? only.join('_').slice(0, 40) : 'all'}-${s}.png`;
  await sheet.screenshot({ path: name, fullPage: true });
  console.log(name);
}
console.log(JSON.stringify({ errors: [...new Set(errors)].slice(0, 10) }));
await browser.close();

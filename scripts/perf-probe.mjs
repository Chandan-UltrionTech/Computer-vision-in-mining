import { chromium } from '@playwright/test';

// Isolates paint cost in one scene by hiding candidate layers in turn.
// Usage: node scripts/perf-probe.mjs scene fraction "selector one" "selector two" ...
const [scene, fraction, ...selectors] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(600);
const results = await page.evaluate(async ({ scene, fraction, selectors }) => {
  const chapters = [...document.querySelectorAll('[data-scroll-chapter]')];
  const i = chapters.findIndex(c => c.dataset.scrollChapter === scene);
  const start = chapters.slice(0, i).reduce((s, el) => s + el.offsetHeight, 0) + chapters[i].offsetHeight * Number(fraction);
  const measure = () => new Promise(resolve => {
    const times = []; let previous = performance.now(), n = 0;
    function frame(now) {
      times.push(now - previous); previous = now;
      window.scrollTo(0, start + (n++ % 40) * 6);
      if (times.length < 80) requestAnimationFrame(frame); else resolve(times.slice(5).sort((a, b) => a - b)[37].toFixed(1));
    }
    requestAnimationFrame(frame);
  });
  const out = { baseline: await measure() };
  for (const selector of selectors) {
    const els = [...document.querySelectorAll(selector)];
    els.forEach(el => el.style.display = 'none');
    out[`${selector} (${els.length})`] = await measure();
    els.forEach(el => el.style.display = '');
  }
  return out;
}, { scene, fraction, selectors });
console.log(JSON.stringify(results, null, 1));
await browser.close();

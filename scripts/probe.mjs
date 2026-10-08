import { chromium } from '@playwright/test';

// Usage: node scripts/probe.mjs scene:fraction "css selector" [attribute]
const [target, selector, attribute = 'transform'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000');
await page.waitForLoadState('networkidle');
const [id, fraction] = target.split(':');
await page.evaluate(({ id, fraction }) => {
  const chapters = [...document.querySelectorAll('[data-scroll-chapter]')];
  const i = chapters.findIndex(c => c.dataset.scrollChapter === id);
  window.scrollTo({ top: chapters.slice(0, i).reduce((s, el) => s + el.offsetHeight, 0) + chapters[i].offsetHeight * Number(fraction), behavior: 'instant' });
}, { id, fraction });
await page.waitForTimeout(500);
console.log(JSON.stringify(await page.evaluate(({ selector, attribute }) => ({
  scene: document.querySelector('[data-world-svg]')?.dataset.activeScene,
  progress: document.querySelector('[data-world-svg]')?.dataset.localProgress,
  values: [...document.querySelectorAll(selector)].map(el => el.getAttribute(attribute)),
}), { selector, attribute })));
await browser.close();

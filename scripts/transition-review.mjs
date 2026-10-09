import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/transitions');
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', message => {
  if (['error', 'warning'].includes(message.type())) errors.push(message.text());
});
page.on('pageerror', error => errors.push(error.message));
await page.goto('http://localhost:3000');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000);

// Discover all scene chapters in DOM order
const chapters = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('[data-scroll-chapter]')).map(el => el.dataset.scrollChapter);
});

console.log(`Discovered ${chapters.length} scenes. Checking ${chapters.length - 1} transitions.`);

async function jumpTo(sceneId, fraction) {
  await page.evaluate(({ id, frac }) => {
    const list = Array.from(document.querySelectorAll('[data-scroll-chapter]'));
    const idx = list.findIndex(e => e.dataset.scrollChapter === id);
    if (idx === -1) return;
    const top = list.slice(0, idx).reduce((acc, el) => acc + el.offsetHeight, 0) + list[idx].offsetHeight * frac;
    window.scrollTo({ top, behavior: 'instant' });
  }, { id: sceneId, frac: fraction });
  await page.waitForTimeout(250);
}

let capturedCount = 0;
for (let i = 0; i < chapters.length - 1; i++) {
  const sceneA = chapters[i];
  const sceneB = chapters[i + 1];
  const pairIndex = String(i + 1).padStart(2, '0');
  const pairName = `${pairIndex}-${sceneA}-to-${sceneB}`;

  const samplePoints = [
    { scene: sceneA, frac: 0.90, label: 'A-0.90' },
    { scene: sceneA, frac: 0.97, label: 'A-0.97' },
    { scene: sceneA, frac: 0.995, label: 'A-0.995' },
    { scene: sceneB, frac: 0.005, label: 'B-0.005' },
    { scene: sceneB, frac: 0.03, label: 'B-0.03' },
    { scene: sceneB, frac: 0.10, label: 'B-0.10' },
  ];

  for (const pt of samplePoints) {
    await jumpTo(pt.scene, pt.frac);
    const fileName = `${pairName}-${pt.label}.png`;
    await page.screenshot({ path: path.join(outDir, fileName) });
    capturedCount++;
  }
}

console.log(`Successfully captured ${capturedCount} screenshots across ${chapters.length - 1} scene transitions.`);
console.log(JSON.stringify({ errors: [...new Set(errors)], transitionsReviewed: chapters.length - 1, capturedCount }));
await browser.close();

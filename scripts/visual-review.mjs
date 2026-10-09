import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

await fs.mkdir('test-results', { recursive: true });

const b = await chromium.launch();
const errors = [];

for (const [width, height] of [[1440, 900], [768, 1024], [390, 844]]) {
  const p = await b.newPage({ viewport: { width, height } });
  p.on('console', m => { if (['warning', 'error'].includes(m.type())) errors.push(m.text()); });
  p.on('pageerror', e => errors.push(e.message));
  await p.goto('http://localhost:3000');
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(1000);

  async function jumpTo(id, fraction) {
    const y = await p.evaluate(({ id, fraction }) => {
      let els = [...document.querySelectorAll('[data-scroll-chapter]')];
      let i = els.findIndex(e => e.dataset.scrollChapter === id);
      if (i === -1) return 0;
      return els.slice(0, i).reduce((s, e) => s + e.offsetHeight, 0) + els[i].offsetHeight * fraction;
    }, { id, fraction });
    await p.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await p.waitForTimeout(400);
  }

  // Standard scene review
  for (const [id, fraction] of [
    ['arrival', 0], ['drill', 0.4], ['core', 0.65], ['grade', 0.5], ['blast', 0.5],
    ['fragments', 0.5], ['safety', 0.6], ['bucket', 0.65], ['loading', 0.5], ['haul', 0.5],
    ['driver', 0.55], ['crusher', 0.5], ['conveyor', 0.65], ['sizing', 0.65], ['sorter', 0.7],
    ['slurry', 0.5], ['froth', 0.72], ['stockpile', 0.5], ['survey', 0.85], ['thermal', 0.7],
    ['finale', 0.8],
  ]) {
    await jumpTo(id, fraction);
    await p.screenshot({ path: `test-results/review-${width}-${id}.png` });
  }

  // Driver detail sequence (sections 29 & 88)
  for (const fraction of [0.15, 0.35, 0.55, 0.72, 0.90]) {
    await jumpTo('driver', fraction);
    await p.screenshot({ path: `test-results/driver-${width}-p${fraction.toFixed(2)}.png` });
    if (fraction === 0.55) {
      if (width === 390) {
        await p.screenshot({ path: 'test-results/final-driver-mobile.png' });
      } else if (width === 1440) {
        await p.screenshot({ path: 'test-results/final-driver-desktop.png' });
      }
    }
  }

  // Finale thesis sequence (section 89)
  for (const fraction of [0.80, 0.92, 0.97]) {
    await jumpTo('finale', fraction);
    await p.screenshot({ path: `test-results/finale-${width}-p${fraction.toFixed(2)}.png` });
    if (fraction === 0.97) {
      if (width === 390) {
        await p.screenshot({ path: 'test-results/final-finale-mobile.png' });
      } else if (width === 1440) {
        await p.screenshot({ path: 'test-results/final-finale-desktop.png' });
      }
    }
  }

  await p.close();
}

console.log(JSON.stringify({ errors: [...new Set(errors)] }));
await b.close();

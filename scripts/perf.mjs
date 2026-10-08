import { chromium } from '@playwright/test';

// Scrolls the whole journey at a steady pace and reports frame pacing per scene.
// Usage: node scripts/perf.mjs [width] [height] [pxPerFrame]
const [width = 1440, height = 900, step = 14] = process.argv.slice(2).map(Number);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
const errors = [];
page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));
await page.goto('http://localhost:3000');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(800);
const result = await page.evaluate(async step => {
  const end = document.querySelector('[data-journey]').offsetHeight - innerHeight;
  const byScene = {}, longTasks = [];
  const observer = new PerformanceObserver(list => longTasks.push(...list.getEntries().map(e => Math.round(e.duration))));
  observer.observe({ type: 'longtask', buffered: false });
  let previous = performance.now(), y = 0;
  await new Promise(resolve => {
    function frame(now) {
      const scene = document.querySelector('[data-world-svg]')?.dataset.activeScene ?? '?';
      (byScene[scene] ??= []).push(now - previous);
      previous = now;
      y += step;
      window.scrollTo(0, y);
      if (y < end) requestAnimationFrame(frame); else resolve();
    }
    requestAnimationFrame(frame);
  });
  observer.disconnect();
  const stats = list => {
    const s = list.slice(2).sort((a, b) => a - b);
    return { frames: s.length, median: +s[Math.floor(s.length * .5)]?.toFixed(1), p95: +s[Math.floor(s.length * .95)]?.toFixed(1), max: +s[s.length - 1]?.toFixed(1) };
  };
  const all = Object.values(byScene).flat();
  return { overall: stats(all), scenes: Object.fromEntries(Object.entries(byScene).map(([k, v]) => [k, stats(v)])), longTasks };
}, step);
console.log(JSON.stringify({ errors: [...new Set(errors)], ...result }, null, 1));
await browser.close();

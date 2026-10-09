import { chromium } from '@playwright/test';

// Scrolls the whole journey at a steady pace and reports frame cadence & pacing per scene.
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

const rendererInfo = await page.evaluate(() => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return { renderer: 'No WebGL context', vendor: 'unknown' };
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      vendor: dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : 'Generic',
      renderer: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'Generic WebGL',
      environment: 'headless Chromium automated test environment',
    };
  } catch (e) {
    return { environment: 'headless Chromium automated test environment', error: String(e) };
  }
});

const result = await page.evaluate(async step => {
  const journey = document.querySelector('[data-journey]');
  if (!journey) return { error: 'No [data-journey] found' };
  const end = journey.offsetHeight - innerHeight;
  const byScene = {}, longTasks = [];
  const observer = new PerformanceObserver(list => longTasks.push(...list.getEntries().map(e => Math.round(e.duration))));
  observer.observe({ type: 'longtask', buffered: false });

  let previous = performance.now(), y = 0;
  await new Promise(resolve => {
    function frame(now) {
      const scene = document.querySelector('[data-world-svg]')?.dataset.activeScene ?? '?';
      const dt = now - previous;
      (byScene[scene] ??= []).push(dt);
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
    if (!s.length) return { frames: 0, median: 0, p95: 0, max: 0, over20ms: 0, over25ms: 0, over33ms: 0, slowFramePct: 0 };
    const over20 = s.filter(t => t > 20).length;
    const over25 = s.filter(t => t > 25).length;
    const over33 = s.filter(t => t > 33).length;
    return {
      frames: s.length,
      medianCadenceMs: +s[Math.floor(s.length * 0.5)]?.toFixed(1),
      p95CadenceMs: +s[Math.floor(s.length * 0.95)]?.toFixed(1),
      maxCadenceMs: +s[s.length - 1]?.toFixed(1),
      framesOver20ms: over20,
      framesOver25ms: over25,
      framesOver33ms: over33,
      slowFramePct: +((over20 / s.length) * 100).toFixed(1),
    };
  };

  const all = Object.values(byScene).flat();
  return {
    overall: stats(all),
    scenes: Object.fromEntries(Object.entries(byScene).map(([k, v]) => [k, stats(v)])),
    longTasks,
  };
}, step);

console.log(JSON.stringify({
  rendererInfo,
  errors: [...new Set(errors)],
  ...result,
}, null, 2));

await browser.close();

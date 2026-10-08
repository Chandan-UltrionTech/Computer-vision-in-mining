import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', message => {
  if (['error', 'warning'].includes(message.type())) errors.push(message.text());
});
page.on('pageerror', error => errors.push(error.message));
await page.goto('http://localhost:3000');
await page.waitForLoadState('networkidle');

async function jump(id, fraction) {
  const y = await page.evaluate(({ id, fraction }) => {
    const chapters = [...document.querySelectorAll('[data-scroll-chapter]')];
    const i = chapters.findIndex(chapter => chapter.dataset.scrollChapter === id);
    return chapters.slice(0, i).reduce((sum, el) => sum + el.offsetHeight, 0) + chapters[i].offsetHeight * fraction;
  }, { id, fraction });
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
  await page.waitForTimeout(350);
}
for (const [id, fractions] of [
  ['core', [.82, .9, .98]], ['blast', [.82, .9, .98]],
  ['fragments', [.8, .9, .98]], ['haul', [.72, .85, .98]],
  ['conveyor', [.93, .97, .999]], ['thermal', [.85, .93, .99]],
]) {
  for (const fraction of fractions) {
    await jump(id, fraction);
    await page.screenshot({ path: `test-results/transition-${id}-${fraction}.png` });
  }
}
await jump('survey', .3);
const pacing = await page.evaluate(async () => {
  const frameTimes = [];
  const longTasks = [];
  const observer = new PerformanceObserver(list => longTasks.push(...list.getEntries().map(e => e.duration)));
  observer.observe({ type: 'longtask', buffered: false });
  let previous = performance.now();
  await new Promise(resolve => {
    function frame(now) {
      frameTimes.push(now - previous); previous = now;
      window.scrollBy(0, 8);
      if (frameTimes.length < 150) requestAnimationFrame(frame); else resolve();
    }
    requestAnimationFrame(frame);
  });
  observer.disconnect();
  const sorted = frameTimes.slice(5).sort((a, b) => a - b);
  return { medianFrameMs: sorted[Math.floor(sorted.length * .5)], p95FrameMs: sorted[Math.floor(sorted.length * .95)], longTasks, sampleFrames: frameTimes.length };
});
console.log(JSON.stringify({ errors, pacing }));
await browser.close();

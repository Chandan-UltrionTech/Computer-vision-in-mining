import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const motionDir = path.resolve('test-results/motion');
await fs.mkdir(motionDir, { recursive: true });

async function recordJourney(mode, direction, outputFile) {
  console.log(`Recording motion: ${mode} ${direction}...`);
  const isMobile = mode === 'mobile';
  const width = isMobile ? 390 : 1440;
  const height = isMobile ? 844 : 900;

  const tempDir = path.join(motionDir, `temp-${mode}-${direction}`);
  await fs.mkdir(tempDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width, height },
    recordVideo: {
      dir: tempDir,
      size: { width, height },
    },
  });

  const page = await context.newPage();
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(800);

  const totalScroll = await page.evaluate(() => {
    return document.querySelector('[data-journey]').offsetHeight - window.innerHeight;
  });

  const durationMs = isMobile ? 30000 : 42000;

  if (direction === 'forward') {
    // Time-based forward steady playback
    await page.evaluate(async ({ total, duration }) => {
      await new Promise(resolve => {
        const start = performance.now();
        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(1, elapsed / duration);
          window.scrollTo(0, total * progress);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(step);
      });
    }, { total: totalScroll, duration: durationMs });
  } else {
    // Reverse steady scroll from bottom to top with identical duration
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), totalScroll);
    await page.waitForTimeout(400);

    await page.evaluate(async ({ total, duration }) => {
      await new Promise(resolve => {
        const start = performance.now();
        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(1, elapsed / duration);
          window.scrollTo(0, total * (1 - progress));
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(step);
      });
    }, { total: totalScroll, duration: durationMs });
  }

  await page.waitForTimeout(500);
  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (video) {
    const videoPath = await video.path();
    const destination = path.join(motionDir, outputFile);
    await fs.copyFile(videoPath, destination);
    console.log(`Saved video to ${destination}`);
  }

  // Clean up temp dir
  try {
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

try {
  await recordJourney('desktop', 'forward', 'journey-desktop-forward.webm');
  await recordJourney('desktop', 'reverse', 'journey-desktop-reverse.webm');
  await recordJourney('mobile', 'forward', 'journey-mobile-forward.webm');
  console.log('Motion recording complete.');
} catch (err) {
  console.error('Error during motion review:', err);
  process.exit(1);
}

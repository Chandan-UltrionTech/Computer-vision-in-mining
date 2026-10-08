import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => console.log("PAGE ERROR", e.message));
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE", m.text());
});
await page.goto("http://localhost:3000");
await page.waitForLoadState("networkidle");
await page.screenshot({ path: "test-results/inspect-opening.png" });
console.log(
  await page.evaluate(() => ({
    height: document.body.scrollHeight,
    chapters: [...document.querySelectorAll("[data-scroll-chapter]")].map(
      (c) => [c.dataset.scrollChapter, c.offsetHeight],
    ),
    visible: [...document.querySelectorAll("[data-scene]")]
      .filter((c) => getComputedStyle(c).visibility === "visible")
      .map((c) => [c.dataset.scene, c.getBoundingClientRect().y]),
    capsule: document.querySelector("[data-state]").textContent,
  })),
);
await browser.close();

import { test, expect, type Page } from "@playwright/test";
test("live resize and motion preference changes clean up scene transforms", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await jump(page, "conveyor", 0.94);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(500);
  const transforms = await page
    .locator("[data-scene]")
    .evaluateAll((els) => els.map((el) => getComputedStyle(el).transform));
  expect(transforms.every((t) => t === "none")).toBeTruthy();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  await jump(page, "conveyor", 0.65);
  await expect(page.locator("[data-state]")).toHaveAttribute(
    "data-state",
    "solution",
  );
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForTimeout(600);
  await jump(page, "survey", 0.7);
  await expect(page.locator("[data-scene=survey]")).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(250);
  await page.mouse.wheel(700, 500);
  await page.waitForTimeout(900);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(100);
});
const ids = [
  "arrival",
  "drill",
  "core",
  "grade",
  "blast",
  "fragments",
  "excavation",
  "safety",
  "bucket",
  "loading",
  "haul",
  "driver",
  "crusher",
  "conveyor",
  "sizing",
  "sorter",
  "slurry",
  "froth",
  "stockpile",
  "survey",
  "thermal",
  "finale",
];
async function jump(page: Page, id: string, fraction: number) {
  const y = await page.evaluate(
    ({ id, fraction }) => {
      const chapters = Array.from(
        document.querySelectorAll<HTMLElement>("[data-scroll-chapter]"),
      );
      const i = chapters.findIndex((c) => c.dataset.scrollChapter === id);
      return (
        chapters.slice(0, i).reduce((sum, el) => sum + el.offsetHeight, 0) +
        chapters[i].offsetHeight * fraction
      );
    },
    { id, fraction },
  );
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: "instant" }),
    y,
  );
  await page.waitForTimeout(200);
}
test("desktop complete journey, semantic events and interactions", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: "test-results/opening-desktop.png" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Computer vision\nin mining.",
  );
  for (const id of ids) {
    await jump(page, id, 0.56);
    await expect(page.locator(`[data-scene=${id}]`)).toBeVisible();
    const bounds = await page.locator(`[data-scene=${id}]`).boundingBox();
    expect(bounds?.y).toBeCloseTo(0, 0);
    await expect(page.locator(`[data-scene=${id}] svg`).first()).toBeVisible();
  }
  await jump(page, "core", 0.08);
  await expect(page.locator("[data-state]")).toHaveAttribute(
    "data-state",
    "normal",
  );
  await jump(page, "core", 0.26);
  await expect(page.locator("[data-state]")).toHaveAttribute(
    "data-state",
    "problem",
  );
  await jump(page, "core", 0.45);
  await expect(page.locator("[data-state]")).toHaveAttribute(
    "data-state",
    "observing",
  );
  await jump(page, "core", 0.65);
  await expect(page.locator("[data-state]")).toHaveAttribute(
    "data-state",
    "solution",
  );
  await jump(page, "core", 0.81);
  await expect(page.locator("[data-state]")).toHaveAttribute(
    "data-state",
    "result",
  );
  await jump(page, "blast", 0.15);
  await page.getByRole("button", { name: "Push detonator to blast" }).click();
  await expect(
    page.getByRole("button", { name: "Replay illustrated blast" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.waitForTimeout(800);
  await page.screenshot({ path: "test-results/blast-desktop.png" });
  await jump(page, "conveyor", 0.12);
  const fall = await page
    .locator("[data-scene=conveyor] [data-art=tool]")
    .boundingBox();
  await jump(page, "conveyor", 0.32);
  const landed = await page
    .locator("[data-scene=conveyor] [data-art=tool]")
    .boundingBox();
  expect(landed!.y).toBeGreaterThan(fall!.y + 20);
  await jump(page, "conveyor", 0.65);
  const travelled = await page
    .locator("[data-scene=conveyor] [data-art=tool]")
    .boundingBox();
  expect(travelled!.x).toBeGreaterThan(landed!.x + 40);
  await page.screenshot({ path: "test-results/conveyor-desktop.png" });
  await jump(page, "conveyor", 0.85);
  const removed = await page
    .locator("[data-scene=conveyor] [data-art=tool]")
    .boundingBox();
  expect(removed!.y).toBeLessThan(travelled!.y - 50);
  await jump(page, "survey", 0.7);
  await page.screenshot({ path: "test-results/survey-desktop.png" });
  await jump(page, "thermal", 0.65);
  await page.screenshot({ path: "test-results/thermal-desktop.png" });
  await jump(page, "finale", 0.8);
  await page.screenshot({ path: "test-results/finale-desktop.png" });
  const toggle = page.getByRole("switch", {
    name: "Computer vision intelligence layer",
  });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await expect(page.locator("[data-scene=finale] .cv-layer").first()).toHaveCSS(
    "visibility",
    "hidden",
  );
  await expect(
    page.locator("[data-scene=finale] [data-art=truck]").first(),
  ).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await page.getByRole("link", { name: "From vision to deployment" }).click();
  await page.waitForTimeout(1400);
  await page
    .getByRole("button", { name: "Explore this pilot ↗" })
    .first()
    .click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Build the pilot brief" }).click();
  await expect(
    page.getByRole("button", { name: "Download pilot brief" }),
  ).toBeVisible();
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download pilot brief" }).click();
  expect((await dl).suggestedFilename()).toBe("mining-cv-pilot-brief.txt");
  await page.getByRole("link", { name: "Follow the rock again" }).click();
  await page.waitForTimeout(1800);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(errors).toEqual([]);
});

test("continuous forward and reverse scroll covers every physical handoff", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const total = await page
    .locator("[data-scroll-chapter]")
    .evaluateAll((els) =>
      els.reduce((sum, el) => sum + (el as HTMLElement).offsetHeight, 0),
    );
  const samples = Array.from({ length: 180 }, (_, i) => (total * i) / 179);
  for (const y of [...samples, ...samples.toReversed()]) {
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: "instant" }),
      y,
    );
    await page.waitForTimeout(35);
    const covered = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).some(
        (el) => {
          const r = el.getBoundingClientRect();
          return (
            getComputedStyle(el).visibility === "visible" &&
            r.bottom > 20 &&
            r.top < innerHeight - 20 &&
            r.right > 20 &&
            r.left < innerWidth - 20
          );
        },
      ),
    );
    expect(covered).toBeTruthy();
  }
  await jump(page, "core", 0.94);
  await page.waitForTimeout(500);
  await page.screenshot({ path: "test-results/seam-handoff.png" });
  await jump(page, "blast", 0.94);
  await page.waitForTimeout(500);
  await page.screenshot({ path: "test-results/rock-handoff.png" });
  await jump(page, "loading", 0.94);
  await page.waitForTimeout(500);
  await page.screenshot({ path: "test-results/truck-handoff.png" });
  await jump(page, "sizing", 0.94);
  await page.waitForTimeout(500);
  await page.screenshot({ path: "test-results/belt-handoff.png" });
  expect(errors).toEqual([]);
});
test("mobile and intermediate widths keep the full narrative usable", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const [width, height] of [
    [390, 844],
    [320, 720],
    [768, 1024],
    [1024, 768],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await page.screenshot({ path: `test-results/opening-${width}.png` });
    for (const id of ids) {
      await jump(page, id, 0.6);
      await expect(page.locator(`[data-scene=${id}]`)).toBeVisible();
    }
    if (width === 390) {
      await jump(page, "conveyor", 0.6);
      await page.screenshot({ path: "test-results/conveyor-mobile.png" });
      await jump(page, "finale", 0.8);
      await page.screenshot({ path: "test-results/finale-mobile.png" });
    }
    await page.getByRole("switch").click();
    await expect(page.getByRole("switch")).toHaveAttribute(
      "aria-checked",
      "false",
    );
    await page.getByRole("switch").click();
  }
  expect(errors).toEqual([]);
});
test("reduced motion exposes static illustrations and semantic explanations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  for (const id of ids) {
    const panel = page.locator(`[data-scene=${id}]`);
    await panel.scrollIntoViewIfNeeded();
    await expect(panel).toBeVisible();
    const box = await panel.boundingBox();
    expect(box!.height).toBeGreaterThan(500);
  }
  await page.locator("[data-scene=core]").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/reduced-mobile.png" });
  await expect(page.locator("[data-scene=core]")).toContainText(
    "Core image → structured geology",
  );
  await page.getByRole("switch").click();
  await expect(page.locator("[data-scene=core] .cv-layer").first()).toHaveCSS(
    "visibility",
    "hidden",
  );
  await page.locator("[data-scene=blast]").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Push detonator to blast" }).click();
  await expect(
    page.getByRole("button", { name: "Replay illustrated blast" }),
  ).toHaveAttribute("aria-pressed", "true");
});

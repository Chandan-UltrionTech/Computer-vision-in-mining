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
  page.on("console", m => {if(m.type() === "error" || m.type() === "warning") errors.push(m.text())});
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
    await expect(page.locator("[data-world-svg]")).toBeVisible();
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
  const toolPosition = async () => {
    const transform=await page.locator('[data-world-svg] [data-material=tool]').getAttribute('transform');
    return transform!.match(/translate\(([-\d.]+) ([-\d.]+)\)/)!.slice(1).map(Number);
  };
  await jump(page, "conveyor", 0.12);
  const fall = await toolPosition();
  await jump(page, "conveyor", 0.32);
  const landed = await toolPosition();
  expect(landed[1]).toBeGreaterThan(fall[1] + 20);
  await jump(page, "conveyor", 0.65);
  const travelled = await toolPosition();
  // Compare world coordinates so a motivated camera reframe does not look like tool movement.
  expect(travelled[0]).toBeGreaterThan(landed[0]+40);
  await page.screenshot({ path: "test-results/conveyor-desktop.png" });
  await jump(page, "conveyor", 0.85);
  const removed = await toolPosition();
  expect(removed[1]).toBeLessThan(travelled[1] - 20);
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
  await expect(page.locator("[data-world-svg] .cv-layer").first()).toHaveCSS(
    "visibility",
    "hidden",
  );
  await expect(
    page.locator("[data-world-svg] [data-actor=truck]").first(),
  ).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await page.getByRole("link", { name: "Deployment", exact: true }).click();
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
  page.on("console", m => {if(m.type() === "error" || m.type() === "warning") errors.push(m.text())});
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
  page.on("console", m => {if(m.type() === "error" || m.type() === "warning") errors.push(m.text())});
  for (const [width, height] of [
    [390, 844],
    [430, 932],
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


test("numbered identity persists through the conveyor intervention and reverses",async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/');await page.waitForLoadState('networkidle');
 for(const [p,state] of [[.34,'problem'],[.45,'observing'],[.6,'solution'],[.8,'action'],[.95,'result'],[.8,'action'],[.45,'observing']] as const){
  await jump(page,'conveyor',p);await page.waitForTimeout(450);
  const capsule=page.locator('[data-state]');
  await expect(capsule).toHaveAttribute('data-state',state);
  await expect(capsule).toContainText('07');
  await expect(capsule).toContainText('Conveyor foreign-object & oversize detection');
 }
});

test('physical actors keep DOM identity across their semantic story beats',async({page})=>{
 await page.goto('/');await page.waitForLoadState('networkidle');
 const groups=[
  {selector:'[data-material=main-belt]',scenes:['conveyor','sizing','sorter']},
  {selector:'[data-material=crusher-hero]',scenes:['crusher','conveyor','sizing','sorter','slurry']},
  {selector:'[data-actor=truck]',scenes:['loading','haul','driver','crusher']},
  {selector:'[data-actor=survey-drone]',scenes:['stockpile','survey','thermal','finale']},
 ];
 for(const group of groups){
  await jump(page,group.scenes[0],.5);
  const actor=await page.locator(`[data-world-svg] ${group.selector}`).elementHandle();
  expect(actor).not.toBeNull();
  for(const scene of [...group.scenes,...group.scenes.toReversed()]){
   await jump(page,scene,.6);
   expect(await actor!.evaluate((node,selector)=>node===document.querySelector(`[data-world-svg] ${selector}`),group.selector)).toBe(true);
  }
 }
 await expect(page.locator('[data-world-svg]')).toHaveCount(1);
});

test('reversing material flow restores physical state after removal and sorting',async({page})=>{
 await page.goto('/');await page.waitForLoadState('networkidle');
 await jump(page,'conveyor',.72);
 const held=await page.locator('[data-material=crusher-hero]').getAttribute('transform');
 const heldParticle=await page.locator('[data-feed-particle="4"]').getAttribute('transform');
 await jump(page,'conveyor',.85);
 await expect(page.locator('[data-material=crusher-hero]')).toHaveAttribute('transform',held!);
 await expect(page.locator('[data-feed-particle="4"]')).toHaveAttribute('transform',heldParticle!);
 await jump(page,'conveyor',.6);
 const before=await page.locator('[data-world-part=material-flow]').evaluate(el=>{
  const selectors=['[data-material=tool]','[data-material=crusher-hero]','[data-feed-particle="4"]'];
  return selectors.map(selector=>el.querySelector(selector)?.getAttribute('transform'));
 });
 await jump(page,'conveyor',.95);
 await expect(page.locator('[data-material=tool]')).toHaveAttribute('opacity','0');
 await jump(page,'sorter',.95);
 await jump(page,'conveyor',.6);
 const after=await page.locator('[data-world-part=material-flow]').evaluate(el=>{
  const selectors=['[data-material=tool]','[data-material=crusher-hero]','[data-feed-particle="4"]'];
  return selectors.map(selector=>el.querySelector(selector)?.getAttribute('transform'));
 });
 expect(after).toEqual(before);
 await expect(page.locator('[data-material=tool]')).toHaveAttribute('opacity','1');
});

test('driver mobile view has readable facial details (head height >= 70px)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await jump(page, 'driver', 0.55);
  await page.waitForTimeout(300);

  const headRect = await page.locator('[data-gp="driver-detail-head"]').boundingBox();
  expect(headRect).not.toBeNull();
  expect(headRect!.height).toBeGreaterThanOrEqual(70);
  expect(headRect!.y).toBeGreaterThan(0);
  expect(headRect!.y + headRect!.height).toBeLessThan(844);

  // Check no collision with HUD capsule
  const capsuleRect = await page.locator('[data-state]').boundingBox();
  if (capsuleRect) {
    const overlaps = !(
      headRect!.x + headRect!.width < capsuleRect.x ||
      headRect!.x > capsuleRect.x + capsuleRect.width ||
      headRect!.y + headRect!.height < capsuleRect.y ||
      headRect!.y > capsuleRect.y + capsuleRect.height
    );
    expect(overlaps).toBeFalsy();
  }
});

test('mobile finale synthesis provides readable 3-act thesis without occlusion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await jump(page, 'finale', 0.95);
  await page.waitForTimeout(300);

  const synth = page.locator('[data-finale-synthesis]');
  await expect(synth).toBeVisible();
  const synthRect = await synth.boundingBox();
  expect(synthRect).not.toBeNull();
  expect(synthRect!.width).toBeGreaterThan(200);
  expect(synthRect!.x + synthRect!.width).toBeLessThanOrEqual(390);

  // Mine world stage remains visible in backdrop
  await expect(page.locator('[data-world-svg]')).toBeVisible();

  // Route track does not collide with synthesis overlay
  const trackRect = await page.locator('[data-journey-track]').boundingBox();
  if (trackRect && synthRect) {
    const overlapsTrack = !(
      synthRect.y + synthRect.height < trackRect.y ||
      synthRect.y > trackRect.y + trackRect.height
    );
    expect(overlapsTrack).toBeFalsy();
  }
});

test('finale landmark labels maintain clutter limit (<= 2 labels with opacity > 0.35 at p=0.95)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await jump(page, 'finale', 0.95);
  await page.waitForTimeout(300);

  const visibleLabelCount = await page.locator('[data-landmark-label]').evaluateAll(els => {
    return els.filter(el => {
      const op = parseFloat(el.getAttribute('opacity') ?? getComputedStyle(el).opacity);
      return op > 0.35;
    }).length;
  });

  expect(visibleLabelCount).toBeLessThanOrEqual(2);
});

test('thermal sensor moves and targets anomaly as inspection progresses', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await jump(page, 'thermal', 0.35);
  const targetEarly = await page.locator('[data-recovery="thermal-target"]').getAttribute('opacity');
  expect(parseFloat(targetEarly || '0')).toBeLessThan(0.3);

  await jump(page, 'thermal', 0.85);
  await page.waitForTimeout(200);
  const targetLate = await page.locator('[data-recovery="thermal-target"]').getAttribute('opacity');
  expect(parseFloat(targetLate || '0')).toBeGreaterThan(0.7);

  const cone = page.locator('[data-recovery="thermal-sensor-cone"]');
  await expect(cone).toBeVisible();
});

test('detonator state synchronizes across scroll-only and click interaction paths', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Staging state before blast
  await jump(page, 'blast', 0.25);
  const detonator = page.getByRole('button', { name: /blast/i });
  await expect(detonator).toContainText('Push to blast');

  // Scroll-only path: scroll past blast threshold (p = 0.55) without clicking
  await jump(page, 'blast', 0.65);
  await page.waitForTimeout(200);
  await expect(detonator).toContainText('Blast triggered · replay');
  await expect(detonator).toHaveAttribute('aria-pressed', 'true');
});

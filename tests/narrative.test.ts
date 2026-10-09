import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storyAt, storyBeats } from "../src/experience/core/storyBeats";
import { capabilities, sceneRegistry } from "../src/experience/core/sceneRegistry";
import { cameraAt, velocityNear } from "../src/experience/world/CameraDirector";
import { sceneMotionDirection, getTotalJourneyLength } from "../src/experience/core/motionDirection";
import { truckPose, excavatorPose, workerPose, safetyGeometry, materialFlowState, dronePose } from "../src/experience/world/actors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("source identities survive physical journey order",()=>{
 assert.deepEqual(Object.values(capabilities).map(cap=>cap.number).sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9,10,11,12]);
 assert.deepEqual(sceneRegistry.filter(s=>s.capability).slice(3,6).map(s=>s.capability!.number),[6,4,5]);
});
test("results confirm completed physical consequences",()=>{
 for(const [id, finished] of Object.entries({bucket:.91,driver:.76,conveyor:.90,sorter:.89,safety:.86,survey:.90,thermal:.79})){
  const beats=storyBeats[id as keyof typeof storyBeats]!;
  assert.ok(beats.find(b=>b.state==='result')!.at>finished,id);
 }
});
test("scene clocks reverse without persistent semantic side effects",()=>{
 assert.deepEqual([.95,.8,.6,.45,.34,.1].map(p=>storyAt('conveyor',p)),['result','action','solution','observing','problem','normal']);
 for(const scene of sceneRegistry) assert.equal(storyAt(scene.id,0),'normal');
});
test("camera poses meet exactly at every semantic boundary",()=>{
 for(let i=0;i<sceneRegistry.length-1;i++) {
  const exit=cameraAt(sceneRegistry[i].id,1),entry=cameraAt(sceneRegistry[i+1].id,0);
  for(const key of ['x','y','scale'] as const) assert.ok(Math.abs(exit[key]-entry[key])<1e-9,`${sceneRegistry[i].id} ${key}`);
 }
});

test("camera rests for observation and reverse seeks retrace the same pose",()=>{
 for(const scene of sceneRegistry) {
  const samples=[.1,.35,.65,.9].map(p=>cameraAt(scene.id,p));
  const backwards=[.9,.65,.35,.1].map(p=>cameraAt(scene.id,p)).reverse();
  assert.deepEqual(samples,backwards);
 }
});

test("camera moves are continuous: no cut inside any scene",()=>{
 for(const scene of sceneRegistry) {
  for(let i=1;i<=200;i++) {
   const a=cameraAt(scene.id,(i-1)/200), b=cameraAt(scene.id,i/200);
   const screen=Math.hypot(b.x-a.x,b.y-a.y)*Math.min(a.scale,b.scale,3)+Math.abs(Math.log(b.scale/a.scale))*400;
   assert.ok(screen<40,`${scene.id} jumps ${screen.toFixed(1)} at ${i/200}`);
  }
 }
});

test("camera scale is bounded and driver 13x zoom is eliminated",()=>{
 for(const scene of sceneRegistry) {
  for(let i=0;i<=100;i++) {
   const p = i / 100;
   const c = cameraAt(scene.id, p);
   assert.ok(Number.isFinite(c.x) && Number.isFinite(c.y), `${scene.id} non-finite pos`);
   assert.ok(c.scale > 0.05 && c.scale < 4.0, `${scene.id} scale ${c.scale} out of bounds`);
   if (scene.id === "driver") {
    assert.ok(c.scale <= 2.7, `driver scale ${c.scale} exceeded maximum cinematic threshold`);
   }
  }
 }
});

test("intentional rests hold composition and pass-through waypoints maintain non-zero momentum",()=>{
  // Intentional rests: delta over 0.2 interval is small
  for (const id of ["core", "froth", "safety", "conveyor"] as const) {
    const a = cameraAt(id, 0.35), b = cameraAt(id, 0.55);
    const movement = Math.hypot(b.x - a.x, b.y - a.y);
    assert.ok(movement < 100, `${id} rest move was ${movement.toFixed(1)}`);
  }
  // Pass-through tracking maintains momentum through intermediate waypoints
  for (const [id, minV] of [["haul", 100], ["excavation", 100], ["drill", 80], ["sorter", 25]] as const) {
    const p1 = 0.48, p2 = 0.52;
    const a = cameraAt(id, p1), b = cameraAt(id, p2);
    const velocity = Math.hypot(b.x - a.x, b.y - a.y) / (p2 - p1);
    assert.ok(velocity >= minV, `${id} pass-through velocity ${velocity.toFixed(1)} below ${minV}`);
  }
});

test("camera global boundary velocity: carry boundaries preserve momentum and direction", () => {
  for (let i = 0; i < sceneRegistry.length - 1; i++) {
    const s1 = sceneRegistry[i].id;
    const s2 = sceneRegistry[i + 1].id;
    const carrier = sceneMotionDirection[s1].transitionCarrier;
    if (carrier.boundaryMotion === "carry") {
      const v1 = velocityNear(s1, 0.999);
      const v2 = velocityNear(s2, 0.001);

      // 1. Non-zero carry momentum
      assert.ok(v1.speed > 10, `${s1}->${s2} exit speed ${v1.speed.toFixed(1)} too small for carry`);
      assert.ok(v2.speed > 10, `${s1}->${s2} entry speed ${v2.speed.toFixed(1)} too small for carry`);

      // 2. Direction continuity: dot product positive (no sudden reversal)
      const dot = v1.vx * v2.vx + v1.vy * v2.vy;
      assert.ok(dot > 0, `${s1}->${s2} reversed direction across boundary: dot=${dot}`);

      // 3. Speed continuity: reasonable ratio across boundary
      const ratio = v1.speed / v2.speed;
      assert.ok(
        ratio >= 0.35 && ratio <= 2.8,
        `${s1}->${s2} speed ratio ${ratio.toFixed(2)} outside carry tolerance (v1=${v1.speed.toFixed(1)}, v2=${v2.speed.toFixed(1)})`
      );
    }
  }
});

test("camera settle boundaries come to controlled rest", () => {
  for (let i = 0; i < sceneRegistry.length - 1; i++) {
    const s1 = sceneRegistry[i].id;
    const s2 = sceneRegistry[i + 1].id;
    const carrier = sceneMotionDirection[s1].transitionCarrier;
    if (carrier.boundaryMotion === "settle") {
      const v1 = velocityNear(s1, 0.999);
      const v2 = velocityNear(s2, 0.001);
      // Settle boundaries should reach controlled low speeds at boundary
      assert.ok(v1.speed < 40, `${s1}->${s2} settle exit speed ${v1.speed.toFixed(1)} was not settled (< 40)`);
      assert.ok(v2.speed < 40, `${s1}->${s2} settle entry speed ${v2.speed.toFixed(1)} was not settled (< 40)`);
    }
  }
});

test("truck travel is velocity-continuous across loading, haul, driver, crusher in global journey units", () => {
  // Global speed = localSpeed / sceneLength
  // loading -> haul
  const pLoad098 = truckPose("loading", 0.98);
  const pLoad1 = truckPose("loading", 1.0);
  const pHaul0 = truckPose("haul", 0);
  const pHaul002 = truckPose("haul", 0.02);
  assert.ok(Math.abs(pLoad1.x - pHaul0.x) < 1, "loading->haul x position discontinuity");
  const vLoadGlobal = ((pLoad1.x - pLoad098.x) / 0.02) / sceneMotionDirection.loading.desktopLength;
  const vHaulGlobal = ((pHaul002.x - pHaul0.x) / 0.02) / sceneMotionDirection.haul.desktopLength;
  const ratioLoadHaul = vLoadGlobal / vHaulGlobal;
  assert.ok(
    ratioLoadHaul >= 0.75 && ratioLoadHaul <= 1.33,
    `loading->haul global velocity ratio ${ratioLoadHaul.toFixed(3)} outside tolerance [0.75, 1.33]`
  );

  // haul -> driver
  const pHaul098 = truckPose("haul", 0.98);
  const pHaul1 = truckPose("haul", 1.0);
  const pDrv0 = truckPose("driver", 0);
  const pDrv002 = truckPose("driver", 0.02);
  assert.ok(Math.abs(pHaul1.x - pDrv0.x) < 1, "haul->driver x position discontinuity");
  const vHaulExitGlobal = ((pHaul1.x - pHaul098.x) / 0.02) / sceneMotionDirection.haul.desktopLength;
  const vDrvEntryGlobal = ((pDrv002.x - pDrv0.x) / 0.02) / sceneMotionDirection.driver.desktopLength;
  const ratioHaulDrv = vHaulExitGlobal / vDrvEntryGlobal;
  assert.ok(
    ratioHaulDrv >= 0.75 && ratioHaulDrv <= 1.33,
    `haul->driver global velocity ratio ${ratioHaulDrv.toFixed(3)} outside tolerance [0.75, 1.33]`
  );

  // driver -> crusher (controlled approach and deceleration)
  const pDrv098 = truckPose("driver", 0.98);
  const pDrv1 = truckPose("driver", 1.0);
  const pCrush0 = truckPose("crusher", 0);
  const pCrush002 = truckPose("crusher", 0.02);
  assert.ok(Math.abs(pDrv1.x - pCrush0.x) < 1, "driver->crusher x position discontinuity");
  const vDrvExitGlobal = ((pDrv1.x - pDrv098.x) / 0.02) / sceneMotionDirection.driver.desktopLength;
  const vCrushEntryGlobal = ((pCrush002.x - pCrush0.x) / 0.02) / sceneMotionDirection.crusher.desktopLength;
  const ratioDrvCrush = vDrvExitGlobal / vCrushEntryGlobal;
  assert.ok(
    ratioDrvCrush >= 0.75 && ratioDrvCrush <= 1.33,
    `driver->crusher global velocity ratio ${ratioDrvCrush.toFixed(3)} outside tolerance [0.75, 1.33]`
  );
});

test("safety physical causality: warning at p=0.70 actively causes machine intervention", () => {
  // Test using production safetyGeometry pure function
  const gApproach = safetyGeometry(0.35);
  const gNearWarning = safetyGeometry(0.68);
  assert.ok(
    gNearWarning.distanceToMachine < gApproach.distanceToMachine,
    "Worker did not approach excavator before warning"
  );
  assert.ok(!gApproach.warningActive, "Warning active prematurely");

  const gWarning = safetyGeometry(0.72);
  assert.ok(gWarning.warningActive, "Operator warning did not activate when worker entered hazard proximity");
  assert.ok(gWarning.swingHeld, "Excavator did not hold swing during clearance window");

  const gCleared = safetyGeometry(0.92);
  assert.ok(gCleared.workerCleared, "Worker did not clear danger area");
  assert.ok(!gCleared.swingHeld, "Excavator failed to resume motion after clearance");
});

test("worker and excavator poses are continuous across safety and bucket boundary", () => {
  const wSafetyExit = workerPose("safety", 1.0);
  const wBucketEntry = workerPose("bucket", 0.0);
  assert.ok(Math.abs(wSafetyExit.x - wBucketEntry.x) < 1e-4, "Worker X discontinuous at safety->bucket boundary");
  assert.equal(wSafetyExit.dir, wBucketEntry.dir, "Worker facing direction discontinuous at safety->bucket boundary");

  const exSafetyExit = excavatorPose("safety", 1.0);
  const exBucketEntry = excavatorPose("bucket", 0.0);
  assert.ok(Math.abs(exSafetyExit.x - exBucketEntry.x) < 1e-4, "Excavator X discontinuous at safety->bucket boundary");
});

test("conveyor belt-stop freezes physical motion deterministically between p=0.70 and p=0.90", () => {
  // Uses production materialFlowState pure function
  const statePre = materialFlowState("conveyor", 0.35);
  const stateStop1 = materialFlowState("conveyor", 0.72);
  const stateStop2 = materialFlowState("conveyor", 0.84);
  const statePost = materialFlowState("conveyor", 0.96);

  assert.ok(stateStop1.beltOffset > statePre.beltOffset, "Belt did not advance before foreign object arrival");
  assert.equal(stateStop1.beltOffset, stateStop2.beltOffset, "Belt offset changed during foreign object pause");
  assert.equal(stateStop1.feedOffset, stateStop2.feedOffset, "Feed particle offset changed during belt pause");
  assert.ok(stateStop1.beltStopped, "beltStopped flag was false during pause");
  assert.ok(statePost.beltOffset > stateStop2.beltOffset, "Belt offset did not resume advancing after foreign object removal");

  // Reversibility check: seeking backwards yields identical state
  const stateReverse = materialFlowState("conveyor", 0.72);
  assert.deepEqual(stateStop1, stateReverse, "Reverse seeking produced inconsistent conveyor state");
});

test("mobile Finale camera X moves monotonically right-to-left without reversal", () => {
  let prevX = cameraAt("finale", 0, "mobile").x;
  for (let p = 0.02; p <= 1.0; p += 0.02) {
    const curX = cameraAt("finale", p, "mobile").x;
    // Right-to-left retrace: X must never meaningfully increase
    assert.ok(
      curX <= prevX + 0.01,
      `Mobile Finale reversed direction at p=${p.toFixed(2)}: curX=${curX.toFixed(2)} > prevX=${prevX.toFixed(2)}`
    );
    prevX = curX;
  }
});

test("desktop Finale camera X moves monotonically into overview without reversal", () => {
  let prevX = cameraAt("finale", 0, "desktop").x;
  for (let p = 0.02; p <= 1.0; p += 0.02) {
    const curX = cameraAt("finale", p, "desktop").x;
    assert.ok(
      curX <= prevX + 0.01,
      `Desktop Finale reversed direction at p=${p.toFixed(2)}: curX=${curX.toFixed(2)} > prevX=${prevX.toFixed(2)}`
    );
    prevX = curX;
  }
});

test("drone travel is velocity-continuous across stockpile, survey, thermal in global journey units", () => {
  // stockpile -> survey
  const pStk098 = dronePose("stockpile", 0.98);
  const pStk1 = dronePose("stockpile", 1.0);
  const pSurv0 = dronePose("survey", 0);
  const pSurv002 = dronePose("survey", 0.02);
  assert.ok(Math.abs(pStk1.x - pSurv0.x) < 1, "stockpile->survey drone x position discontinuity");
  const vStkExitGlobal = ((pStk1.x - pStk098.x) / 0.02) / sceneMotionDirection.stockpile.desktopLength;
  const vSurvEntryGlobal = ((pSurv002.x - pSurv0.x) / 0.02) / sceneMotionDirection.survey.desktopLength;
  const ratioStkSurv = vStkExitGlobal / vSurvEntryGlobal;
  assert.ok(
    ratioStkSurv >= 0.70 && ratioStkSurv <= 1.45,
    `stockpile->survey global velocity ratio ${ratioStkSurv.toFixed(3)} outside tolerance`
  );

  // survey -> thermal
  const pSurv098 = dronePose("survey", 0.98);
  const pSurv1 = dronePose("survey", 1.0);
  const pTherm0 = dronePose("thermal", 0);
  const pTherm002 = dronePose("thermal", 0.02);
  assert.ok(Math.abs(pSurv1.x - pTherm0.x) < 1, "survey->thermal drone x position discontinuity");
  const vSurvExitGlobal = ((pSurv1.x - pSurv098.x) / 0.02) / sceneMotionDirection.survey.desktopLength;
  const vThermEntryGlobal = ((pTherm002.x - pTherm0.x) / 0.02) / sceneMotionDirection.thermal.desktopLength;
  const ratioSurvTherm = vSurvExitGlobal / vThermEntryGlobal;
  assert.ok(
    ratioSurvTherm >= 0.70 && ratioSurvTherm <= 1.45,
    `survey->thermal global velocity ratio ${ratioSurvTherm.toFixed(3)} outside tolerance`
  );
});

test("bridge scenes are configured as subordinate connector handoffs", () => {
  const bridges = ["excavation", "loading", "crusher", "slurry", "stockpile"] as const;
  for (const b of bridges) {
    const dir = sceneMotionDirection[b];
    assert.equal(dir.captionDirection.mode, "bridge", `${b} is not configured as bridge caption mode`);
    assert.ok(dir.captionDirection.bridgeCopy, `${b} missing bridge copy`);
    assert.ok(dir.captionDirection.maxOpacity! <= 0.8, `${b} bridge caption maxOpacity too high`);
  }
});

test("capsule CSS does not animate width or height layout geometries", async () => {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const css = await fs.readFile(path.resolve(__dirname, "../src/experience/hud/HUD.module.css"), "utf-8");

  // Verify transition does not contain width or height on .capsule or .expandedCard
  const capsuleMatch = css.match(/\.capsule\s*\{[^}]*\}/);
  assert.ok(capsuleMatch, "Could not find .capsule rule in HUD.module.css");
  const capsuleTrans = capsuleMatch[0].match(/transition\s*:[^;]*/);
  if (capsuleTrans) {
    assert.ok(!capsuleTrans[0].includes("width"), ".capsule transition animates width");
    assert.ok(!capsuleTrans[0].includes("height"), ".capsule transition animates height");
  }

  const expandedMatch = css.match(/\.expandedCard\s*\{[^}]*\}/);
  assert.ok(expandedMatch, "Could not find .expandedCard rule in HUD.module.css");
  const expandedTrans = expandedMatch[0].match(/transition\s*:[^;]*/);
  if (expandedTrans) {
    assert.ok(!expandedTrans[0].includes("width"), ".expandedCard transition animates width");
    assert.ok(!expandedTrans[0].includes("height"), ".expandedCard transition animates height");
  }
  assert.ok(!expandedMatch[0].includes("height: auto"), ".expandedCard must have stable height, not height: auto");
});

test("derived scroll totals match authoritative motion config", () => {
  const desktopTotal = getTotalJourneyLength("desktop");
  const mobileTotal = getTotalJourneyLength("mobile");

  const calcDesktop = sceneRegistry.reduce((acc, s) => acc + sceneMotionDirection[s.id].desktopLength, 0);
  const calcMobile = sceneRegistry.reduce((acc, s) => acc + sceneMotionDirection[s.id].mobileLength, 0);

  assert.ok(Math.abs(desktopTotal - calcDesktop) < 1e-6, "Desktop journey length mismatch");
  assert.ok(Math.abs(mobileTotal - calcMobile) < 1e-6, "Mobile journey length mismatch");
  assert.ok(desktopTotal >= 30 && desktopTotal <= 40, `Desktop total ${desktopTotal} outside expected range`);
  assert.ok(mobileTotal >= 20 && mobileTotal <= 30, `Mobile total ${mobileTotal} outside expected range`);
});

test("thermal footprint replaces static rectangle wipe", async () => {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const recoveryCode = await fs.readFile(path.resolve(__dirname, "../src/experience/world/RecoveryWorld.tsx"), "utf-8");

  assert.ok(recoveryCode.includes('data-recovery="thermal-footprint"'), "Missing thermal-footprint ellipse");
  assert.ok(recoveryCode.includes('data-recovery="thermal-sensor-cone"'), "Missing thermal-sensor-cone projection");
  assert.ok(!recoveryCode.includes('data-recovery="thermal-wipe"'), "Deprecated thermal-wipe rectangle still present");
});


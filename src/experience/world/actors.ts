import type { SceneId } from "../core/types";

export const sceneOrder: SceneId[] = ["arrival","drill","core","grade","blast","fragments","excavation","safety","bucket","loading","haul","driver","crusher","conveyor","sizing","sorter","slurry","froth","stockpile","survey","thermal","finale"];
export const clamp = (n: number) => Math.min(1, Math.max(0, n));
export const ramp = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const smooth = (n: number) => { const p = clamp(n); return p * p * (3 - 2 * p); };
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/** Heavy machinery: slow start, long carry, gentle stop. */
export const heavy = (n: number) => { const p = clamp(n); return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
export const gravity = (n: number) => { const p = clamp(n); return p * p; };
export const after = (scene: SceneId, id: SceneId) => sceneOrder.indexOf(scene) > sceneOrder.indexOf(id);

/** Plant offsets shared by art, camera and finale landmarks. */
export const PLANT_X = 3300;
export const RECOVERY_SHIFT = 500;

/** Haul road: pit floor, a long ramp out of the pit, then the run-of-mine pad at the crusher. */
const FLOOR_Y = 605, PAD_Y = 262, RAMP_A = 2520, RAMP_B = 3400;
export function roadY(x: number) {
  const t = clamp((x - RAMP_A) / (RAMP_B - RAMP_A));
  return mix(FLOOR_Y, PAD_Y, smooth(t));
}
export function roadAngle(x: number) {
  const d = 6;
  return Math.atan2(roadY(x + d) - roadY(x - d), 2 * d) * 180 / Math.PI;
}

export interface TruckPose { x: number; y: number; angle: number; facing: number; bed: number; payload: number; wheel: number }

/**
 * Continuous physical truck travel curve from shovel to crusher.
 * Loading -> Haul -> Driver -> Crusher transitions are velocity-continuous in global journey coordinates.
 */
export function truckPose(scene: SceneId, p: number): TruckPose {
  let x = 2560, facing = 1, bed = 0;
  if (scene === "bucket") {
    // Reversing into shovel loading position
    x = mix(2560, 2250, heavy(ramp(p, 0.62, 0.90)));
  } else if (scene === "loading") {
    // Waits stationary under bucket until loaded, then accelerates with exact global speed matching into haul
    const depart = ramp(p, 0.72, 1.0);
    x = 2250 + 136.8 * depart * depart - 56.8 * depart * depart * depart;
  } else if (scene === "haul") {
    // Steady haul road traversal across the pit
    x = mix(2330, 2860, p);
  } else if (scene === "driver") {
    // Ascending the ramp toward the crusher pad; matches haul exit global speed at p=0
    if (p < 0.78) {
      const t = p / 0.78;
      x = 2860 + 647.06 * t - 187.06 * t * t;
    } else {
      // Continuous braking begins before scene boundary, matching crusher arrival global velocity
      const t = ramp(p, 0.78, 1.0);
      x = 3320 + 201.09 * t - 81.09 * t * t;
    }
  } else if (scene === "crusher") {
    // Completes braking onto pad, turns around, and backs into the dump hopper
    const arrive = ramp(p, 0, 0.14);
    x = 3440 + 20 * arrive * (1 - arrive * 0.5);
    const turn = ramp(p, 0.14, 0.32);
    facing = Math.cos(turn * Math.PI);
    x += Math.sin(turn * Math.PI) * 30;
    x = mix(x, 3505, heavy(ramp(p, 0.32, 0.44)));
    bed = heavy(ramp(p, 0.44, 0.62)) * (1 - heavy(ramp(p, 0.76, 0.88)));
    // Empty, pulls forward down the clearing ramp
    x = mix(x, 3300, Math.pow(ramp(p, 0.86, 1.0), 2));
  } else if (scene === "conveyor") {
    x = mix(3300, 2640, smooth(ramp(p, 0, 0.60)) * 0.9 + ramp(p, 0, 0.60) * 0.1);
    facing = -1;
  } else if (after(scene, "conveyor")) {
    x = 2640;
    facing = -1;
  }

  const y = roadY(x);
  const angle = roadAngle(x);
  let payload = 0;
  if (scene === "bucket") payload = ramp(p, 0.90, 0.94);
  else if (scene === "loading") payload = 0.45 + ramp(p, 0.25, 0.60) * 0.55;
  else if (scene === "haul" || scene === "driver") payload = 1;
  else if (scene === "crusher") payload = 1 - ramp(p, 0.50, 0.70);

  return { x, y, angle, facing, bed, payload, wheel: (x - 2250) * 1.15 };
}

/** Cab centre in world space, used by the camera to ride alongside and enter the cab. */
export function cabPoint(t: TruckPose) {
  const lx = 128, ly = -64;
  const a = (t.angle * Math.PI) / 180;
  const fx = lx * t.facing;
  return {
    x: t.x + fx * Math.cos(a) - ly * Math.sin(a),
    y: t.y + fx * Math.sin(a) + ly * Math.cos(a),
  };
}

export interface ExcavatorPose {
  x: number;
  facing: number;
  boom: number;
  bucket: number;
  load: number;
  swing: number;
}

/** Where the blast plunger (an HTML button) stands on the ground, at the end of the charge line. */
export const DETONATOR = { x: 506, y: 692 };

/** World position of the bucket lip, derived from the same slew, boom and stick pose that draws it. */
export function bucketWorld(x: number, facing: number, boom: number) {
  const a = (boom * Math.PI) / 180,
    lx = 352,
    ly = -85;
  const rx = lx * Math.cos(a) - ly * Math.sin(a),
    ry = lx * Math.sin(a) + ly * Math.cos(a);
  return { x: x - 20 + facing * (74 + rx), y: 611 + ry };
}

export function excavatorPose(scene: SceneId, p: number): ExcavatorPose {
  let x = 1760,
    facing = -1,
    boom = -8,
    bucket = 0,
    load = 0,
    swing = 0;

  if (!after(scene, "fragments")) x = 2760;
  if (scene === "fragments") {
    x = mix(2760, 1760, heavy(ramp(p, 0.80, 1.0)));
  } else if (scene === "excavation") {
    const lower = heavy(ramp(p, 0.12, 0.42)),
      curl = heavy(ramp(p, 0.42, 0.58)),
      lift = heavy(ramp(p, 0.58, 0.90));
    boom = -8 + lower * 22 - lift * 22;
    bucket = curl * 48;
    load = curl;
  } else if (scene === "safety") {
    // Physical causality: excavator actively swings toward the conflict zone
    // until operator warning triggers at p = 0.70.
    // Holds in response to the warning while worker clears (p in [0.70, 0.86]),
    // then resumes swinging safely (p >= 0.87).
    if (p < 0.70) {
      swing = ramp(p, 0.15, 0.70) * 0.75;
    } else if (p < 0.87) {
      swing = 0.75;
    } else {
      swing = 0.75 + ramp(p, 0.87, 1.0) * 0.25;
    }
    facing = -Math.cos(heavy(swing) * Math.PI);
    boom = -8 + Math.sin(swing * Math.PI) * -4;
    bucket = 48;
    load = 1;
  } else if (scene === "bucket") {
    facing = 1;
    load = 1;
    const present = heavy(ramp(p, 0.08, 0.28)),
      tip = Math.sin(ramp(p, 0.74, 0.84) * Math.PI),
      raise = heavy(ramp(p, 0.82, 0.90)),
      dump = heavy(ramp(p, 0.90, 0.97));
    boom = -8 + present * 12 - raise * 14;
    bucket = 48 - present * 28 + tip * 34 + raise * 28 + dump * 48;
    load = 1 - dump * 0.55;
  } else if (scene === "loading") {
    facing = 1;
    const empty = heavy(ramp(p, 0.05, 0.35)),
      away = heavy(ramp(p, 0.45, 0.85));
    boom = -10 - away * 12;
    bucket = 96 + empty * 22 - away * 70;
    load = 0.45 * (1 - empty);
  } else if (after(scene, "loading")) {
    facing = 1;
    boom = -22;
    bucket = 48;
  }

  return { x, facing, boom, bucket, load, swing };
}

export interface DronePose {
  x: number;
  y: number;
  tilt: number;
}

/**
 * Continuous physical drone flight spanning stockpile takeoff through survey, thermal, and finale.
 * Velocities continue through scene boundaries without stalling.
 */
export function dronePose(scene: SceneId, p: number): DronePose {
  let x = 6020,
    y = 643,
    tilt = 0;

  if (scene === "stockpile") {
    // Takeoff from pad at p=0.45, smoothly accelerating forward and matching survey entry global speed
    const l = ramp(p, 0.45, 1.0);
    x = 6020 + 87.38 * l + 12.62 * l * l;
    y = mix(643, 360, Math.sin(l * Math.PI * 0.5));
    tilt = l * 3;
  } else if (scene === "survey") {
    // Continuous steady photogrammetry flight from 6120 to 6650
    x = mix(6120, 6650, p);
    y = mix(360, 265, p);
    tilt = Math.sin(p * Math.PI) * 5;
  } else if (scene === "thermal") {
    // Crosses smoothly into highwall inspection area; brief intentional inspection hover at p in [0.65, 0.85]
    if (p < 0.65) {
      const t = p / 0.65;
      x = mix(6650, 6930, t);
      y = mix(265, 240, t);
      tilt = Math.sin(t * Math.PI) * 4;
    } else if (p < 0.85) {
      // Intentional anomaly inspection hover
      x = 6930;
      y = 240;
      tilt = 0;
    } else {
      // Resumes flight toward ascent
      const t = ramp(p, 0.85, 1.0);
      x = mix(6930, 6960, t);
      y = mix(240, 220, t);
      tilt = -t * 3;
    }
  } else if (scene === "finale") {
    // Ascent into zenith overview
    const f = ramp(p, 0, 0.60);
    x = mix(6960, 7080, f);
    y = mix(220, 50, f);
    tilt = 0;
  }

  return { x, y, tilt };
}

export interface WorkerPose {
  x: number;
  y: number;
  dir: number;
  walk: number;
  bob: number;
}

export function workerPose(scene: SceneId, p: number): WorkerPose {
  let wx = 2700, dir = -1, walk = 0;
  if (scene === "safety") {
    const inT = heavy(ramp(p, 0.04, 0.48)), outT = heavy(ramp(p, 0.72, 0.90));
    wx = mix(mix(2700, 2070, inT), 2330, outT);
    dir = outT > 0 ? 1 : -1;
    walk = (p < 0.48 || (p > 0.72 && p < 0.90)) ? 1 : 0;
  } else if (scene === "bucket") {
    wx = mix(2330, 2780, heavy(ramp(p, 0.05, 0.50)));
    dir = 1;
    walk = p < 0.50 ? 1 : 0;
  } else if (after(scene, "bucket")) {
    wx = 2780;
  }
  const bob = walk ? Math.abs(Math.sin(wx / 14)) * 3 : 0;
  return { x: wx, y: 640 - bob, dir, walk, bob };
}

export interface SafetyGeometry {
  workerX: number;
  excavatorX: number;
  exclusionZoneRight: number;
  distanceToMachine: number;
  insideExclusionZone: boolean;
  warningActive: boolean;
  swingHeld: boolean;
  workerCleared: boolean;
}

export function safetyGeometry(p: number): SafetyGeometry {
  const w = workerPose("safety", p);
  const ex = excavatorPose("safety", p);
  const exclusionZoneCenter = 1740;
  const exclusionZoneRadius = 440;
  const exclusionZoneRight = exclusionZoneCenter + exclusionZoneRadius; // 2180
  const distanceToMachine = w.x - ex.x;
  const insideExclusionZone = w.x <= exclusionZoneRight;
  const warningActive = p >= 0.70;
  const swingHeld = p >= 0.70 && p < 0.87;
  const workerCleared = p >= 0.87 && w.x > exclusionZoneRight;

  return {
    workerX: w.x,
    excavatorX: ex.x,
    exclusionZoneRight,
    distanceToMachine,
    insideExclusionZone,
    warningActive,
    swingHeld,
    workerCleared,
  };
}

export const span = (n: number, a: number, b: number) => clamp((n - a) / (b - a));

export interface MaterialFlowState {
  beltStep: number;
  beltOffset: number;
  feedOffset: number;
  travel: number;
  beltStopped: boolean;
  toolX: number;
  toolY: number;
  toolLanded: boolean;
  toolTravelled: boolean;
  toolRemoved: boolean;
}

export function materialFlowState(scene: SceneId, progress: number): MaterialFlowState {
  const p = clamp(progress);
  const ids: SceneId[] = ['crusher','conveyor','sizing','sorter','slurry','froth','stockpile','survey','thermal','finale'];
  const index = ids.indexOf(scene);
  const beltStep = scene === 'conveyor' ? 220 * (p < 0.70 ? p : 0.70 + span(p, 0.90, 1.0) * 0.30) : 220 * p;
  const travel = index <= 0 ? 220 * p : index === 1 ? 220 + beltStep : 220 * Math.min(index, 4) + 220 * p;
  const beltStopped = scene === 'conveyor' && p >= 0.70 && p < 0.90;

  let toolX = 760, toolY = 460;
  let toolLanded = false, toolTravelled = false, toolRemoved = false;
  if (scene === 'conveyor') {
    const fall = gravity(ramp(p, 0.08, 0.28));
    const bounce = Math.sin(ramp(p, 0.28, 0.42) * Math.PI) * 12;
    toolLanded = p >= 0.28;
    const carry = ramp(p, 0.28, 0.70);
    toolTravelled = p >= 0.65;
    const lift = heavy(ramp(p, 0.78, 0.88));
    toolRemoved = p >= 0.88;
    toolX = 760 + carry * 180;
    toolY = 460 + fall * 88 - bounce - lift * 90;
  }

  return {
    beltStep,
    beltOffset: beltStep,
    feedOffset: travel,
    travel,
    beltStopped,
    toolX,
    toolY,
    toolLanded,
    toolTravelled,
    toolRemoved,
  };
}


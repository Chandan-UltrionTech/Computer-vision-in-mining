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
/** One truck from loading to dumping. Velocity is continuous across loading, haul, driver and crusher. */
export function truckPose(scene: SceneId, p: number): TruckPose {
  let x = 2560, facing = 1, bed = 0;
  if (scene === "bucket") x = mix(2560, 2250, heavy(ramp(p, .62, .9)));
  else if (scene === "loading") x = mix(2250, 2330, gravity(ramp(p, .78, 1)) );
  else if (scene === "haul") x = mix(2330, 2860, p);
  else if (scene === "driver") x = mix(2860, 3440, p);
  else if (scene === "crusher") {
    const arrive = ramp(p, 0, .14);
    x = mix(3440, 3470, 1 - (1 - arrive) * (1 - arrive));
    const turn = ramp(p, .14, .32);
    facing = Math.cos(turn * Math.PI);
    x += Math.sin(turn * Math.PI) * 30;
    x = mix(x, 3505, heavy(ramp(p, .32, .44)));
    bed = heavy(ramp(p, .44, .62)) * (1 - heavy(ramp(p, .76, .88)));
    // Empty, it pulls forward (downhill, facing left) to clear the hopper for the next load.
    x = mix(x, 3300, Math.pow(ramp(p, .86, 1), 2));
  } else if (scene === "conveyor") { x = mix(3300, 2640, smooth(ramp(p, 0, .6)) * .9 + ramp(p, 0, .6) * .1); facing = -1; }
  else if (after(scene, "conveyor")) { x = 2640; facing = -1; }
  const y = roadY(x);
  const angle = roadAngle(x);
  let payload = 0;
  if (scene === "bucket") payload = ramp(p, .9, .94);
  else if (scene === "loading") payload = .45 + ramp(p, .25, .6) * .55;
  else if (scene === "haul" || scene === "driver") payload = 1;
  else if (scene === "crusher") payload = 1 - ramp(p, .5, .7);
  return { x, y, angle, facing, bed, payload, wheel: (x - 2250) * 1.15 };
}
/** Cab centre in world space, used by the camera to ride alongside and enter the cab. */
export function cabPoint(t: TruckPose) {
  const lx = 128, ly = -64;
  const a = t.angle * Math.PI / 180;
  const fx = lx * t.facing;
  return { x: t.x + fx * Math.cos(a) - ly * Math.sin(a), y: t.y + fx * Math.sin(a) + ly * Math.cos(a) };
}

export interface ExcavatorPose { x: number; facing: number; boom: number; bucket: number; load: number; swing: number }
/** House slews on its tracks: dig into the muckpile, swing through the worker's path, load the truck. */
/** Where the blast plunger (an HTML button) stands on the ground, at the end of the charge line. */
export const DETONATOR = { x: 506, y: 692 };

/** World position of the bucket lip, derived from the same slew, boom and stick pose that draws it. */
export function bucketWorld(x: number, facing: number, boom: number) {
  const a = boom * Math.PI / 180, lx = 352, ly = -85;
  const rx = lx * Math.cos(a) - ly * Math.sin(a), ry = lx * Math.sin(a) + ly * Math.cos(a);
  return { x: x - 20 + facing * (74 + rx), y: 611 + ry };
}

export function excavatorPose(scene: SceneId, p: number): ExcavatorPose {
  let x = 1760, facing = -1, boom = -8, bucket = 0, load = 0, swing = 0;
  if (!after(scene, "fragments")) x = 2760;
  if (scene === "fragments") x = mix(2760, 1760, heavy(ramp(p, .8, 1)));
  else if (scene === "excavation") {
    const lower = heavy(ramp(p, .12, .42)), curl = heavy(ramp(p, .42, .58)), lift = heavy(ramp(p, .58, .9));
    boom = -8 + lower * 22 - lift * 22; bucket = curl * 48; load = curl;
  } else if (scene === "safety") {
    swing = ramp(p, .2, .42);
    facing = -Math.cos(heavy(swing) * Math.PI);
    boom = -8 + Math.sin(swing * Math.PI) * -4; bucket = 48; load = 1;
  } else if (scene === "bucket") {
    facing = 1; load = 1;
    const present = heavy(ramp(p, .08, .28)), tip = Math.sin(ramp(p, .74, .84) * Math.PI), raise = heavy(ramp(p, .82, .9)), dump = heavy(ramp(p, .9, .97));
    boom = -8 + present * 12 - raise * 14;
    bucket = 48 - present * 28 + tip * 34 + raise * 28 + dump * 48;
    load = 1 - dump * .55;
  } else if (scene === "loading") {
    facing = 1;
    const empty = heavy(ramp(p, .05, .35)), away = heavy(ramp(p, .45, .85));
    boom = -10 - away * 12; bucket = 96 + empty * 22 - away * 70; load = .45 * (1 - empty);
  } else if (after(scene, "loading")) { facing = 1; boom = -22; bucket = 48; }
  return { x, facing, boom, bucket, load, swing };
}

export interface DronePose { x: number; y: number; tilt: number }
/** In recovery-local coordinates; add RECOVERY_SHIFT for world space. */
export function dronePose(scene: SceneId, p: number): DronePose {
  let x = 6020, y = 643, tilt = 0;
  if (scene === "stockpile") { const l = smooth(ramp(p, .62, 1)); x = mix(6020, 6110, l); y = mix(643, 360, l); }
  else if (scene === "survey") { const f = smooth(ramp(p, 0, .9)); x = mix(6110, 6620, f); y = mix(360, 270, f); tilt = Math.sin(f * Math.PI) * 6; }
  else if (scene === "thermal") { const f = smooth(ramp(p, 0, .42)); x = mix(6620, 6960, f); y = mix(270, 240, f); tilt = Math.sin(f * Math.PI) * 5; }
  else if (scene === "finale") { const f = smooth(ramp(p, 0, .4)); x = mix(6960, 7060, f); y = mix(240, 60, f); }
  return { x, y, tilt };
}

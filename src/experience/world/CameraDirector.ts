import type { SceneId } from "../core/types";
import {
  bucketWorld,
  cabPoint,
  clamp,
  excavatorPose,
  PLANT_X as P,
  RECOVERY_SHIFT as R,
  sceneOrder,
  smooth,
  truckPose,
} from "./actors";
import {
  sceneMotionDirection,
  getSceneLength,
  getSceneStart,
  getSceneEnd,
  globalJourneyCoordinate,
  type CameraMode,
} from "../core/motionDirection";

export type { CameraMode };

/** World focus, zoom, screen anchor and roll. One camera rig for the whole journey. */
export interface CameraPose {
  x: number;
  y: number;
  scale: number;
  ax: number;
  ay: number;
  rot: number;
}
export type Shot = Partial<CameraPose> & { x: number; y: number; scale: number };

export type WaypointKind = "rest" | "pass";

export type Key = [
  at: number,
  pose: Shot,
  easeOrKind?: ((n: number) => number) | WaypointKind,
  kind?: WaypointKind,
];

export const pose = (
  x: number,
  y: number,
  scale: number,
  extra: Partial<CameraPose> = {},
): Shot => ({ x, y, scale, ...extra });

const cab = (
  scene: SceneId,
  p: number,
  scale: number,
  extra: Partial<CameraPose> = {},
): Shot => {
  const t = truckPose(scene, p),
    c = cabPoint(t);
  return { ...pose(c.x, c.y, scale), ...extra };
};

const truckSide = (
  scene: SceneId,
  p: number,
  scale: number,
  dx = -40,
  extra: Partial<CameraPose> = {},
): Shot => {
  const t = truckPose(scene, p);
  return pose(t.x + dx, t.y - 40, scale, extra);
};

/** Pose shared by two adjacent scenes. Exactly one pose exists at every semantic boundary. */
export const bounds: Record<string, Shot> = {
  "arrival>drill": pose(1000, 480, 0.9, { ax: 0.56, ay: 0.56 }),
  "drill>core": pose(520, 560, 1.7, { ax: 0.58 }),
  "core>grade": pose(420, 545, 1.7, { ax: 0.5 }),
  "grade>blast": pose(1060, 470, 1.08, { ax: 0.54 }),
  "blast>fragments": pose(1080, 500, 1.1, { ax: 0.54 }),
  "fragments>excavation": pose(1500, 540, 1.12, { ax: 0.5 }),
  "excavation>safety": pose(1880, 540, 1.3, { ax: 0.5 }),
  "safety>bucket": pose(2040, 470, 1.6, { ax: 0.5 }),
  "bucket>loading": pose(2250, 520, 1.55, { ax: 0.5 }),
  "loading>haul": truckSide("loading", 1, 1.45, -30),
  // Haul approaches the driver cab at scale 2.2 (no 13x zoom)
  "haul>driver": cab("haul", 1, 2.2, { ax: 0.5, ay: 0.54 }),
  "driver>crusher": pose(3420, 360, 1.5, { ay: 0.5 }),
  "crusher>conveyor": pose(P + 560, 470, 1.45, { ay: 0.52 }),
  "conveyor>sizing": pose(P + 780, 470, 1.4),
  "sizing>sorter": pose(P + 1080, 470, 1.4),
  "sorter>slurry": pose(R + 4560, 520, 1.4),
  "slurry>froth": pose(R + 5060, 500, 1.45),
  "froth>stockpile": pose(R + 5650, 500, 0.95),
  "stockpile>survey": pose(R + 6230, 470, 0.95, { ay: 0.58 }),
  "survey>thermal": pose(R + 6700, 430, 1, { ay: 0.56 }),
  "thermal>finale": pose(R + 6980, 400, 0.95, { ay: 0.56 }),
};
export const B = (a: SceneId, b: SceneId) => bounds[`${a}>${b}`];

const follow = (
  scene: SceneId,
  from: number,
  to: number,
  fn: (p: number) => Shot,
  samples = 9,
): Key[] =>
  Array.from({ length: samples }, (_, i) => {
    const p = from + ((to - from) * i) / (samples - 1);
    return [p, fn(p), "pass"] as Key;
  });

/** Authored shot keyframes with explicit rest vs pass semantics */
const desktopShots: Record<SceneId, Key[]> = {
  arrival: [
    [0, pose(1180, 480, 0.7, { ax: 0.64, ay: 0.64 }), "rest"],
    [0.25, pose(1180, 480, 0.7, { ax: 0.64, ay: 0.64 }), "pass"],
    [1, B("arrival", "drill"), "pass"],
  ],
  drill: [
    [0, B("arrival", "drill"), "pass"],
    [0.2, pose(690, 520, 1.35, { ax: 0.58 }), "pass"],
    [0.5, pose(700, 620, 1.4, { ax: 0.58 }), "pass"],
    [0.72, pose(680, 650, 1.45, { ax: 0.58 }), "pass"],
    [1, B("drill", "core"), "pass"],
  ],
  core: [
    [0, B("drill", "core"), "pass"],
    [0.18, pose(260, 600, 2.15, { ax: 0.44 }), "rest"],
    [0.8, pose(260, 600, 2.15, { ax: 0.44 }), "rest"],
    [1, B("core", "grade"), "pass"],
  ],
  grade: [
    [0, B("core", "grade"), "pass"],
    [0.22, pose(1020, 455, 1.02, { ax: 0.52 }), "rest"],
    [0.9, pose(1020, 455, 1.02, { ax: 0.52 }), "rest"],
    [1, B("grade", "blast"), "pass"],
  ],
  blast: [
    [0, B("grade", "blast"), "pass"],
    [0.12, pose(1000, 480, 1.08, { ax: 0.56 }), "pass"],
    [0.46, pose(1000, 480, 1.08, { ax: 0.56 }), "rest"],
    [0.62, pose(1040, 470, 1.04, { ax: 0.55 }), "pass"],
    [1, B("blast", "fragments"), "pass"],
  ],
  fragments: [
    [0, B("blast", "fragments"), "pass"],
    [0.2, pose(1120, 520, 1.25), "rest"],
    [0.84, pose(1120, 520, 1.25), "rest"],
    [1, B("fragments", "excavation"), "pass"],
  ],
  excavation: [
    [0, B("fragments", "excavation"), "pass"],
    [0.5, pose(1720, 530, 1.18), "pass"],
    [1, B("excavation", "safety"), "pass"],
  ],
  safety: [
    [0, B("excavation", "safety"), "pass"],
    [0.18, pose(1930, 560, 1.4), "rest"],
    [0.86, pose(1930, 560, 1.4), "rest"],
    [1, B("safety", "bucket"), "pass"],
  ],
  bucket: [
    [0, B("safety", "bucket"), "pass"],
    ...follow("bucket", 0.15, 0.85, (p) => {
      const e = excavatorPose("bucket", p),
        b = bucketWorld(e.x, e.facing, e.boom);
      return pose(b.x, b.y + 35, 2.7, { ax: 0.46 });
    }),
    [1, B("bucket", "loading"), "pass"],
  ],
  loading: [
    [0, B("bucket", "loading"), "pass"],
    [0.55, pose(2270, 520, 1.55), "pass"],
    [1, B("loading", "haul"), "pass"],
  ],
  haul: [
    [0, B("loading", "haul"), "pass"],
    ...follow("haul", 0.08, 0.68, (p) => {
      const lagP = Math.max(0, p - 0.02);
      return truckSide("haul", lagP, 1.35, -15);
    }),
    [0.82, cab("haul", 0.82, 1.8), "pass"],
    [1, B("haul", "driver"), "pass"],
  ],
  driver: [
    // Direct cab entry: camera moves to cab interior at scale 2.5 (NO 13x zoom!)
    [0, B("haul", "driver"), "pass"],
    [0.18, cab("driver", 0.18, 2.45, { rot: -truckPose("driver", 0.18).angle * 0.4, ay: 0.52 }), "rest"],
    ...follow("driver", 0.28, 0.78, (p) =>
      cab("driver", p, 2.5, {
        rot: -truckPose("driver", p).angle * 0.4,
        ay: 0.52,
      }),
      5,
    ),
    [0.88, cab("driver", 0.88, 2.2, { ay: 0.52 }), "pass"],
    [1, B("driver", "crusher"), "pass"],
  ],
  crusher: [
    [0, B("driver", "crusher"), "pass"],
    [0.2, pose(P + 330, 380, 1.32, { ay: 0.56 }), "pass"],
    [0.62, pose(P + 360, 400, 1.32, { ay: 0.54 }), "pass"],
    [1, B("crusher", "conveyor"), "pass"],
  ],
  conveyor: [
    [0, B("crusher", "conveyor"), "pass"],
    [0.18, pose(P + 640, 470, 1.5), "rest"],
    [0.92, pose(P + 680, 470, 1.5), "rest"],
    [1, B("conveyor", "sizing"), "pass"],
  ],
  sizing: [
    [0, B("conveyor", "sizing"), "pass"],
    [0.2, pose(P + 880, 470, 1.55), "rest"],
    [0.86, pose(P + 900, 470, 1.55), "rest"],
    [1, B("sizing", "sorter"), "pass"],
  ],
  sorter: [
    [0, B("sizing", "sorter"), "pass"],
    [0.2, pose(P + 1250, 470, 1.5), "pass"],
    [0.8, pose(P + 1290, 480, 1.5), "pass"],
    [1, B("sorter", "slurry"), "pass"],
  ],
  slurry: [
    [0, B("sorter", "slurry"), "pass"],
    [0.5, pose(R + 4830, 540, 1.6), "pass"],
    [1, B("slurry", "froth"), "pass"],
  ],
  froth: [
    [0, B("slurry", "froth"), "pass"],
    [0.18, pose(R + 5260, 470, 1.6), "rest"],
    [0.86, pose(R + 5260, 470, 1.6), "rest"],
    [1, B("froth", "stockpile"), "pass"],
  ],
  stockpile: [
    [0, B("froth", "stockpile"), "pass"],
    [0.4, pose(R + 6200, 540, 1.1), "pass"],
    [0.62, pose(R + 6180, 560, 1.15), "pass"],
    [1, B("stockpile", "survey"), "pass"],
  ],
  survey: [
    [0, B("stockpile", "survey"), "pass"],
    [0.22, pose(R + 6330, 470, 0.98, { ay: 0.6 }), "pass"],
    [0.86, pose(R + 6360, 470, 0.98, { ay: 0.6 }), "pass"],
    [1, B("survey", "thermal"), "pass"],
  ],
  thermal: [
    [0, B("survey", "thermal"), "pass"],
    [0.2, pose(R + 6930, 460, 1.18, { ay: 0.56 }), "rest"],
    [0.86, pose(R + 6930, 460, 1.18, { ay: 0.56 }), "rest"],
    [1, B("thermal", "finale"), "pass"],
  ],
  finale: [
    [0, B("thermal", "finale"), "pass"],
    [0.18, pose(R + 6450, 410, 0.55, { ay: 0.6 }), "pass"],
    [0.55, pose(4300, 420, 0.35, { ay: 0.60 }), "pass"],
    [0.78, pose(3800, 420, 0.24, { ay: 0.60 }), "rest"],
    [1, pose(3800, 420, 0.24, { ay: 0.60 }), "rest"],
  ],
};

/** Dedicated mobile shots: portrait cinematography, strictly monotonic right-to-left finale retrace */
const mobileOverrides: Partial<Record<SceneId, Key[]>> = {
  finale: [
    [0, B("thermal", "finale"), "pass"],
    // Phase A: Drone climbs, camera pulls wider around Recovery context
    [0.20, pose(R + 6550, 420, 0.70, { ay: 0.60 }), "pass"],
    // Phase B: Material movement recap (travels leftward toward sorting/conveyor/crusher)
    [0.48, pose(P + 680, 460, 0.58, { ay: 0.58 }), "pass"],
    // Phase C: Pit / Geology recap (continues leftward into shovel/safety/pit)
    [0.75, pose(1850, 490, 0.60, { ay: 0.56 }), "pass"],
    // Phase D: Settle on pit context where mobile synthesis layer communicates the 3 acts
    [0.88, pose(1250, 510, 0.60, { ay: 0.56 }), "rest"],
    [1.0, pose(1250, 510, 0.60, { ay: 0.56 }), "rest"],
  ],
};

function getShotsForScene(id: SceneId, mode: CameraMode): Key[] {
  if (mode === "mobile" && mobileOverrides[id]) {
    return mobileOverrides[id]!;
  }
  return desktopShots[id];
}

interface PrecomputedGlobalSpline {
  times: number[];
  x: { values: number[]; tangents: number[] };
  y: { values: number[]; tangents: number[] };
  logScale: { values: number[]; tangents: number[] };
  ax: { values: number[]; tangents: number[] };
  ay: { values: number[]; tangents: number[] };
  rot: { values: number[]; tangents: number[] };
}

/**
 * Fritsch-Carlson monotone cubic tangents guarantee:
 * 1. Monotonicity: no local extrema between monotone points (zero overshoot).
 * 2. C1-continuous velocity across waypoints: speed does not drop to zero unless marked as 'rest'.
 */
function computeTangents(times: number[], values: number[], kinds: WaypointKind[]): number[] {
  const n = times.length;
  if (n <= 1) return [0];
  const deltas: number[] = new Array(n - 1);
  const hs: number[] = new Array(n - 1);

  for (let i = 0; i < n - 1; i++) {
    hs[i] = Math.max(1e-6, times[i + 1] - times[i]);
    deltas[i] = (values[i + 1] - values[i]) / hs[i];
  }

  const tangents = new Array(n).fill(0);

  // Tangents at endpoints
  tangents[0] = kinds[0] === "rest" ? 0 : deltas[0];
  tangents[n - 1] = kinds[n - 1] === "rest" ? 0 : deltas[n - 2];

  // Intermediate tangents
  for (let i = 1; i < n - 1; i++) {
    if (kinds[i] === "rest") {
      tangents[i] = 0;
      continue;
    }
    const d0 = deltas[i - 1],
      d1 = deltas[i];
    if (d0 * d1 <= 0) {
      tangents[i] = 0;
    } else {
      // Harmonic mean (Fritsch-Carlson)
      const h0 = hs[i - 1],
        h1 = hs[i];
      const w0 = 2 * h1 + h0,
        w1 = h1 + 2 * h0;
      tangents[i] = ((h0 + h1) * 3) / (w0 / d0 + w1 / d1);
      // Clamp to prevent overshoot
      tangents[i] = Math.max(
        -3 * Math.min(Math.abs(d0), Math.abs(d1)),
        Math.min(3 * Math.min(Math.abs(d0), Math.abs(d1)), tangents[i]),
      );
    }
  }

  return tangents;
}

interface FlattenedKey {
  u: number;
  shot: Shot;
  kind: WaypointKind;
}

/**
 * Builds ONE global continuous camera path for the entire journey.
 * Boundary keyframes are de-duplicated and evaluated with tangents spanning both scenes.
 */
function buildGlobalSpline(mode: CameraMode): PrecomputedGlobalSpline {
  const flatKeys: FlattenedKey[] = [];

  for (let sceneIdx = 0; sceneIdx < sceneOrder.length; sceneIdx++) {
    const sceneId = sceneOrder[sceneIdx];
    const uStart = getSceneStart(sceneId, mode);
    const uEnd = getSceneEnd(sceneId, mode);
    const len = getSceneLength(sceneId, mode);
    const sceneKeys = getShotsForScene(sceneId, mode);

    for (let kIdx = 0; kIdx < sceneKeys.length; kIdx++) {
      const k = sceneKeys[kIdx];
      const localP = k[0];
      const shot = k[1];
      const rawKind = (typeof k[2] === "string" ? k[2] : k[3]) ?? "pass";
      const kind: WaypointKind = rawKind === "rest" ? "rest" : "pass";

      if (localP === 0) {
        if (sceneIdx === 0) {
          // Absolute journey start
          flatKeys.push({ u: 0, shot, kind });
        }
        // Intermediate p=0 is already authored by the previous scene's p=1 boundary
      } else if (localP === 1) {
        const u = uEnd;
        if (sceneIdx === sceneOrder.length - 1) {
          // Absolute journey finale end
          flatKeys.push({ u, shot, kind: "rest" });
        } else {
          // Boundary keyframe between this scene and the next
          const bMotion = sceneMotionDirection[sceneId]?.transitionCarrier?.boundaryMotion ?? "carry";
          const boundaryKind: WaypointKind = bMotion === "settle" ? "rest" : "pass";
          flatKeys.push({ u, shot, kind: boundaryKind });
        }
      } else {
        // Intermediate scene keyframe
        const u = uStart + localP * len;
        flatKeys.push({ u, shot, kind });
      }
    }
  }

  // Ensure keys are strictly sorted by global u
  flatKeys.sort((a, b) => a.u - b.u);

  // De-duplicate any epsilon identical timestamps if present
  const uniqueKeys: FlattenedKey[] = [];
  for (const k of flatKeys) {
    if (uniqueKeys.length === 0 || k.u > uniqueKeys[uniqueKeys.length - 1].u + 1e-5) {
      uniqueKeys.push(k);
    } else {
      // If duplicate, settle takes precedence over pass
      if (k.kind === "rest") uniqueKeys[uniqueKeys.length - 1].kind = "rest";
    }
  }

  const times = uniqueKeys.map((k) => k.u);
  const kinds = uniqueKeys.map((k) => k.kind);
  const extract = (fn: (s: Shot) => number) => uniqueKeys.map((k) => fn(k.shot));

  const xs = extract((s) => s.x);
  const ys = extract((s) => s.y);
  const logScales = extract((s) => Math.log(s.scale));
  const axs = extract((s) => s.ax ?? 0.5);
  const ays = extract((s) => s.ay ?? 0.56);
  const rots = extract((s) => s.rot ?? 0);

  return {
    times,
    x: { values: xs, tangents: computeTangents(times, xs, kinds) },
    y: { values: ys, tangents: computeTangents(times, ys, kinds) },
    logScale: { values: logScales, tangents: computeTangents(times, logScales, kinds) },
    ax: { values: axs, tangents: computeTangents(times, axs, kinds) },
    ay: { values: ays, tangents: computeTangents(times, ays, kinds) },
    rot: { values: rots, tangents: computeTangents(times, rots, kinds) },
  };
}

const desktopGlobalSpline = buildGlobalSpline("desktop");
const mobileGlobalSpline = buildGlobalSpline("mobile");

function evalHermite(
  t0: number,
  t1: number,
  v0: number,
  v1: number,
  m0: number,
  m1: number,
  t: number,
): number {
  const h = Math.max(1e-6, t1 - t0);
  const u = clamp((t - t0) / h);
  const u2 = u * u;
  const u3 = u2 * u;
  const h00 = 2 * u3 - 3 * u2 + 1;
  const h10 = u3 - 2 * u2 + u;
  const h01 = -2 * u3 + 3 * u2;
  const h11 = u3 - u2;
  return h00 * v0 + h10 * (h * m0) + h01 * v1 + h11 * (h * m1);
}

function evalHermiteDeriv(
  t0: number,
  t1: number,
  v0: number,
  v1: number,
  m0: number,
  m1: number,
  t: number,
): number {
  const h = Math.max(1e-6, t1 - t0);
  const u = clamp((t - t0) / h);
  const u2 = u * u;
  const dh00 = 6 * u2 - 6 * u;
  const dh10 = 3 * u2 - 4 * u + 1;
  const dh01 = -6 * u2 + 6 * u;
  const dh11 = 3 * u2 - 2 * u;
  return (dh00 * v0 + dh10 * (h * m0) + dh01 * v1 + dh11 * (h * m1)) / h;
}

function evalHermiteSecondDeriv(
  t0: number,
  t1: number,
  v0: number,
  v1: number,
  m0: number,
  m1: number,
  t: number,
): number {
  const h = Math.max(1e-6, t1 - t0);
  const u = clamp((t - t0) / h);
  const d2h00 = 12 * u - 6;
  const d2h10 = 6 * u - 4;
  const d2h01 = -12 * u + 6;
  const d2h11 = 6 * u - 2;
  return (d2h00 * v0 + d2h10 * (h * m0) + d2h01 * v1 + d2h11 * (h * m1)) / (h * h);
}

function evalHermiteJerk(
  t0: number,
  t1: number,
  v0: number,
  v1: number,
  m0: number,
  m1: number,
): number {
  const h = Math.max(1e-6, t1 - t0);
  return (12 * (v0 - v1) + 6 * h * (m0 + m1)) / (h * h * h);
}

function evalSplineAtU(spline: PrecomputedGlobalSpline, u: number): CameraPose {
  const times = spline.times;
  const maxU = times[times.length - 1];
  const targetU = Math.min(maxU, Math.max(0, u));

  let i = 0;
  while (i < times.length - 2 && targetU > times[i + 1]) i++;

  const t0 = times[i],
    t1 = times[i + 1];

  const evalDim = (dim: { values: number[]; tangents: number[] }) =>
    evalHermite(t0, t1, dim.values[i], dim.values[i + 1], dim.tangents[i], dim.tangents[i + 1], targetU);

  const x = evalDim(spline.x);
  const y = evalDim(spline.y);
  const scale = Math.exp(evalDim(spline.logScale));
  const ax = evalDim(spline.ax);
  const ay = evalDim(spline.ay);
  const rot = evalDim(spline.rot);

  return { x, y, scale, ax, ay, rot };
}

/** Pure function of semantic position. Seeking forward or backward retraces the same path. */
export function cameraAt(
  id: SceneId,
  progress: number,
  modeArg?: CameraMode | { mobile?: boolean },
): CameraPose {
  const mode: CameraMode =
    typeof modeArg === "object"
      ? modeArg.mobile
        ? "mobile"
        : "desktop"
      : modeArg ?? "desktop";

  const spline = mode === "mobile" ? mobileGlobalSpline : desktopGlobalSpline;
  const p = clamp(progress);
  const u = globalJourneyCoordinate(id, p, mode);

  const poseResult = evalSplineAtU(spline, u);

  if (id === "blast" && p > 0.5 && p < 0.64) {
    // Decaying impulse shake: the ground shakes, the framing does not jump
    const k = (p - 0.5) / 0.14,
      decay = Math.pow(1 - k, 2) * 9;
    poseResult.x += Math.sin(k * 61) * decay;
    poseResult.y += Math.cos(k * 47) * decay * 0.7;
  }

  return poseResult;
}

export interface CameraKinematics {
  vx: number;
  vy: number;
  speed: number;
  vLogScale: number;
  ax: number;
  ay: number;
  accelerationMagnitude: number;
  jerkMagnitude: number;
}

/**
 * Analytical kinematic evaluation along the global journey spline.
 * Evaluates exact first derivative (velocity), second derivative (acceleration), and jerk in global story units (du).
 */
export function cameraKinematicsAt(
  id: SceneId,
  progress: number,
  modeArg?: CameraMode | { mobile?: boolean },
): CameraKinematics {
  const mode: CameraMode =
    typeof modeArg === "object"
      ? modeArg.mobile
        ? "mobile"
        : "desktop"
      : modeArg ?? "desktop";

  const spline = mode === "mobile" ? mobileGlobalSpline : desktopGlobalSpline;
  const u = globalJourneyCoordinate(id, clamp(progress), mode);

  const times = spline.times;
  const maxU = times[times.length - 1];
  const targetU = Math.min(maxU, Math.max(0, u));

  let i = 0;
  while (i < times.length - 2 && targetU > times[i + 1]) i++;

  const t0 = times[i],
    t1 = times[i + 1];

  const evalDeriv = (dim: { values: number[]; tangents: number[] }) =>
    evalHermiteDeriv(t0, t1, dim.values[i], dim.values[i + 1], dim.tangents[i], dim.tangents[i + 1], targetU);
  const evalSecDeriv = (dim: { values: number[]; tangents: number[] }) =>
    evalHermiteSecondDeriv(t0, t1, dim.values[i], dim.values[i + 1], dim.tangents[i], dim.tangents[i + 1], targetU);
  const evalJerk = (dim: { values: number[]; tangents: number[] }) =>
    evalHermiteJerk(t0, t1, dim.values[i], dim.values[i + 1], dim.tangents[i], dim.tangents[i + 1]);

  const vx = evalDeriv(spline.x);
  const vy = evalDeriv(spline.y);
  const vLogScale = evalDeriv(spline.logScale);
  const speed = Math.hypot(vx, vy);

  const ax = evalSecDeriv(spline.x);
  const ay = evalSecDeriv(spline.y);
  const accelerationMagnitude = Math.hypot(ax, ay);

  const jx = evalJerk(spline.x);
  const jy = evalJerk(spline.y);
  const jerkMagnitude = Math.hypot(jx, jy);

  return {
    vx,
    vy,
    speed,
    vLogScale,
    ax,
    ay,
    accelerationMagnitude,
    jerkMagnitude,
  };
}

/** Finite-difference velocity vector evaluated in global journey units (du) */
export function velocityNear(
  id: SceneId,
  progress: number,
  modeArg?: CameraMode | { mobile?: boolean },
): { speed: number; vx: number; vy: number; vLogScale: number } {
  const mode: CameraMode =
    typeof modeArg === "object"
      ? modeArg.mobile
        ? "mobile"
        : "desktop"
      : modeArg ?? "desktop";

  const spline = mode === "mobile" ? mobileGlobalSpline : desktopGlobalSpline;
  const u = globalJourneyCoordinate(id, progress, mode);
  const eps = 0.005;

  const pBefore = evalSplineAtU(spline, u - eps);
  const pAfter = evalSplineAtU(spline, u + eps);

  const du = 2 * eps;
  const vx = (pAfter.x - pBefore.x) / du;
  const vy = (pAfter.y - pBefore.y) / du;
  const vLogScale = (Math.log(pAfter.scale) - Math.log(pBefore.scale)) / du;
  const speed = Math.hypot(vx, vy);

  return { speed, vx, vy, vLogScale };
}

export { smooth };
export const shotKeys = desktopShots;
export const shotOrder = sceneOrder;

export interface Frame {
  width: number;
  height: number;
  mobile: boolean;
}

export function pixelScale(f: Frame) {
  return f.mobile ? f.width / 860 : Math.min(f.width / 1400, f.height / 820) * 0.92;
}

/** Portrait screens centre the subject and lift it above the bottom-docked capsule. */
function anchor(c: CameraPose, f: Frame) {
  return f.mobile ? { ax: 0.5 + (c.ax - 0.5) * 0.4, ay: c.ay - 0.04 } : { ax: c.ax, ay: c.ay };
}

/** Screen position of a main-layer world point (roll ignored; only used where the camera is level). */
export function projectPoint(c: CameraPose, f: Frame, wx: number, wy: number) {
  const k = pixelScale(f) * c.scale;
  const { ax, ay } = anchor(c, f);
  return { x: f.width * ax + k * (wx - c.x), y: f.height * ay + k * (wy - c.y), k };
}

/**
 * Contextual Parallax Model:
 * Parallax strength is modulated by scene context (0 = flat/locked for close inspection, 1 = full environmental).
 * At extreme zoom (like cab interior), depth collapses cleanly to 1 to prevent background warping!
 */
export function cameraTransform(
  c: CameraPose,
  f: Frame,
  depth = 1,
  sceneId?: SceneId,
): string {
  const strength = sceneId ? sceneMotionDirection[sceneId]?.parallaxStrength ?? 1 : 1;
  const effectiveDepth = 1 + (depth - 1) * strength;
  const k = pixelScale(f) * c.scale * Math.pow(c.scale, (depth - 1) * strength);
  const { ax, ay } = anchor(c, f);
  const rot = depth === 1 ? c.rot : c.rot * effectiveDepth;
  const tx = -c.x * effectiveDepth;
  const ty = -(480 + (c.y - 480) * effectiveDepth);

  return `translate(${(f.width * ax).toFixed(1)} ${(f.height * ay).toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${k.toFixed(5)}) translate(${tx.toFixed(1)} ${ty.toFixed(1)})`;
}

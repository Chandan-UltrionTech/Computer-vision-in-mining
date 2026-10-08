import type { SceneId } from "../core/types";
import { bucketWorld, cabPoint, clamp, excavatorPose, PLANT_X as P, RECOVERY_SHIFT as R, sceneOrder, smooth, truckPose } from "./actors";

/** World focus, zoom, screen anchor and roll. One camera rig for the whole journey. */
export interface CameraPose { x: number; y: number; scale: number; ax: number; ay: number; rot: number }
type Shot = Partial<CameraPose> & { x: number; y: number; scale: number };
type Key = [at: number, pose: Shot, ease?: (n: number) => number];

const linear = (n: number) => n;
const pose = (x: number, y: number, scale: number, extra: Partial<CameraPose> = {}): Shot => ({ x, y, scale, ...extra });
const cab = (scene: SceneId, p: number, scale: number, extra: Partial<CameraPose> = {}): Shot => {
  const t = truckPose(scene, p), c = cabPoint(t);
  return { ...pose(c.x, c.y, scale), ...extra };
};
const truckSide = (scene: SceneId, p: number, scale: number, dx = -40, extra: Partial<CameraPose> = {}): Shot => {
  const t = truckPose(scene, p);
  return pose(t.x + dx, t.y - 40, scale, extra);
};

/** Pose shared by two adjacent scenes. Exactly one pose exists at every semantic boundary. */
const bounds: Record<string, Shot> = {
  "arrival>drill": pose(1000, 480, .9, { ax: .56, ay: .56 }),
  "drill>core": pose(520, 560, 1.7, { ax: .58 }),
  "core>grade": pose(420, 545, 1.7, { ax: .5 }),
  "grade>blast": pose(1060, 470, 1.08, { ax: .54 }),
  "blast>fragments": pose(1080, 500, 1.1, { ax: .54 }),
  "fragments>excavation": pose(1500, 540, 1.12, { ax: .5 }),
  "excavation>safety": pose(1880, 540, 1.3, { ax: .5 }),
  "safety>bucket": pose(2040, 470, 1.6, { ax: .5 }),
  "bucket>loading": pose(2250, 520, 1.55, { ax: .5 }),
  "loading>haul": truckSide("loading", 1, 1.45, -60),
  "haul>driver": cab("haul", 1, 2.3, { ax: .5, ay: .54 }),
  "driver>crusher": pose(3420, 360, 1.5, { ay: .5 }),
  "crusher>conveyor": pose(P + 560, 470, 1.45, { ay: .52 }),
  "conveyor>sizing": pose(P + 780, 470, 1.4),
  "sizing>sorter": pose(P + 1080, 470, 1.4),
  "sorter>slurry": pose(R + 4560, 520, 1.4),
  "slurry>froth": pose(R + 5060, 500, 1.45),
  "froth>stockpile": pose(R + 5650, 500, .95),
  "stockpile>survey": pose(R + 6230, 470, .95, { ay: .58 }),
  "survey>thermal": pose(R + 6700, 430, 1, { ay: .56 }),
  "thermal>finale": pose(R + 6980, 400, .95, { ay: .56 }),
};
const B = (a: SceneId, b: SceneId) => bounds[`${a}>${b}`];

const follow = (scene: SceneId, from: number, to: number, fn: (p: number) => Shot): Key[] =>
  Array.from({ length: 9 }, (_, i) => { const p = from + (to - from) * i / 8; return [p, fn(p), linear] as Key; });

const shots: Record<SceneId, Key[]> = {
  arrival: [[0, pose(1180, 480, .7, { ax: .64, ay: .64 })], [.25, pose(1180, 480, .7, { ax: .64, ay: .64 })], [1, B("arrival", "drill")]],
  drill: [[0, B("arrival", "drill")], [.2, pose(690, 520, 1.35, { ax: .58 })], [.5, pose(700, 620, 1.4, { ax: .58 })], [.72, pose(680, 650, 1.45, { ax: .58 })], [1, B("drill", "core")]],
  core: [[0, B("drill", "core")], [.18, pose(260, 600, 2.15, { ax: .44 })], [.8, pose(260, 600, 2.15, { ax: .44 })], [1, B("core", "grade")]],
  grade: [[0, B("core", "grade")], [.22, pose(1020, 455, 1.02, { ax: .52 })], [.9, pose(1020, 455, 1.02, { ax: .52 })], [1, B("grade", "blast")]],
  blast: [[0, B("grade", "blast")], [.12, pose(1000, 480, 1.08, { ax: .56 })], [.46, pose(1000, 480, 1.08, { ax: .56 })], [.62, pose(1040, 470, 1.04, { ax: .55 })], [1, B("blast", "fragments")]],
  fragments: [[0, B("blast", "fragments")], [.2, pose(1120, 520, 1.25)], [.84, pose(1120, 520, 1.25)], [1, B("fragments", "excavation")]],
  excavation: [[0, B("fragments", "excavation")], [.5, pose(1720, 530, 1.18)], [1, B("excavation", "safety")]],
  safety: [[0, B("excavation", "safety")], [.18, pose(1930, 560, 1.4)], [.86, pose(1930, 560, 1.4)], [1, B("safety", "bucket")]],
  bucket: [[0, B("safety", "bucket")], ...follow("bucket", .2, .8, p => { const e = excavatorPose("bucket", p), b = bucketWorld(e.x, e.facing, e.boom); return pose(b.x, b.y + 40, 3.1, { ax: .45 }); }), [1, B("bucket", "loading")]],
  loading: [[0, B("bucket", "loading")], [.55, pose(2290, 530, 1.55)], [1, B("loading", "haul")]],
  haul: [[0, B("loading", "haul")], ...follow("haul", .1, .62, p => truckSide("haul", p, 1.3, -10)), [.82, cab("haul", .82, 1.7)], [1, B("haul", "driver")]],
  driver: [[0, B("haul", "driver")], [.22, cab("driver", .22, 13, { rot: -truckPose("driver", .22).angle, ay: .52 })], ...follow("driver", .3, .74, p => cab("driver", p, 13, { rot: -truckPose("driver", p).angle, ay: .52 })), [1, B("driver", "crusher"), linear]],
  crusher: [[0, B("driver", "crusher")], [.2, pose(P + 330, 380, 1.32, { ay: .56 })], [.62, pose(P + 360, 400, 1.32, { ay: .54 })], [1, B("crusher", "conveyor")]],
  conveyor: [[0, B("crusher", "conveyor")], [.2, pose(P + 640, 470, 1.5)], [.94, pose(P + 680, 470, 1.5)], [1, B("conveyor", "sizing")]],
  sizing: [[0, B("conveyor", "sizing")], [.2, pose(P + 880, 470, 1.55)], [.86, pose(P + 900, 470, 1.55)], [1, B("sizing", "sorter")]],
  sorter: [[0, B("sizing", "sorter")], [.2, pose(P + 1250, 470, 1.5)], [.8, pose(P + 1290, 480, 1.5)], [1, B("sorter", "slurry")]],
  slurry: [[0, B("sorter", "slurry")], [.5, pose(R + 4830, 540, 1.6)], [1, B("slurry", "froth")]],
  froth: [[0, B("slurry", "froth")], [.2, pose(R + 5260, 470, 1.6)], [.86, pose(R + 5260, 470, 1.6)], [1, B("froth", "stockpile")]],
  stockpile: [[0, B("froth", "stockpile")], [.4, pose(R + 6200, 540, 1.1)], [.62, pose(R + 6180, 560, 1.15)], [1, B("stockpile", "survey")]],
  survey: [[0, B("stockpile", "survey")], [.22, pose(R + 6330, 470, .98, { ay: .6 })], [.86, pose(R + 6360, 470, .98, { ay: .6 })], [1, B("survey", "thermal")]],
  thermal: [[0, B("survey", "thermal")], [.2, pose(R + 6930, 460, 1.18, { ay: .56 })], [.86, pose(R + 6930, 460, 1.18, { ay: .56 })], [1, B("thermal", "finale")]],
  // The climb retraces the whole operation before settling on the complete mine.
  finale: [[0, B("thermal", "finale")], [.12, pose(R + 6500, 380, .5, { ay: .6 })], [.48, pose(3600, 400, .3, { ay: .62 })], [.64, pose(3830, 400, .19, { ay: .62 })], [1, pose(3830, 400, .19, { ay: .62 })]],
};

function mixPose(a: Shot, b: Shot, t: number): CameraPose {
  const m = (u: number, v: number) => u + (v - u) * t;
  return {
    x: m(a.x, b.x), y: m(a.y, b.y),
    // Logarithmic zoom keeps dolly speed proportional to distance.
    scale: Math.exp(m(Math.log(a.scale), Math.log(b.scale))),
    ax: m(a.ax ?? .5, b.ax ?? .5), ay: m(a.ay ?? .56, b.ay ?? .56), rot: m(a.rot ?? 0, b.rot ?? 0),
  };
}
/** Pure function of semantic position. Seeking forward or backward retraces the same path. */
export function cameraAt(id: SceneId, progress: number): CameraPose {
  const keys = shots[id], p = clamp(progress);
  let i = 0;
  while (i < keys.length - 2 && p > keys[i + 1][0]) i++;
  const [a, pa] = keys[i], [b, pb, ease] = keys[i + 1];
  const t = b === a ? 1 : clamp((p - a) / (b - a));
  const pose = mixPose(pa, pb, (ease ?? smooth)(t));
  if (id === "blast" && p > .5 && p < .64) {
    // A short, decaying impulse: the ground shakes, the framing does not change.
    const k = (p - .5) / .14, decay = Math.pow(1 - k, 2) * 9;
    pose.x += Math.sin(k * 61) * decay; pose.y += Math.cos(k * 47) * decay * .7;
  }
  return pose;
}
export { smooth };
export const shotKeys = shots;
export const shotOrder = sceneOrder;

export interface Frame { width: number; height: number; mobile: boolean }
export function pixelScale(f: Frame) {
  return f.mobile ? f.width / 860 : Math.min(f.width / 1400, f.height / 820) * .92;
}
/** Portrait screens centre the subject and lift it above the bottom-docked capsule. */
function anchor(c: CameraPose, f: Frame) {
  return f.mobile ? { ax: .5 + (c.ax - .5) * .4, ay: c.ay - .04 } : { ax: c.ax, ay: c.ay };
}
/** Screen position of a main-layer world point (roll ignored; only used where the camera is level). */
export function projectPoint(c: CameraPose, f: Frame, wx: number, wy: number) {
  const k = pixelScale(f) * c.scale;
  const { ax, ay } = anchor(c, f);
  return { x: f.width * ax + k * (wx - c.x), y: f.height * ay + k * (wy - c.y), k };
}

/** Parallax depth: far layers translate and zoom less than the operation layer. */
export function cameraTransform(c: CameraPose, f: Frame, depth = 1): string {
  const k = pixelScale(f) * Math.pow(c.scale, depth);
  const { ax, ay } = anchor(c, f);
  const rot = depth === 1 ? c.rot : c.rot * depth;
  return `translate(${(f.width * ax).toFixed(1)} ${(f.height * ay).toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${k.toFixed(5)}) translate(${(-c.x * depth).toFixed(1)} ${(-(480 + (c.y - 480) * depth)).toFixed(1)})`;
}

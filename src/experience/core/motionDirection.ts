import type { SceneId } from "./types";
import { sceneOrder } from "../world/actors";

export type SceneRole = "hero" | "capability" | "bridge" | "breath";
export type CameraIntent =
  | "establish"
  | "inspect"
  | "follow"
  | "track"
  | "reveal"
  | "hold"
  | "transition";

export type BoundaryMotion = "carry" | "settle";

export type CaptionMode = "hero" | "capability" | "bridge" | "hidden";

export interface CaptionDirection {
  mode: CaptionMode;
  fadeInStart: number;
  fadeInEnd: number;
  fadeOutStart: number;
  fadeOutEnd: number;
  maxOpacity?: number;
  bridgeCopy?: string;
}

export interface CaptionWindow {
  enter: number;
  exit: number;
  minimal?: boolean;
}

export interface TransitionCarrier {
  carrier: string;
  technique: string;
  boundaryMotion: BoundaryMotion;
}

export interface MotionDirection {
  role: SceneRole;
  cameraIntent: CameraIntent;
  ambientIntensity: 0 | 1 | 2 | 3;
  parallaxStrength: number;
  captionWindow: CaptionWindow;
  captionDirection: CaptionDirection;
  transitionCarrier: TransitionCarrier;
  desktopLength: number;
  mobileLength: number;
}

export const sceneMotionDirection: Record<SceneId, MotionDirection> = {
  arrival: {
    role: "hero",
    cameraIntent: "establish",
    ambientIntensity: 2,
    parallaxStrength: 1.0,
    captionWindow: { enter: 0.0, exit: 0.65 },
    captionDirection: { mode: "hero", fadeInStart: 0.0, fadeInEnd: 0.05, fadeOutStart: 0.40, fadeOutEnd: 0.65, maxOpacity: 1 },
    transitionCarrier: { carrier: "Drill rig / road", technique: "Motivated push into pit", boundaryMotion: "carry" },
    desktopLength: 1.15,
    mobileLength: 0.85,
  },
  drill: {
    role: "capability",
    cameraIntent: "reveal",
    ambientIntensity: 2,
    parallaxStrength: 0.8,
    captionWindow: { enter: 0.06, exit: 0.52 },
    captionDirection: { mode: "capability", fadeInStart: 0.06, fadeInEnd: 0.16, fadeOutStart: 0.44, fadeOutEnd: 0.54, maxOpacity: 1 },
    transitionCarrier: { carrier: "Extracted core", technique: "Subject follow", boundaryMotion: "carry" },
    desktopLength: 1.25,
    mobileLength: 0.9,
  },
  core: {
    role: "capability",
    cameraIntent: "inspect",
    ambientIntensity: 1,
    parallaxStrength: 0.15,
    captionWindow: { enter: 0.05, exit: 0.45 },
    captionDirection: { mode: "capability", fadeInStart: 0.05, fadeInEnd: 0.15, fadeOutStart: 0.40, fadeOutEnd: 0.50, maxOpacity: 1 },
    transitionCarrier: { carrier: "Geological seam", technique: "Graphic match", boundaryMotion: "carry" },
    desktopLength: 1.8,
    mobileLength: 1.25,
  },
  grade: {
    role: "capability",
    cameraIntent: "reveal",
    ambientIntensity: 1,
    parallaxStrength: 0.65,
    captionWindow: { enter: 0.08, exit: 0.48 },
    // Grade: appears only after Core->Grade visual match has started to become understandable
    captionDirection: { mode: "capability", fadeInStart: 0.28, fadeInEnd: 0.38, fadeOutStart: 0.65, fadeOutEnd: 0.78, maxOpacity: 1 },
    transitionCarrier: { carrier: "Bench / charge line", technique: "Context continuation", boundaryMotion: "settle" },
    desktopLength: 1.5,
    mobileLength: 1.1,
  },
  blast: {
    role: "hero",
    cameraIntent: "hold",
    ambientIntensity: 0,
    parallaxStrength: 0.85,
    captionWindow: { enter: 0.04, exit: 0.32 },
    captionDirection: { mode: "hero", fadeInStart: 0.04, fadeInEnd: 0.12, fadeOutStart: 0.28, fadeOutEnd: 0.38, maxOpacity: 1 },
    transitionCarrier: { carrier: "Dust / same bench", technique: "Consequence reveal", boundaryMotion: "carry" },
    desktopLength: 1.6,
    mobileLength: 1.2,
  },
  fragments: {
    role: "capability",
    cameraIntent: "inspect",
    ambientIntensity: 1,
    parallaxStrength: 0.55,
    captionWindow: { enter: 0.16, exit: 0.55 },
    captionDirection: { mode: "capability", fadeInStart: 0.16, fadeInEnd: 0.26, fadeOutStart: 0.48, fadeOutEnd: 0.58, maxOpacity: 1 },
    transitionCarrier: { carrier: "Excavator", technique: "Emergence through dust", boundaryMotion: "carry" },
    desktopLength: 1.7,
    mobileLength: 1.2,
  },
  excavation: {
    role: "bridge",
    cameraIntent: "transition",
    ambientIntensity: 2,
    parallaxStrength: 0.75,
    captionWindow: { enter: 0.08, exit: 0.5, minimal: true },
    captionDirection: { mode: "bridge", fadeInStart: 0.10, fadeInEnd: 0.18, fadeOutStart: 0.38, fadeOutEnd: 0.48, maxOpacity: 0.75, bridgeCopy: "Into the muckpile." },
    transitionCarrier: { carrier: "Worker + excavator", technique: "Converging motion", boundaryMotion: "carry" },
    desktopLength: 0.75,
    mobileLength: 0.6,
  },
  safety: {
    role: "hero",
    cameraIntent: "track",
    ambientIntensity: 1,
    parallaxStrength: 0.5,
    captionWindow: { enter: 0.12, exit: 0.5 },
    // Safety: appears as danger becomes perceptible
    captionDirection: { mode: "capability", fadeInStart: 0.22, fadeInEnd: 0.34, fadeOutStart: 0.70, fadeOutEnd: 0.82, maxOpacity: 1 },
    transitionCarrier: { carrier: "Bucket", technique: "Subject capture", boundaryMotion: "carry" },
    desktopLength: 1.8,
    mobileLength: 1.3,
  },
  bucket: {
    role: "capability",
    cameraIntent: "inspect",
    ambientIntensity: 1,
    parallaxStrength: 0.25,
    captionWindow: { enter: 0.06, exit: 0.42 },
    captionDirection: { mode: "capability", fadeInStart: 0.06, fadeInEnd: 0.16, fadeOutStart: 0.38, fadeOutEnd: 0.48, maxOpacity: 1 },
    transitionCarrier: { carrier: "Bucket + rocks", technique: "Match on action", boundaryMotion: "carry" },
    desktopLength: 2.0,
    mobileLength: 1.4,
  },
  loading: {
    role: "bridge",
    cameraIntent: "transition",
    ambientIntensity: 2,
    parallaxStrength: 0.7,
    captionWindow: { enter: 0.08, exit: 0.5, minimal: true },
    captionDirection: { mode: "bridge", fadeInStart: 0.10, fadeInEnd: 0.18, fadeOutStart: 0.38, fadeOutEnd: 0.48, maxOpacity: 0.75, bridgeCopy: "Follow the rock." },
    transitionCarrier: { carrier: "Rock -> truck", technique: "Attention transfer", boundaryMotion: "carry" },
    desktopLength: 0.8,
    mobileLength: 0.6,
  },
  haul: {
    role: "hero",
    cameraIntent: "follow",
    ambientIntensity: 3,
    parallaxStrength: 0.95,
    captionWindow: { enter: 0.08, exit: 0.46 },
    captionDirection: { mode: "hero", fadeInStart: 0.08, fadeInEnd: 0.18, fadeOutStart: 0.38, fadeOutEnd: 0.48, maxOpacity: 1 },
    transitionCarrier: { carrier: "Cab / window", technique: "Occlusion entry", boundaryMotion: "carry" },
    desktopLength: 1.15,
    mobileLength: 0.85,
  },
  driver: {
    role: "hero",
    cameraIntent: "inspect",
    ambientIntensity: 0,
    parallaxStrength: 0.0,
    captionWindow: { enter: 0.06, exit: 0.36 },
    // Driver: resolves during entry, then fades early so focus stays on fatigue cues
    captionDirection: { mode: "hero", fadeInStart: 0.10, fadeInEnd: 0.20, fadeOutStart: 0.36, fadeOutEnd: 0.48, maxOpacity: 1 },
    transitionCarrier: { carrier: "Truck / payload", technique: "Exit + follow", boundaryMotion: "carry" },
    desktopLength: 1.8,
    mobileLength: 1.3,
  },
  crusher: {
    role: "bridge",
    cameraIntent: "follow",
    ambientIntensity: 2,
    parallaxStrength: 0.65,
    captionWindow: { enter: 0.08, exit: 0.48, minimal: true },
    captionDirection: { mode: "bridge", fadeInStart: 0.10, fadeInEnd: 0.18, fadeOutStart: 0.38, fadeOutEnd: 0.48, maxOpacity: 0.75, bridgeCopy: "Into the crusher." },
    transitionCarrier: { carrier: "Hero rock", technique: "Material follow", boundaryMotion: "carry" },
    desktopLength: 1.35,
    mobileLength: 0.95,
  },
  conveyor: {
    role: "hero",
    cameraIntent: "track",
    ambientIntensity: 1,
    parallaxStrength: 0.3,
    captionWindow: { enter: 0.12, exit: 0.48 },
    // Conveyor: normal belt first, tool appears, then title appears
    captionDirection: { mode: "hero", fadeInStart: 0.25, fadeInEnd: 0.36, fadeOutStart: 0.68, fadeOutEnd: 0.80, maxOpacity: 1 },
    transitionCarrier: { carrier: "Same belt", technique: "Semantic transformation", boundaryMotion: "carry" },
    desktopLength: 3.0,
    mobileLength: 2.1,
  },
  sizing: {
    role: "capability",
    cameraIntent: "inspect",
    ambientIntensity: 1,
    parallaxStrength: 0.3,
    captionWindow: { enter: 0.06, exit: 0.46 },
    captionDirection: { mode: "capability", fadeInStart: 0.06, fadeInEnd: 0.16, fadeOutStart: 0.38, fadeOutEnd: 0.48, maxOpacity: 1 },
    transitionCarrier: { carrier: "Same particles", technique: "Analytical continuation", boundaryMotion: "carry" },
    desktopLength: 1.6,
    mobileLength: 1.15,
  },
  sorter: {
    role: "capability",
    cameraIntent: "track",
    ambientIntensity: 2,
    parallaxStrength: 0.4,
    captionWindow: { enter: 0.06, exit: 0.46 },
    captionDirection: { mode: "capability", fadeInStart: 0.06, fadeInEnd: 0.16, fadeOutStart: 0.38, fadeOutEnd: 0.48, maxOpacity: 1 },
    transitionCarrier: { carrier: "Accepted material", technique: "Material follow", boundaryMotion: "carry" },
    desktopLength: 1.7,
    mobileLength: 1.2,
  },
  slurry: {
    role: "bridge",
    cameraIntent: "transition",
    ambientIntensity: 2,
    parallaxStrength: 0.5,
    captionWindow: { enter: 0.08, exit: 0.5, minimal: true },
    captionDirection: { mode: "bridge", fadeInStart: 0.10, fadeInEnd: 0.18, fadeOutStart: 0.38, fadeOutEnd: 0.48, maxOpacity: 0.75, bridgeCopy: "Rock becomes process." },
    transitionCarrier: { carrier: "Process flow", technique: "Transformation", boundaryMotion: "settle" },
    desktopLength: 0.75,
    mobileLength: 0.55,
  },
  froth: {
    role: "breath",
    cameraIntent: "hold",
    ambientIntensity: 1,
    parallaxStrength: 0.1,
    captionWindow: { enter: 0.06, exit: 0.46 },
    captionDirection: { mode: "hero", fadeInStart: 0.06, fadeInEnd: 0.16, fadeOutStart: 0.38, fadeOutEnd: 0.48, maxOpacity: 1 },
    transitionCarrier: { carrier: "Product", technique: "Pullback", boundaryMotion: "carry" },
    desktopLength: 1.8,
    mobileLength: 1.3,
  },
  stockpile: {
    role: "bridge",
    cameraIntent: "reveal",
    ambientIntensity: 2,
    parallaxStrength: 0.8,
    captionWindow: { enter: 0.08, exit: 0.5, minimal: true },
    captionDirection: { mode: "bridge", fadeInStart: 0.10, fadeInEnd: 0.18, fadeOutStart: 0.38, fadeOutEnd: 0.48, maxOpacity: 0.75, bridgeCopy: "From process to product." },
    transitionCarrier: { carrier: "Drone", technique: "Subject launch", boundaryMotion: "carry" },
    desktopLength: 0.85,
    mobileLength: 0.6,
  },
  survey: {
    role: "hero",
    cameraIntent: "follow",
    ambientIntensity: 1,
    parallaxStrength: 0.7,
    captionWindow: { enter: 0.08, exit: 0.48 },
    captionDirection: { mode: "capability", fadeInStart: 0.08, fadeInEnd: 0.18, fadeOutStart: 0.40, fadeOutEnd: 0.50, maxOpacity: 1 },
    transitionCarrier: { carrier: "Drone + terrain", technique: "Sensor-mode change", boundaryMotion: "carry" },
    desktopLength: 2.2,
    mobileLength: 1.6,
  },
  thermal: {
    role: "hero",
    cameraIntent: "inspect",
    ambientIntensity: 1,
    parallaxStrength: 0.6,
    captionWindow: { enter: 0.08, exit: 0.48 },
    // Thermal: visible-spectrum first, then thermal discovery
    captionDirection: { mode: "capability", fadeInStart: 0.22, fadeInEnd: 0.34, fadeOutStart: 0.65, fadeOutEnd: 0.78, maxOpacity: 1 },
    transitionCarrier: { carrier: "Drone ascent", technique: "Scale revelation", boundaryMotion: "settle" },
    desktopLength: 1.8,
    mobileLength: 1.3,
  },
  finale: {
    role: "hero",
    cameraIntent: "establish",
    ambientIntensity: 1,
    parallaxStrength: 0.2,
    captionWindow: { enter: 0.82, exit: 0.98 },
    // Finale: thesis appears after operational synthesis is established
    captionDirection: { mode: "hero", fadeInStart: 0.86, fadeInEnd: 0.94, fadeOutStart: 1.0, fadeOutEnd: 1.0, maxOpacity: 1 },
    transitionCarrier: { carrier: "Operational network", technique: "Settled thesis", boundaryMotion: "settle" },
    desktopLength: 2.8,
    mobileLength: 2.0,
  },
};

export type CameraMode = "desktop" | "mobile";

export function getSceneLength(id: SceneId, mode: CameraMode = "desktop"): number {
  const dir = sceneMotionDirection[id];
  return mode === "mobile" ? dir.mobileLength : dir.desktopLength;
}

export function getTotalJourneyLength(mode: CameraMode = "desktop"): number {
  return sceneOrder.reduce((sum, id) => sum + getSceneLength(id, mode), 0);
}

export function getSceneStart(targetId: SceneId, mode: CameraMode = "desktop"): number {
  let acc = 0;
  for (const id of sceneOrder) {
    if (id === targetId) return acc;
    acc += getSceneLength(id, mode);
  }
  return acc;
}

export function getSceneEnd(targetId: SceneId, mode: CameraMode = "desktop"): number {
  return getSceneStart(targetId, mode) + getSceneLength(targetId, mode);
}

export function globalJourneyCoordinate(id: SceneId, localP: number, mode: CameraMode = "desktop"): number {
  const start = getSceneStart(id, mode);
  const len = getSceneLength(id, mode);
  return start + Math.min(1, Math.max(0, localP)) * len;
}

export function localFromGlobal(u: number, mode: CameraMode = "desktop"): { sceneId: SceneId; localP: number } {
  let acc = 0;
  for (const id of sceneOrder) {
    const len = getSceneLength(id, mode);
    if (u <= acc + len || id === sceneOrder[sceneOrder.length - 1]) {
      const localP = len > 0 ? Math.min(1, Math.max(0, (u - acc) / len)) : 0;
      return { sceneId: id, localP };
    }
    acc += len;
  }
  return { sceneId: "finale", localP: 1 };
}

/** Dynamic progress-sensitive ambient intensity */
export function ambientAt(scene: SceneId, progress: number): 0 | 1 | 2 | 3 {
  if (scene === "blast") {
    // Before detonation: stillness creates tension
    return progress < 0.48 ? 0 : 1;
  }
  if (scene === "driver") {
    // Inside driver cab: ambient distraction frozen
    return 0;
  }
  if (scene === "safety" || scene === "conveyor") {
    // Critical physical intervention: subdued ambient
    return 1;
  }
  if (scene === "froth" || scene === "core" || scene === "thermal") {
    return 1;
  }
  if (scene === "survey") {
    return 2;
  }
  if (scene === "finale") {
    // Early sweep across mine: level 1; operational synthesis & final thesis (>= 0.60): quiet (level 0)
    return progress < 0.60 ? 1 : 0;
  }
  if (scene === "arrival" || scene === "haul") {
    return 2;
  }
  return sceneMotionDirection[scene]?.ambientIntensity ?? 2;
}

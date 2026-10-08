import type { gsap } from "gsap";
export type NarrativeState =
  "normal" | "problem" | "observing" | "solution" | "result";
export type SceneId =
  | "arrival"
  | "drill"
  | "core"
  | "grade"
  | "blast"
  | "fragments"
  | "excavation"
  | "safety"
  | "bucket"
  | "loading"
  | "haul"
  | "driver"
  | "crusher"
  | "conveyor"
  | "sizing"
  | "sorter"
  | "slurry"
  | "froth"
  | "stockpile"
  | "survey"
  | "thermal"
  | "finale";
export type Handoff = "seam" | "rock" | "road" | "belt" | "water" | "drone";
export interface Choreography {
  mobile: boolean;
  reduced: boolean;
}
export type SceneTimeline = (
  root: HTMLElement,
  mode: Choreography,
) => gsap.core.Timeline;
export interface Capability {
  name: string;
  problem: string;
  observes: string;
  explanation: string;
  result: string;
}
export interface SceneDefinition {
  id: SceneId;
  part: 1 | 2 | 3;
  title: string;
  subtitle: string;
  stage: string;
  scrollLength: number;
  mobileLength: number;
  handoff: Handoff;
  anchor: "left" | "right" | "center";
  capability?: Capability;
  desktopTimeline: SceneTimeline;
  mobileTimeline: SceneTimeline;
}
export const BEATS = {
  problem: 0.2,
  observing: 0.39,
  solution: 0.53,
  result: 0.76,
  dormant: 0.92,
} as const;
export function narrativeAt(
  progress: number,
  hasCapability: boolean,
): NarrativeState {
  if (!hasCapability || progress < BEATS.problem || progress >= BEATS.dormant)
    return "normal";
  if (progress < BEATS.observing) return "problem";
  if (progress < BEATS.solution) return "observing";
  if (progress < BEATS.result) return "solution";
  return "result";
}

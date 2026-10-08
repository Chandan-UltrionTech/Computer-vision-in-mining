import type { gsap } from "gsap";
export type NarrativeState =
  "normal" | "problem" | "observing" | "solution" | "action" | "result";
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
  number: number;
  name: string;
  problem: string;
  observing: string;
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

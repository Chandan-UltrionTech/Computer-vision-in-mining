"use client";
import { create } from "zustand";
import type { NarrativeState, SceneId } from "../core/types";
interface ExperienceState {
  scene: SceneId;
  state: NarrativeState;
  part: number;
  progress: number;
  transition: boolean;
  cvEnabled: boolean;
  mobile: boolean;
  reduced: boolean;
  detonated: boolean;
  inJourney: boolean;
  setSemantic: (
    value: Partial<
      Pick<
        ExperienceState,
        | "scene"
        | "state"
        | "part"
        | "progress"
        | "transition"
        | "mobile"
        | "reduced"
        | "inJourney"
      >
    >,
  ) => void;
  toggleCV: () => void;
  detonate: () => void;
  setDetonated: (detonated: boolean) => void;
}
export const useExperience = create<ExperienceState>((set) => ({
  scene: "arrival",
  state: "normal",
  part: 1,
  progress: 0,
  transition: false,
  cvEnabled: true,
  mobile: false,
  reduced: false,
  detonated: false,
  inJourney: true,
  setSemantic: (value) => set(value),
  toggleCV: () => set((s) => ({ cvEnabled: !s.cvEnabled })),
  detonate: () => set({ detonated: true }),
  setDetonated: (detonated) => set({ detonated }),
}));

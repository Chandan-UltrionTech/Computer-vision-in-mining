"use client";
import { gsap, ScrollTrigger } from "./gsap";
import { createSmoothScroll } from "./lenis";
import { sceneRegistry } from "./sceneRegistry";
import { storyAt } from "./storyBeats";
import { useExperience } from "../store/experienceStore";
import { createStageDirector } from "../world/StageDirector";
import { after, ramp } from "../world/actors";
import { sceneMotionDirection } from "./motionDirection";
import type { SceneId } from "./types";

/** Narration choreography: timed to discovery per scene; minimal for bridge handoffs. */
export function captionAt(id: SceneId, p: number) {
  const dir = sceneMotionDirection[id];
  const cap = dir?.captionDirection ?? {
    mode: "capability",
    fadeInStart: 0.08,
    fadeInEnd: 0.17,
    fadeOutStart: 0.45,
    fadeOutEnd: 0.55,
    maxOpacity: 1,
  };
  if (id === "arrival") return { opacity: 1 - ramp(p, .3, .7), y: -ramp(p, .25, .8) * 40 };
  if (id === "finale") return { opacity: ramp(p, cap.fadeInStart, cap.fadeInEnd), y: (1 - ramp(p, cap.fadeInStart, cap.fadeInEnd)) * 14 };
  const inT = ramp(p, cap.fadeInStart, cap.fadeInEnd);
  const outT = ramp(p, cap.fadeOutStart, cap.fadeOutEnd);
  const maxOp = cap.maxOpacity ?? 1;
  const opacity = Math.min(inT, 1 - outT) * maxOp;
  const y = (1 - inT) * 12 - outT * 16;
  return { opacity, y };
}

/** Maps scroll to one semantic position. The stage director owns everything that is drawn. */
export class JourneyController {
  private media = gsap.matchMedia();
  constructor(private root: HTMLElement) {}
  mount() {
    this.media.add({ mobile: "(max-width: 767px)", desktop: "(min-width: 768px)", reduced: "(prefers-reduced-motion: reduce)" }, context => {
      const mobile = Boolean(context.conditions?.mobile), reduced = Boolean(context.conditions?.reduced);
      useExperience.getState().setSemantic({ mobile, reduced });
      const panels = Array.from(this.root.querySelectorAll<HTMLElement>("[data-scene]"));
      const chapters = Array.from(this.root.querySelectorAll<HTMLElement>("[data-scroll-chapter]"));
      const titles = panels.map(panel => panel.querySelector<HTMLElement>("[data-art=title]"));
      const finale = this.root.querySelector<HTMLElement>("[data-finale-thesis]");
      const finaleSynthesis = this.root.querySelector<HTMLElement>("[data-finale-synthesis]");
      const rail = document.querySelector<HTMLElement>("[data-rail-fill]");
      const trackEl = document.querySelector<HTMLElement>("[data-journey-track]");
      let disposed = false;
      const cleanups: (() => void)[] = [];
      if (reduced) {
        panels.forEach((panel, i) => {
          panel.inert = false;
          panel.removeAttribute("aria-hidden");
          const trigger = ScrollTrigger.create({ trigger: panel, start: "top center", end: "bottom center", onToggle: self => {
            if (self.isActive) useExperience.getState().setSemantic({ scene: sceneRegistry[i].id, part: sceneRegistry[i].part, state: sceneRegistry[i].capability ? "solution" : "normal", progress: Math.round(i / (panels.length - 1) * 100), transition: false });
          } });
          cleanups.push(() => trigger.kill());
        });
      } else {
        cleanups.push(createSmoothScroll(mobile));
        const svg = this.root.querySelector<SVGSVGElement>("[data-world-svg]")!;
        const stage = createStageDirector(svg, mobile);
        let lengths: number[] = [], total = 0;
        const measure = () => {
          stage.resize();
          lengths = sceneRegistry.map(s => (mobile ? s.mobileLength : s.scrollLength) * window.innerHeight);
          total = lengths.reduce((sum, n) => sum + n, 0);
          chapters.forEach((el, i) => { el.style.height = `${lengths[i]}px`; });
        };
        measure();
        let lastIndex = -1, lastKey = "";
        const render = (scroll: number) => {
          let accumulated = 0, index = lengths.length - 1;
          for (let i = 0; i < lengths.length; i++) {
            if (scroll < accumulated + lengths[i] || i === lengths.length - 1) { index = i; break; }
            accumulated += lengths[i];
          }
          const p = gsap.utils.clamp(0, 1, (scroll - accumulated) / lengths[index]);
          const journeyProgress = total > 0 ? gsap.utils.clamp(0, 1, scroll / total) : 0;
          const scene = sceneRegistry[index];
          if (index !== lastIndex) {
            panels.forEach((panel, i) => {
              const active = i === index;
              panel.inert = !active;
              panel.setAttribute("aria-hidden", String(!active));
              panel.style.visibility = active ? "visible" : "hidden";
              panel.style.pointerEvents = active ? "auto" : "none";
            });
            lastIndex = index;
          }
          stage.render(scene.id, p);
          const caption = captionAt(scene.id, p);
          const title = titles[index];
          if (title) { title.style.opacity = caption.opacity.toFixed(3); title.style.transform = `translate3d(0, ${caption.y.toFixed(1)}px, 0)`; }
          if (finale) finale.style.opacity = scene.id === "finale" ? ramp(p, .88, .97).toFixed(3) : "0";
          if (finaleSynthesis) {
            const synthActive = scene.id === "finale" && p >= 0.70;
            finaleSynthesis.setAttribute("data-active", synthActive ? "true" : "false");
            finaleSynthesis.style.opacity = synthActive ? ramp(p, 0.70, 0.85).toFixed(3) : "0";
          }
          const isHero = sceneMotionDirection[scene.id]?.role === "hero";
          const isHeroPeak = isHero && p > .22 && p < .82;
          if (rail) {
            rail.style.transform = `scaleX(${journeyProgress})`;
            rail.style.opacity = isHeroPeak ? ".45" : "1";
          }
          if (trackEl) {
            trackEl.setAttribute("data-quiet", isHeroPeak ? "true" : "false");
          }

          // Causal blast state synchronization
          if (scene.id === "blast") {
            if (p >= 0.48 && !useExperience.getState().detonated) {
              useExperience.getState().detonate();
            } else if (p < 0.35 && useExperience.getState().detonated) {
              useExperience.getState().setDetonated(false);
            }
          } else if (after(scene.id, "blast")) {
            if (!useExperience.getState().detonated) useExperience.getState().detonate();
          } else {
            if (useExperience.getState().detonated) useExperience.getState().setDetonated(false);
          }

          const state = storyAt(scene.id, p), pct = Math.round(journeyProgress * 100);
          const transition = p > .9 || (index > 0 && p < .1);
          const key = `${scene.id}:${state}:${pct}:${transition}`;
          if (key !== lastKey) { useExperience.getState().setSemantic({ scene: scene.id, state, part: scene.part, progress: pct, transition }); lastKey = key; }
        };
        const trigger = ScrollTrigger.create({ trigger: this.root, start: "top top", end: () => `+=${total}`, onRefreshInit: measure, onUpdate: self => render(self.progress * total), onRefresh: self => render(self.progress * total) });
        cleanups.push(() => trigger.kill());
        render(Math.max(0, window.scrollY - this.root.offsetTop));
      }
      const visibility = ScrollTrigger.create({ trigger: this.root, start: "top bottom", end: "bottom top+=140", onToggle: self => {
        useExperience.getState().setSemantic({ inJourney: self.isActive });
        this.root.dataset.ambient = self.isActive ? "running" : "paused";
      } });
      document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
      return () => {
        disposed = true;
        visibility.kill();
        cleanups.forEach(fn => fn());
        chapters.forEach(el => el.style.removeProperty("height"));
        if (finale) finale.style.removeProperty("opacity");
        panels.forEach((panel, i) => {
          panel.inert = false; panel.removeAttribute("aria-hidden");
          panel.style.removeProperty("visibility"); panel.style.removeProperty("pointer-events");
          titles[i]?.style.removeProperty("opacity"); titles[i]?.style.removeProperty("transform");
        });
      };
    });
    return () => this.media.revert();
  }
}

"use client";
import { gsap, ScrollTrigger } from "./gsap";
import { createSmoothScroll } from "./lenis";
import { sceneRegistry } from "./sceneRegistry";
import { storyAt } from "./storyBeats";
import { useExperience } from "../store/experienceStore";
import { createStageDirector } from "../world/StageDirector";
import { ramp } from "../world/actors";
import type { SceneId } from "./types";

/** Narration is a caption over the film: it arrives after the camera settles and leaves before CV explains. */
function captionAt(id: SceneId, p: number, hasCapability: boolean) {
  if (id === "arrival") return { opacity: 1 - ramp(p, .3, .7), y: -ramp(p, .25, .8) * 40 };
  if (id === "finale") return { opacity: ramp(p, .84, .94), y: (1 - ramp(p, .84, .96)) * 14 };
  const out = hasCapability ? ramp(p, .5, .62) : ramp(p, .78, .9);
  return { opacity: Math.min(ramp(p, .05, .15), 1 - out), y: (1 - ramp(p, .05, .2)) * 12 - out * 16 };
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
      const rail = document.querySelector<HTMLElement>("[data-rail-fill]");
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
          const caption = captionAt(scene.id, p, Boolean(scene.capability));
          const title = titles[index];
          if (title) { title.style.opacity = caption.opacity.toFixed(3); title.style.transform = `translate3d(0, ${caption.y.toFixed(1)}px, 0)`; }
          if (finale) finale.style.opacity = scene.id === "finale" ? ramp(p, .88, .97).toFixed(3) : "0";
          const progress = (accumulated + p * lengths[index]) / total;
          if (rail) rail.style.transform = `scaleX(${progress})`;
          const state = storyAt(scene.id, p), pct = Math.round(progress * 100);
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

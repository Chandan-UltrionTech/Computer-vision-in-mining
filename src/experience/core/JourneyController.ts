"use client";
import { gsap, ScrollTrigger } from "./gsap";
import { createSmoothScroll } from "./lenis";
import { sceneRegistry } from "./sceneRegistry";
import { narrativeAt, type Choreography } from "./types";
import { useExperience } from "../store/experienceStore";
import { createAmbientTimeline } from "../scenes/ambient";

/** Owns scroll coordinates and handoffs. Local timelines own machinery and overlays. */
export class JourneyController {
  private media = gsap.matchMedia();
  constructor(private root: HTMLElement) {}
  mount() {
    this.media.add(
      {
        mobile: "(max-width: 767px)",
        desktop: "(min-width: 768px)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const mode: Choreography = {
          mobile: Boolean(context.conditions?.mobile),
          reduced: Boolean(context.conditions?.reduced),
        };
        useExperience.getState().setSemantic({
          ...mode,
          scene: "arrival",
          state: "normal",
          progress: 0,
        });
        const disposeSmooth = mode.reduced ? () => {} : createSmoothScroll();
        const panels = Array.from(
          this.root.querySelectorAll<HTMLElement>("[data-scene]"),
        );
        const rail = document.querySelector<HTMLElement>("[data-rail-fill]");
        const chapters = this.root.querySelectorAll<HTMLElement>(
          "[data-scroll-chapter]",
        );
        const carrier = this.root.querySelector<HTMLElement>("[data-carrier]");
        let ambientTimelines: gsap.core.Timeline[] = [];
        if (mode.reduced) {
          panels.forEach((panel, index) =>
            ScrollTrigger.create({
              trigger: panel,
              start: "top center",
              end: "bottom center",
              onToggle: (self) => {
                if (self.isActive) {
                  const s = sceneRegistry[index];
                  useExperience.getState().setSemantic({
                    scene: s.id,
                    part: s.part,
                    state: s.capability ? "solution" : "normal",
                    progress: Math.round((index / (panels.length - 1)) * 100),
                  });
                }
              },
            }),
          );
        } else {
          const ambients = panels.map(createAmbientTimeline);
          ambientTimelines = ambients;
          const timelines = panels.map((panel, i) =>
            (mode.mobile
              ? sceneRegistry[i].mobileTimeline
              : sceneRegistry[i].desktopTimeline)(panel, mode),
          );
          let lengths = sceneRegistry.map(
            (s) =>
              (mode.mobile ? s.mobileLength : s.scrollLength) *
              window.innerHeight,
          );
          let total = lengths.reduce((sum, n) => sum + n, 0);
          chapters.forEach((el, i) => {
            el.style.height = `${lengths[i]}px`;
          });
          gsap.set(panels, { visibility: "hidden" });
          gsap.set(panels[0], { visibility: "visible" });
          let lastKey = "";
          let lastIndex = -1;
          const render = (scroll: number) => {
            let accumulated = 0;
            let index = lengths.length - 1;
            for (let i = 0; i < lengths.length; i++) {
              if (
                scroll <= accumulated + lengths[i] ||
                i === lengths.length - 1
              ) {
                index = i;
                break;
              }
              accumulated += lengths[i];
            }
            const p = gsap.utils.clamp(
              0,
              1,
              (scroll - accumulated) / lengths[index],
            );
            const scene = sceneRegistry[index];
            // The final world exits with native document scrolling, not a nonexistent next scene.
            const handoff =
              index === lengths.length - 1
                ? 0
                : gsap.utils.clamp(0, 1, (p - 0.88) / 0.12);
            if (index !== lastIndex) {
              ambients.forEach((timeline, i) =>
                i === index ? timeline.play() : timeline.pause(),
              );
              panels.forEach((panel, i) => {
                gsap.set(panel, {
                  visibility:
                    i === index || i === index + 1 ? "visible" : "hidden",
                  xPercent: 0,
                  yPercent: 0,
                });
              });
              lastIndex = index;
            }
            timelines[index].progress(p);
            const next = panels[index + 1];
            const vertical =
              mode.mobile ||
              scene.handoff === "rock" ||
              scene.handoff === "water" ||
              scene.handoff === "drone";
            gsap.set(panels[index], {
              xPercent: vertical ? 0 : -handoff * 100,
              yPercent: vertical ? -handoff * 100 : 0,
            });
            if (next) {
              timelines[index + 1].progress(0);
              gsap.set(next, {
                xPercent: vertical ? 0 : 100 - handoff * 100,
                yPercent: vertical ? 100 - handoff * 100 : 0,
              });
            }
            if (carrier) {
              carrier.dataset.kind = scene.handoff;
              const coverage = Math.sin(handoff * Math.PI);
              gsap.set(carrier, {
                opacity: handoff > 0 && next ? 1 : 0,
                scale: scene.handoff === "rock" ? coverage * 24 : 1,
                xPercent: (handoff - 0.5) * 200,
                yPercent: vertical ? (handoff - 0.5) * 160 : 0,
              });
            }
            const pct = Math.round(
              ((accumulated + p * lengths[index]) / total) * 100,
            );
            if (rail)
              gsap.set(rail, {
                scaleX: (accumulated + p * lengths[index]) / total,
                transformOrigin: "left",
              });
            const state = narrativeAt(p, Boolean(scene.capability));
            // A hazard stop is physical even when the intelligence overlay is hidden.
            if (scene.id === "conveyor") {
              if (p >= 0.59 && p < 0.89) ambients[index].pause();
              else ambients[index].play();
            }
            const transition = handoff > 0;
            const key = `${scene.id}:${state}:${pct}:${transition}`;
            if (key !== lastKey) {
              useExperience.getState().setSemantic({
                scene: scene.id,
                state,
                part: scene.part,
                progress: pct,
                transition,
              });
              lastKey = key;
            }
          };
          ScrollTrigger.create({
            trigger: this.root,
            start: "top top",
            end: () => `+=${total}`,
            onRefreshInit: () => {
              lengths = sceneRegistry.map(
                (s) =>
                  (mode.mobile ? s.mobileLength : s.scrollLength) *
                  window.innerHeight,
              );
              total = lengths.reduce((sum, n) => sum + n, 0);
              chapters.forEach((el, i) => {
                el.style.height = `${lengths[i]}px`;
              });
            },
            onUpdate: (self) => render(self.progress * total),
            onRefresh: (self) => render(self.progress * total),
          });
          render(0);
        }
        const visibility = ScrollTrigger.create({
          trigger: this.root,
          start: "top bottom",
          end: "bottom top+=140",
          onToggle: (s) => {
            useExperience.getState().setSemantic({ inJourney: s.isActive });
            if (!s.isActive) ambientTimelines.forEach((t) => t.pause());
          },
        });
        let disposed = false;
        document.fonts.ready.then(() => {
          if (!disposed) ScrollTrigger.refresh();
        });
        return () => {
          disposed = true;
          visibility.kill();
          disposeSmooth();
          chapters.forEach((el) => el.style.removeProperty("height"));
        };
      },
    );
    return () => this.media.revert();
  }
}

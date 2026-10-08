"use client";
import { gsap, ScrollTrigger } from "./gsap";
import { createSmoothScroll } from "./lenis";
import { sceneRegistry } from "./sceneRegistry";
import { type Choreography } from "./types";
import { storyAt } from "./storyBeats";
import { transitionShots } from "../transitions/choreography";
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
          panels.forEach(panel => {panel.inert = false;panel.removeAttribute("aria-hidden");});
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
          const worlds = panels.map(panel => panel.querySelector<SVGGElement>("[data-art=camera-frame]"));
          const titles = panels.map(panel => panel.querySelector<HTMLElement>("[data-art=title]"));
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
            const shot = transitionShots[scene.id];
            const handoff = shot ? gsap.utils.clamp(0, 1, (p - shot.start) / (1 - shot.start)) : 0;
            const blend = handoff * handoff * (3 - 2 * handoff);
            if (index !== lastIndex) {
              ambients.forEach((timeline, i) =>
                i === index ? timeline.play() : timeline.pause(),
              );
              panels.forEach((panel, i) => {
                panel.inert = i !== index;
                panel.setAttribute("aria-hidden",String(i !== index));
                gsap.set(panel, {
                  visibility:
                    i === index || i === index + 1 ? "visible" : "hidden",
                  xPercent: 0,
                  yPercent: 0,
                  opacity: i === index ? 1 : 0,
                  zIndex: i === index ? 1 : 2,
                  pointerEvents: i === index ? "auto" : "none",
                  clipPath: "none",
                });
              });
              lastIndex = index;
            }
            gsap.set(worlds[index], {scale:1,x:0,y:0});
            timelines[index].progress(index === 0 ? p : .08 + p * .92);
            const next = panels[index + 1];
            // Worlds overlap while the camera follows a physical subject. Panels never slide.
            gsap.set(panels[index], { opacity: 1 - blend, xPercent: 0, yPercent: 0 });
            if (titles[index]) gsap.set(titles[index], {opacity: 1 - Math.min(1, handoff * 2)});
            if (next) {
              gsap.set(worlds[index + 1], {scale:1,x:0,y:0});
              timelines[index + 1].progress(handoff * .08);
              gsap.set(next, {opacity: blend, xPercent: 0, yPercent: 0});
              gsap.set(titles[index + 1], {opacity: blend});
              if (shot?.kind === 'cab' || shot?.kind === 'slurry') {
                // Enter through the truck window / liquid surface, rather than dissolving a panel.
                gsap.set(panels[index], {opacity:1});
                gsap.set(next, {opacity:1,clipPath:`circle(${blend * 115}% at ${shot.kind === 'cab' ? '65% 64%' : '53% 65%'})`});
              } else if (shot?.kind === 'cabExit') {
                gsap.set(next, {opacity:1,zIndex:0});
                gsap.set(panels[index], {opacity:1,clipPath:`circle(${(1 - blend) * 115}% at 70% 60%)`});
              } else if (shot?.kind === 'crusherFall') {
                gsap.set(next, {opacity:1,clipPath:`inset(${(1 - blend) * 100}% 0 0 0)`});
              }
            }
            if (shot && handoff > 0) {
              const [sx, sy] = shot.from;
              const fixedWorld = shot.kind === 'sameBelt' || shot.kind === 'muckpile';
              gsap.set(worlds[index], {
                scale: fixedWorld ? 1 : 1 + (shot.scale - 1) * blend,
                x: fixedWorld || mode.mobile ? 0 : (700 - sx) * blend * .32,
                y: fixedWorld ? 0 : mode.mobile ? (470 - sy) * blend * .24 : (470 - sy) * blend * .32,
                svgOrigin: `${sx} ${sy}`,
              });
            }
            if (carrier && shot) {
              const physical = ['blastRock','payload','crusherFall','acceptedRock','coreSeam','droneLaunch','inspectionFlight'].includes(shot.kind);
              carrier.dataset.kind = shot.kind === 'coreSeam' ? 'seam' : ['droneLaunch','inspectionFlight'].includes(shot.kind) ? 'drone' : 'rock';
              let x = 0, y = 0;
              if (physical && handoff > 0) {
                const sourceMatrix = worlds[index]?.getScreenCTM();
                const targetMatrix = worlds[index + 1]?.getScreenCTM();
                const viewportBox = carrier.parentElement!.getBoundingClientRect();
                if (sourceMatrix && targetMatrix) {
                  const source = new DOMPoint(...shot.from).matrixTransform(sourceMatrix);
                  const target = new DOMPoint(...shot.to).matrixTransform(targetMatrix);
                  x = source.x + (target.x - source.x) * blend - viewportBox.x;
                  y = source.y + (target.y - source.y) * blend - viewportBox.y;
                }
              }
              gsap.set(carrier, {
                opacity: physical && handoff > 0 ? Math.sin(Math.PI * handoff) : 0,
                left: x, top: y,
                xPercent: -50, yPercent: -50,
                scale: shot.kind === 'blastRock' ? 1 + Math.sin(Math.PI * handoff) * 26 : shot.kind === 'coreSeam' ? 1 + blend * 5 : .7,
                rotation: shot.kind === 'blastRock' ? handoff * 75 : 0,
              });
            } else if (carrier) gsap.set(carrier, {opacity:0});
            const pct = Math.round(
              ((accumulated + p * lengths[index]) / total) * 100,
            );
            if (rail)
              gsap.set(rail, {
                scaleX: (accumulated + p * lengths[index]) / total,
                transformOrigin: "left",
              });
            const state = storyAt(scene.id, p);
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
          panels.forEach(panel => {panel.inert = false;panel.removeAttribute("aria-hidden");});
        };
      },
    );
    return () => this.media.revert();
  }
}

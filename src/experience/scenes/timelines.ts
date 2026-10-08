"use client";
import { gsap } from "../core/gsap";
import type { SceneId, SceneTimeline } from "../core/types";

/** Each composition exposes named groups. These timelines animate machinery, not React frames. */
export function createSceneTimeline(id: SceneId): SceneTimeline {
  return (root, mode) => {
    const q = (name: string) => root.querySelectorAll(`[data-art="${name}"]`);
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    const add = (
      name: string,
      vars: gsap.TweenVars,
      at: number,
      duration: number,
    ) => {
      if (q(name).length) tl.to(q(name), { ...vars, duration }, at);
    };
    tl.to({}, { duration: 1 });
    if (mode.reduced) return tl;
    if (q("cv").length) {
      gsap.set(q("cv"), { opacity: 0 });
      tl.set(q("cv"), { opacity: 0 }, 0);
      add("cv", { opacity: 1 }, 0.39, 0.13);
      if (id !== "finale") add("cv", { opacity: 0 }, 0.92, 0.08);
    }
    if (q("scan").length) {
      gsap.set(q("scan"), { opacity: 0 });
      tl.set(q("scan"), { opacity: 0 }, 0);
      add("scan", { opacity: 1 }, 0.38, 0.02);
      add("scan", { x: mode.mobile ? 240 : 560 }, 0.4, 0.32);
      add("scan", { opacity: 0 }, 0.73, 0.04);
    }
    const camera = mode.mobile ? 0.5 : 1;
    switch (id) {
      case "arrival":
        tl.from(
          q("ridge"),
          {
            strokeDasharray: 2000,
            strokeDashoffset: 2000,
            duration: 0.48,
            stagger: 0.07,
          },
          0,
        );
        add(
          "world",
          { scale: 1.26, x: -180 * camera, y: 85, transformOrigin: "75% 65%" },
          0.34,
          0.66,
        );
        add("title", { x: -430 * camera, y: -100 }, 0.2, 0.7);
        break;
      case "drill":
        add("pipe", { y: 165 }, 0.05, 0.5);
        add("core-rise", { y: -250 }, 0.58, 0.34);
        add(
          "world",
          { y: -45, scale: 1.08, transformOrigin: "50% 65%" },
          0.6,
          0.4,
        );
        break;
      case "core":
        add("core-tray", { x: -40 }, 0.02, 0.2);
        add("seam", { scaleX: 7, transformOrigin: "0% 50%" }, 0.8, 0.2);
        add("world", { scale: 0.92, transformOrigin: "50% 50%" }, 0.81, 0.19);
        break;
      case "grade":
        add("drone", { x: 340 * camera }, 0.05, 0.65);
        break;
      case "blast":
        tl.set(
          q("blast-cloud"),
          { opacity: 0, scale: 0.1, transformOrigin: "50% 100%" },
          0,
        );
        add("blast-cloud", { opacity: 1, scale: 1 }, 0.45, 0.16);
        add(
          "debris",
          { y: -150, x: 80, rotation: 65, transformOrigin: "50% 50%" },
          0.46,
          0.28,
        );
        add("debris", { y: 70 }, 0.75, 0.22);
        break;
      case "fragments":
        tl.from(q("pile"), { y: -65, duration: 0.18 }, 0);
        add("excavator", { x: -210 * camera }, 0.82, 0.18);
        break;
      case "excavation":
        tl.from(q("excavator"), { x: 320 * camera, duration: 0.6 }, 0);
        add("worker", { x: 170 * camera }, 0.12, 0.62);
        add("arm", { rotation: 12, svgOrigin: "770 465" }, 0.1, 0.65);
        break;
      case "safety":
        add("worker", { x: 155 * camera }, 0.02, 0.36);
        add("worker", { x: 40 * camera }, 0.76, 0.16);
        add("arm", { rotation: 9, svgOrigin: "770 465" }, 0.06, 0.54);
        break;
      case "bucket":
        add(
          "bucket-close",
          { rotation: -9, transformOrigin: "50% 20%" },
          0.02,
          0.24,
        );
        add("bucket-close", { rotation: 3, x: 65 }, 0.78, 0.16);
        add("good-load", { y: -65, x: 90 }, 0.79, 0.17);
        break;
      case "loading":
        add("arm", { rotation: -16, svgOrigin: "770 465" }, 0.05, 0.5);
        add("load-rocks", { y: 115, x: -160 }, 0.5, 0.22);
        add("truck", { x: 260 * camera }, 0.73, 0.25);
        break;
      case "haul":
        add("roadscape", { x: -350 * camera }, 0, 1);
        add("wheels", { rotation: 450, transformOrigin: "50% 50%" }, 0, 1);
        add(
          "world",
          { scale: 1.25, x: -125 * camera, transformOrigin: "55% 65%" },
          0.74,
          0.26,
        );
        break;
      case "driver":
        add(
          "head",
          { rotation: 16, y: 14, transformOrigin: "50% 80%" },
          0.1,
          0.25,
        );
        add(
          "eyelids",
          { scaleY: 0.14, transformOrigin: "50% 50%" },
          0.12,
          0.22,
        );
        add("head", { rotation: 0, y: 0 }, 0.77, 0.13);
        add("eyelids", { scaleY: 1 }, 0.77, 0.13);
        break;
      case "crusher":
        add("bed", { rotation: -25, transformOrigin: "5% 90%" }, 0.04, 0.3);
        add(
          "crusher-rock",
          { y: 145, scale: 0.55, transformOrigin: "50% 50%" },
          0.34,
          0.42,
        );
        add("jaw-left", { x: 40 }, 0.42, 0.18);
        add("jaw-right", { x: -40 }, 0.42, 0.18);
        add("crushed", { y: 100 }, 0.66, 0.3);
        break;
      case "conveyor":
        tl.set(q("tool"), { x: -160, y: -190, rotation: -28 }, 0);
        add("tool", { y: 0, rotation: 12 }, 0.08, 0.13);
        add("tool", { y: -13, rotation: 4 }, 0.21, 0.05);
        add("tool", { y: 0, rotation: 0 }, 0.26, 0.05);
        add("tool", { x: 65 }, 0.31, 0.28);
        add("detection", { x: 65 }, 0.31, 0.28);
        add(
          "operator-arm",
          { rotation: -32, transformOrigin: "100% 0%" },
          0.76,
          0.08,
        );
        add("tool", { y: -130, x: 110 }, 0.8, 0.08);
        add("belt-material", { x: 80 }, 0, 0.55);
        add("belt-material", { x: 170 }, 0.89, 0.11);
        break;
      case "sizing":
        add("belt-material", { x: 230 }, 0, 1);
        break;
      case "sorter":
        add("accepted", { x: 220, y: 90 }, 0.63, 0.25);
        add(
          "rejected",
          { x: 130, y: 220, rotation: 45, transformOrigin: "50% 50%" },
          0.64,
          0.25,
        );
        add("jet", { opacity: 1 }, 0.63, 0.07);
        add("jet", { opacity: 0 }, 0.76, 0.08);
        break;
      case "slurry":
        add(
          "mineral",
          { scale: 0.12, y: 110, transformOrigin: "50% 50%" },
          0.05,
          0.58,
        );
        add("water", { scaleY: 1, transformOrigin: "50% 100%" }, 0.3, 0.5);
        break;
      case "froth":
        add("bubbles", { x: 40, y: -8 }, 0.04, 0.85);
        add("signal", { strokeDashoffset: 0 }, 0.65, 0.2);
        break;
      case "stockpile":
        add("product", { y: 110 }, 0, 0.55);
        add(
          "world",
          { scale: 0.82, y: -30, transformOrigin: "50% 70%" },
          0.45,
          0.55,
        );
        add("drone", { y: -130 }, 0.74, 0.25);
        break;
      case "survey":
        add("drone", { y: -85, x: 170 * camera }, 0.04, 0.55);
        tl.set(q("cloud"), { opacity: 0 }, 0);
        tl.set(q("mesh"), { opacity: 0 }, 0);
        add("cloud", { opacity: 1 }, 0.46, 0.17);
        add("mesh", { opacity: 1 }, 0.63, 0.15);
        add(
          "world",
          { scale: 0.86, y: -30, transformOrigin: "50% 60%" },
          0.08,
          0.7,
        );
        break;
      case "thermal":
        tl.set(q("thermal"), { clipPath: "inset(0 100% 0 0)" }, 0);
        add("thermal", { clipPath: "inset(0 0% 0 0)" }, 0.4, 0.38);
        add("drone", { x: 150 * camera, y: -30 }, 0.08, 0.4);
        break;
      case "finale":
        tl.from(
          q("world"),
          {
            scale: 1.9,
            x: -260 * camera,
            y: 110,
            transformOrigin: "70% 60%",
            duration: 0.58,
          },
          0,
        );
        add("final-line-1", { opacity: 0, y: -15 }, 0.3, 0.12);
        tl.from(q("final-line-2"), { opacity: 0, y: 20, duration: 0.12 }, 0.4);
        add("final-line-2", { opacity: 0 }, 0.61, 0.1);
        tl.from(q("final-line-3"), { opacity: 0, y: 20, duration: 0.15 }, 0.69);
        break;
    }
    return tl;
  };
}

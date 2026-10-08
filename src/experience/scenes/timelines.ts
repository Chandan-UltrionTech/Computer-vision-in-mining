"use client";
import { gsap } from "../core/gsap";
import { storyBeats, beatAt } from "../core/storyBeats";
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
    for (const beat of storyBeats[id] ?? []) tl.addLabel(beat.name, beat.at);
    const observe = (storyBeats[id] ?? []).find(beat => beat.state === 'observing')?.at ?? .38;
    const dormant = (storyBeats[id] ?? []).find(beat => beat.state === 'normal')?.at ?? .98;
    const groups = Array.from(q('cv'));
    groups.forEach((group, index) => {
      gsap.set(group, {opacity:0});
      tl.to(group, {opacity:1,duration:.07}, id === 'finale' ? .34 + index * .025 : observe + Math.min(index * .025,.12));
      // Interpretive marks enter separately, with sensors first and labels last.
      const children = Array.from(group.children).filter(child => !['cloud','mesh','thermal'].includes(child.getAttribute('data-art') ?? ''));
      let toothIndex = 0;
      children.forEach((child, i) => {
        const named = child.getAttribute('data-cv-beat');
        const at = named ? beatAt(id,named,observe + .12) + (named === "healthyTeethPass" ? toothIndex++ * .025 : 0) : observe + .03 + Math.min(i * .017,.22);
        gsap.set(child,{opacity:0});
        tl.to(child,{opacity:1,duration:.055}, id === 'finale' ? .38 + i * .015 : at);
        if (child.tagName.toLowerCase() === 'path' && !child.hasAttribute('fill') && !child.hasAttribute('stroke-dasharray')) {
          const length = (child as SVGPathElement).getTotalLength();
          tl.fromTo(child,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:.11},at);
        }
      });
      if (id !== 'finale') tl.to(group,{opacity:0,duration:Math.min(.045,1-dormant)},dormant);
    });
    if (q('scan').length) {
      gsap.set(q('scan'),{opacity:0});
      add('scan',{opacity:1},observe,.025);
      add('scan',{x:mode.mobile ? 350 : 560},observe + .02,.29);
      add('scan',{opacity:0},observe + .32,.03);
    }
    const camera = mode.mobile ? 0.5 : 1;
    switch (id) {
      case "arrival":
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
        tl.fromTo(q('excavator'),{x:600},{x:0,duration:.2,ease:'power2.out'},.8);
        break;
      case "excavation":

        tl.fromTo(q("worker"),{x:0},{x:170,duration:.62},.12);
        add("arm", { rotation: 12, svgOrigin: "770 465" }, 0.1, 0.65);
        break;
      case "safety":
        tl.fromTo(q('worker'),{x:170},{x:325,duration:.36},.02);
        tl.fromTo(q('worker-track'),{x:170},{x:325,duration:.36},.02);
        add('worker',{x:170},.7,.16);
        add('worker-track',{x:170},.7,.16);
        tl.fromTo(q('distance-line'),{scaleX:1,svgOrigin:'790 558'},{scaleX:.28,duration:.36},.02);
        add('distance-line',{scaleX:1},.7,.16);
        add("arm", { rotation: 9, svgOrigin: "770 465" }, 0.06, 0.54);
        break;
      case "bucket":
        tl.fromTo(q('bucket-close'),{opacity:0,x:380,y:40},{opacity:1,x:0,y:0,duration:.27,ease:'power2.inOut'},0);
        add('bucket-context',{opacity:.12},.05,.2);

        add("bucket-close", { x: 45, y:-10 }, 0.78, 0.16);
        add("good-load", { y: 145, x: 395 }, 0.74, 0.17);
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
          0.18,
          0.24,
        );
        add(
          "eyelids",
          { scaleY: 0.14, transformOrigin: "50% 50%" },
          0.22,
          0.18,
        );
        add("head", { rotation: 0, y: 0 }, 0.77, 0.13);
        add("eyelids", { scaleY: 1 }, 0.77, 0.13);
        break;
      case "crusher":
        tl.fromTo(q('truck'),{x:75},{x:0,duration:.17},0);
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
        tl.fromTo(root.querySelectorAll('[data-art=detection] path'),{strokeDasharray:370,strokeDashoffset:370},{strokeDashoffset:0,duration:.12},beatAt(id,'objectDetected',.54));
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
        tl.fromTo(q("belt-material"),{x:170},{x:400,duration:1},0);
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
        const points = root.querySelectorAll('[data-art=cloud] circle');
        gsap.set(points,{opacity:0});
        tl.to(points,{opacity:1,duration:.08,stagger:{amount:mode.mobile ? .12 : .22}},.4);
        add("cloud", { opacity: 1 }, 0.4, 0.15);
        add("mesh", { opacity: 1 }, 0.63, 0.15);
        tl.fromTo(root.querySelectorAll('[data-art=mesh] path'),{strokeDasharray:1500,strokeDashoffset:1500},{strokeDashoffset:0,duration:.14,stagger:{amount:.06}},.63);
        add(
          "world",
          { scale: 0.86, y: -30, transformOrigin: "50% 60%" },
          0.08,
          0.7,
        );
        break;
      case "thermal":
        gsap.set(q('thermal-target'),{opacity:0});
        add('thermal-target',{opacity:1},.78,.055);
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
            transformOrigin: mode.mobile ? "50% 60%" : "70% 60%",
            duration: 0.58,
          },
          0,
        );
        if (mode.mobile) add("world", { scale: 0.65 }, 0.6, 0.2);
        add("final-line-1", { opacity: 0, y: -15 }, 0.3, 0.12);
        tl.from(q("final-line-2"), { opacity: 0, y: 20, duration: 0.12 }, 0.4);
        add("final-line-2", { opacity: 0 }, 0.61, 0.1);
        tl.from(q("final-line-3"), { opacity: 0, y: 20, duration: 0.15 }, 0.69);
        break;
    }
    if (mode.mobile && !['arrival','finale'].includes(id)) {
      const focus: Partial<Record<SceneId,[number,number]>> = {drill:[815,470],core:[725,480],grade:[700,470],bucket:[630,465],driver:[950,490],conveyor:[680,520],sizing:[720,525],froth:[745,490],survey:[650,490],thermal:[660,470]};
      const target = focus[id] ?? [750,530];
      tl.fromTo(q('world'),{y:id === 'sizing' ? -12 : 32,scale:1.03,svgOrigin:`${target[0]} ${target[1]}`},{y:-12,scale:id === 'driver' ? 1.12 : 1.03,duration:.65},0);
    }
    return tl;
  };
}

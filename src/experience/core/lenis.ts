"use client";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
/** Wheel input is smoothed lightly; touch stays native so fingers and camera never disagree. */
export function createSmoothScroll(mobile = false) {
  const lenis = new Lenis({
    autoRaf: false,
    smoothWheel: !mobile,
    lerp: .14,
    wheelMultiplier: .95,
    anchors: true,
  });
  const tick = (time: number) => lenis.raf(time * 1000);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.off("scroll", ScrollTrigger.update);
    lenis.destroy();
  };
}

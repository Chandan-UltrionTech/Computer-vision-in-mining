"use client";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
export function createSmoothScroll() {
  const lenis = new Lenis({
    autoRaf: false,
    smoothWheel: true,
    duration: 1.05,
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

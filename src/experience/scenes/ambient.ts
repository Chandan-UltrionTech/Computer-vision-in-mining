"use client";
import { gsap } from "../core/gsap";

/** Lightweight idle motion; the controller runs only the visible composition. */
export function createAmbientTimeline(root: HTMLElement) {
  const tl = gsap.timeline({ paused: true, repeat: -1 });
  const flow = root.querySelectorAll("[data-art=belt-flow]");
  const rotors = root.querySelectorAll("[data-art=rotor]");
  const bubbles = root.querySelectorAll("[data-art=froth-bubble]");
  if (flow.length)
    tl.to(flow, { strokeDashoffset: -72, duration: 3, ease: "none" }, 0);
  if (rotors.length)
    tl.to(
      rotors,
      {
        scaleX: 0.3,
        transformOrigin: "50% 50%",
        duration: 0.18,
        repeat: 15,
        yoyo: true,
        ease: "none",
      },
      0,
    );
  if (bubbles.length)
    tl.to(
      bubbles,
      {
        scale: 0.85,
        transformOrigin: "50% 50%",
        duration: 1.5,
        repeat: 1,
        yoyo: true,
        stagger: 0.04,
        ease: "sine.inOut",
      },
      0,
    );
  return tl;
}

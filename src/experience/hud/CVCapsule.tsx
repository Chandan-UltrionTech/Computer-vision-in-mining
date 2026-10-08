"use client";
import { useRef } from "react";
import { useGSAP, gsap } from "../core/gsap";
import { useExperience } from "../store/experienceStore";
import { sceneById } from "../core/sceneRegistry";
import styles from "./HUD.module.css";

export function CVCapsule() {
  const ref = useRef<HTMLDivElement>(null);
  const identity = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const contentTimeline = useRef<gsap.core.Timeline | null>(null);
  const scene = useExperience(s => s.scene);
  const state = useExperience(s => s.state);
  const enabled = useExperience(s => s.cvEnabled);
  const mobile = useExperience(s => s.mobile);
  const inJourney = useExperience(s => s.inJourney);
  const cap = sceneById[scene].capability;
  const active = Boolean(cap && state !== "normal" && enabled);
  useGSAP(() => {
    if (!ref.current || !identity.current || !copy.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : .58;
    const width = active ? Math.min(mobile ? window.innerWidth - 40 : 370, window.innerWidth - 40) : 38;
    const height = active ? (mobile ? 166 : state === "solution" ? 220 : 190) : 38;
    gsap.to(ref.current, {width, height, borderRadius: active ? 26 : 19, duration, ease:"power4.inOut", overwrite:true});
    const node = copy.current;
    const identityNode = identity.current;
    contentTimeline.current?.kill();
    const detail = !cap ? "" : state === "problem" ? cap.problem : state === "observing" ? cap.observing : state === "solution" ? cap.explanation : state === "action" ? "Operator response in progress. Follow the physical action below." : cap.result;
    const tl = gsap.timeline();
    contentTimeline.current = tl;
    tl.to(node, {opacity:0, y:-5, duration: reduced ? 0 : .14})
      .call(() => {
        node.replaceChildren();
        const label = document.createElement("small");
        label.textContent = state === "solution" ? "Computer vision" : state === "action" ? "Operational action" : state === "result" ? "Result confirmed" : state === "observing" ? "Observing" : "The mining problem";
        const paragraph = document.createElement("p"); paragraph.textContent = detail;
        node.append(label, paragraph);
        if (cap && identityNode.dataset.number !== String(cap.number)) {
          identityNode.replaceChildren();
          const number = document.createElement("span"); number.className = styles.caseNumber; number.textContent = String(cap.number).padStart(2,"0");
          const title = document.createElement("strong"); title.textContent = cap.name;
          identityNode.append(number, title); identityNode.dataset.number = String(cap.number);
        }
      })
      .to(identityNode, {opacity:active ? 1 : 0, duration:reduced ? 0 : .24}, .16)
      .fromTo(node, {y:7}, {y:0, opacity:active ? 1 : 0, duration:reduced ? 0 : .3, ease:"power2.out"}, .22);
  }, {scope:ref, dependencies:[scene,state,enabled,mobile]});
  return <div ref={ref} className={`${styles.capsule} ${!inJourney ? styles.hidden : ""}`} data-active={active} data-state={state} data-off={!enabled} role="status" aria-live="polite" aria-atomic="true" aria-label={!active ? (enabled ? "Computer vision dormant" : "Computer vision off") : undefined}>
    <span className={styles.statusIcon} aria-hidden="true">{enabled ? "◉" : "○"}</span>
    <div ref={identity} className={styles.capsuleIdentity}/>
    <div ref={copy} className={styles.capsuleContent}/>
  </div>;
}

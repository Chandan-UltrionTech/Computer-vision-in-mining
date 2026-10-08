"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "../core/gsap";
import { useExperience } from "../store/experienceStore";
import { sceneById } from "../core/sceneRegistry";
import styles from "./HUD.module.css";

export function CVCapsule() {
  const ref = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const scene = useExperience(s => s.scene);
  const state = useExperience(s => s.state);
  const enabled = useExperience(s => s.cvEnabled);
  const mobile = useExperience(s => s.mobile);
  const inJourney = useExperience(s => s.inJourney);
  const cap = sceneById[scene].capability;
  const active = Boolean(cap && state !== "normal" && enabled);
  const detail = !cap ? "" : state === "problem" ? cap.problem : state === "observing" ? cap.observing : state === "solution" ? cap.explanation : state === "action" ? "Operator response in progress. Follow the physical action below." : cap.result;
  const label = state === "solution" ? "Computer vision" : state === "action" ? "Operational action" : state === "result" ? "Result confirmed" : state === "observing" ? "Observing" : "The mining problem";

  useLayoutEffect(() => {
    const shell = ref.current, content = body.current;
    if (!shell || !content) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => {
      const bounds = content.getBoundingClientRect();
      gsap.to(shell, { width: active ? bounds.width : 38, height: active ? bounds.height : 38, borderRadius: active ? 22 : 19, duration: reduced ? 0 : .42, ease: "power3.out", overwrite: true });
    };
    resize();
    const detailNode = copy.current;
    if (detailNode) gsap.fromTo(detailNode, { opacity: active ? .3 : 0, y: active ? 3 : 0 }, { opacity: active ? 1 : 0, y: 0, duration: reduced ? 0 : .28, ease: "power2.out", overwrite: true });
    const observer = new ResizeObserver(resize);
    observer.observe(content);
    return () => {
      observer.disconnect();
      gsap.killTweensOf(shell);
      if (detailNode) gsap.killTweensOf(detailNode);
    };
  }, [scene, state, enabled, mobile, active]);

  return <div ref={ref} className={`${styles.capsule} ${!inJourney ? styles.hidden : ""}`} data-active={active} data-state={state} data-off={!enabled} role="status" aria-live="polite" aria-atomic="true" aria-label={!active ? (enabled ? "Computer vision dormant" : "Computer vision off") : undefined}>
    <span className={styles.statusIcon} aria-hidden="true">{enabled ? "◉" : "○"}</span>
    <div ref={body} className={styles.capsuleBody} aria-hidden={!active}>
      <div className={styles.capsuleIdentity}>
        <span className={styles.caseNumber}>{cap ? String(cap.number).padStart(2, "0") : ""}</span>
        <strong>{cap?.name}</strong>
      </div>
      <div ref={copy} className={styles.capsuleContent}><small>{label}</small><p>{detail}</p></div>
    </div>
  </div>;
}

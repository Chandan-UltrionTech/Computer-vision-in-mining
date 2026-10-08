"use client";
import { useRef } from "react";
import { useGSAP, gsap } from "../core/gsap";
import { useExperience } from "../store/experienceStore";
import { sceneById } from "../core/sceneRegistry";
import styles from "./HUD.module.css";
export function CVCapsule() {
  const ref = useRef<HTMLDivElement>(null);
  const scene = useExperience((s) => s.scene),
    state = useExperience((s) => s.state),
    enabled = useExperience((s) => s.cvEnabled),
    mobile = useExperience((s) => s.mobile),
    inJourney = useExperience((s) => s.inJourney);
  const s = sceneById[scene];
  const cap = s.capability;
  const active = Boolean(cap && state !== "normal" && enabled);
  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      gsap.to(ref.current, {
        width: active
          ? mobile
            ? "88%"
            : window.innerWidth < 1025
              ? 340
              : 390
          : mobile
            ? 104
            : 115,
        duration: reduced ? 0 : 0.45,
        ease: "power3.inOut",
      });
      if (active)
        gsap.fromTo(
          "[data-capsule-copy]",
          { y: 6, opacity: 0 },
          { y: 0, opacity: 1, duration: reduced ? 0 : 0.35 },
        );
    },
    { scope: ref, dependencies: [scene, state, enabled, mobile] },
  );
  const title = cap
    ? state === "problem"
      ? cap.problem
      : state === "observing"
        ? "Vision begins observing"
        : state === "solution"
          ? cap.name
          : cap.result
    : "";
  const detail = cap
    ? state === "observing"
      ? cap.observes
      : state === "solution"
        ? cap.explanation
        : ""
    : "";
  const symbol =
    state === "problem"
      ? "?"
      : state === "observing"
        ? "◎"
        : state === "result"
          ? "✓"
          : "◉";
  return (
    <div
      ref={ref}
      className={`${styles.capsule} ${!inJourney ? styles.hidden : ""}`}
      data-anchor={s.anchor}
      data-active={active}
      data-state={state}
      data-off={!enabled}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={styles.capsuleLine}>
        <span className={styles.statusIcon} aria-hidden="true">
          {enabled ? symbol : "○"}
        </span>
        <span>
          {!enabled
            ? "CV off"
            : active
              ? state === "problem"
                ? "A question from the mine"
                : state === "observing"
                  ? "Observing"
                  : state === "result"
                    ? "Operational result"
                    : "Computer vision"
              : "CV ready"}
        </span>
      </div>
      {active && (
        <div className={styles.capsuleContent} data-capsule-copy>
          <strong>{title}</strong>
          {detail && <p>{detail}</p>}
        </div>
      )}
    </div>
  );
}

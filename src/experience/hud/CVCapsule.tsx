"use client";
import { useEffect, useState, useRef } from "react";
import { useExperience } from "../store/experienceStore";
import { sceneById } from "../core/sceneRegistry";
import styles from "./HUD.module.css";

export function CVCapsule() {
  const scene = useExperience((s) => s.scene);
  const state = useExperience((s) => s.state);
  const enabled = useExperience((s) => s.cvEnabled);
  const inJourney = useExperience((s) => s.inJourney);

  const cap = sceneById[scene]?.capability;
  const active = Boolean(cap && state !== "normal" && enabled);

  const footprint = !active
    ? "dormant"
    : state === "problem"
      ? "problem"
      : "expanded";

  const detail = !cap
    ? ""
    : state === "problem"
      ? cap.problem
      : state === "observing"
        ? cap.observing
        : state === "solution"
          ? cap.explanation
          : state === "action"
            ? "Operator response in progress. Follow the physical action below."
            : cap.result;

  const label =
    state === "solution"
      ? "Computer vision"
      : state === "action"
        ? "Operational action"
        : state === "result"
          ? "Result confirmed"
          : state === "observing"
            ? "Observing"
            : "The mining problem";

  // Dedicated screen-reader announcement model: announce only on major capability milestones
  const [srAnnouncement, setSrAnnouncement] = useState("");
  const lastAnnouncedRef = useRef<string>("");

  useEffect(() => {
    if (!enabled) {
      if (lastAnnouncedRef.current !== "disabled") {
        setSrAnnouncement("Computer vision intelligence layer disabled");
        lastAnnouncedRef.current = "disabled";
      }
      return;
    }
    if (!cap || !active) return;

    if (state === "observing") {
      const key = `${cap.number}:observing`;
      if (lastAnnouncedRef.current !== key) {
        setSrAnnouncement(`Computer vision observing CV Case ${cap.number}: ${cap.name}. ${cap.problem}`);
        lastAnnouncedRef.current = key;
      }
    } else if (state === "result") {
      const key = `${cap.number}:result`;
      if (lastAnnouncedRef.current !== key) {
        setSrAnnouncement(`CV Case ${cap.number} result confirmed: ${cap.result}`);
        lastAnnouncedRef.current = key;
      }
    }
  }, [state, cap, active, enabled]);

  return (
    <div
      className={`${styles.capsule} ${!inJourney ? styles.hidden : ""}`}
      data-active={active}
      data-state={state}
      data-footprint={footprint}
      data-off={!enabled}
    >
      {/* 1. Dormant circular status indicator */}
      <div className={styles.dormantPill} aria-hidden="true">
        <span className={styles.statusIcon}>{enabled ? "◉" : "○"}</span>
      </div>

      {/* 2. Problem detection chip (case identity only, no layout shift) */}
      {cap && (
        <div className={styles.problemChip} aria-hidden={footprint !== "problem"}>
          <span className={styles.statusIcon}>{enabled ? "◉" : "○"}</span>
          <span className={styles.problemText}>
            CV CASE {String(cap.number).padStart(2, "0")}
          </span>
        </div>
      )}

      {/* 3. Stable footprint card: strictly fixed dimensions during observing -> solution -> action -> result */}
      {cap && (
        <div
          className={styles.expandedCard}
          aria-hidden={footprint !== "expanded"}
        >
          <div className={styles.capsuleHeader}>
            <span className={styles.caseBadge}>
              CV CASE {String(cap.number).padStart(2, "0")}
            </span>
            <strong className={styles.caseTitle}>{cap.name}</strong>
          </div>
          <div
            key={`${scene}-${state}`}
            className={styles.capsuleBody}
          >
            <small className={styles.capsulePhase}>{label}</small>
            <p className={styles.capsuleDetail}>{detail}</p>
          </div>
        </div>
      )}

      {/* 4. Visually hidden dedicated live region for polite assistive announcements */}
      <div
        className={styles.srAnnouncer}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {srAnnouncement}
      </div>
    </div>
  );
}

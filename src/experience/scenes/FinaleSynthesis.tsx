"use client";
import styles from "../styles/Journey.module.css";

export function FinaleSynthesis({ active = false }: { active?: boolean }) {
  return (
    <div
      className={styles.finaleSynthesis}
      data-finale-synthesis="true"
      data-active={active ? "true" : "false"}
      aria-label="Three Acts of Connected Mining Intelligence"
    >
      <div className={styles.synthesisHeader}>Synthesis · Complete Operation</div>
      <div className={styles.synthesisHeadline}>
        One computer-vision layer across twelve critical decisions.
      </div>

      <div className={styles.synthesisActs}>
        <div className={styles.synthesisAct}>
          <span className={styles.synthesisActTitle}>Act I · Understand the Rock</span>
          <span className={styles.synthesisActList}>
            01 Core logging · 02 Grade control · 03 Blast fragmentation
          </span>
        </div>

        <div className={styles.synthesisAct}>
          <span className={styles.synthesisActTitle}>Act II · Move the Mountain</span>
          <span className={styles.synthesisActList}>
            06 Exclusion zone · 04 Tooth wear · 05 Driver vigilance · 07 Foreign object · 08 Particle sizing · 09 Stream sorting
          </span>
        </div>

        <div className={styles.synthesisAct}>
          <span className={styles.synthesisActTitle}>Act III · Recover & Inspect</span>
          <span className={styles.synthesisActList}>
            10 Froth dynamics · 11 Stockpile survey · 12 Highwall thermal
          </span>
        </div>
      </div>
    </div>
  );
}

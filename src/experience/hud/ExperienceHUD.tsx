"use client";
import { CVCapsule } from "./CVCapsule";
import { CVToggle } from "./CVToggle";
import { JourneyTrack } from "./JourneyTrack";
import styles from "./HUD.module.css";
export function ExperienceHUD() {
  return (
    <>
      <header className={styles.header}>
        <a
          href="#mine"
          className={styles.brand}
          aria-label="Return to the beginning of the mining journey"
        >
          <svg
            viewBox="0 0 40 36"
            fill="none"
            stroke="#20221f"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m2 31 9-16 8 11 8-23 11 28Z" />
            <path d="m11 15 2 8 6 3m8-23-1 16 8 7" />
            <path d="m19 26 7-7" stroke="#f45b3d" strokeWidth="3" />
          </svg>
          Ultrion
        </a>
        <div className={styles.right}>
          <a className={styles.about} href="#deployment">
            From vision to deployment
          </a>
          <CVToggle />
        </div>
      </header>
      <CVCapsule />
      <JourneyTrack />
    </>
  );
}

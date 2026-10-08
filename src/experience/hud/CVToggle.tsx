"use client";
import { useExperience } from "../store/experienceStore";
import styles from "./HUD.module.css";
export function CVToggle() {
  const enabled = useExperience((s) => s.cvEnabled);
  return (
    <button
      className={styles.toggle}
      role="switch"
      aria-checked={enabled}
      aria-label="Computer vision intelligence layer"
      onClick={() => useExperience.getState().toggleCV()}
    >
      <span className={styles.switch} aria-hidden="true" />
      <span>CV layer</span>
      <strong>{enabled ? "ON" : "OFF"}</strong>
    </button>
  );
}

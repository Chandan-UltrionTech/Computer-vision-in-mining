"use client";
import { useExperience } from "../store/experienceStore";
import { sceneById, sceneRegistry } from "../core/sceneRegistry";
import styles from "./HUD.module.css";
export function JourneyTrack() {
  const scene = useExperience((s) => s.scene),
    progress = useExperience((s) => s.progress),
    part = useExperience((s) => s.part),
    inJourney = useExperience((s) => s.inJourney);
  const index = sceneRegistry.findIndex((s) => s.id === scene);
  return (
    <div
      className={`${styles.track} ${!inJourney ? styles.hidden : ""}`}
      aria-label={`Journey progress: ${progress} percent. ${sceneById[scene].stage}.`}
    >
      <div className={styles.routeText}>
        <span className={styles.current}>
          Part {["I", "II", "III"][part - 1]} / {sceneById[scene].stage}
        </span>
        <div className={styles.routeLabels}>
          <span>Drill</span>
          <span>Blast</span>
          <span>Dig</span>
          <span>Haul</span>
          <span>Crush</span>
          <span>Convey</span>
          <span>Sort</span>
          <span>Recover</span>
          <span>Survey</span>
          <span>Inspect</span>
        </div>
        <span>{String(progress).padStart(2, "0")}%</span>
      </div>
      <div className={styles.route}>
        <div className={styles.fill} data-rail-fill />
        <div className={styles.nodes}>
          {sceneRegistry.map((s, i) => (
            <i key={s.id} data-passed={i <= index} />
          ))}
        </div>
      </div>
      <div className={styles.hint}>
        The mining process is the path. Intelligence appears along the way.
      </div>
    </div>
  );
}

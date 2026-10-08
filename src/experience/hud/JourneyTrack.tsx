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
  const stages = ["drill","blast","excavation","haul","crusher","conveyor","sorter","froth","survey","thermal"];
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
          {stages.map((id) => (
            <i key={id} data-passed={sceneRegistry.findIndex(scene => scene.id === id) <= index} />
          ))}
        </div>
      </div>

    </div>
  );
}

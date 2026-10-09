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
  const context = part === 1 ? "Read the rock" : part === 2 ? "Move the material" : "Recover & inspect";
  return (
    <div
      className={`${styles.track} ${!inJourney ? styles.hidden : ""}`}
      data-journey-track
      aria-label={`Journey progress: ${progress} percent. ${sceneById[scene].stage}.`}
    >
      <div className={styles.routeText}>
        <span className={styles.current}>
          {context} · {sceneById[scene].stage}
        </span>
        <div className={styles.routeLabels}>
          {["Geology", "Pit", "Material flow", "Recovery", "Aerial"].map((label,i) => <span key={label} data-current={i === (index < 6 ? 0 : index < 12 ? 1 : index < 17 ? 2 : index < 19 ? 3 : 4)}>{label}</span>)}
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

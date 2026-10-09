import { GeologyPitWorld } from "./GeologyPitWorld";
import { MaterialFlowWorld } from "./MaterialFlowWorld";
import { RecoveryWorld } from "./RecoveryWorld";
import { FarLayer, ForegroundLayer, Ground, MidLayer } from "./Backdrop";
import { RECOVERY_SHIFT } from "./actors";
import { landmarks } from "./landmarks";
import styles from "../styles/Journey.module.css";

/** One connected operation. Semantic scenes move the camera and change actor state; nothing is swapped. */
export function PersistentWorldStage() {
  return <div className={styles.worldStage} data-persistent-stage>
    <svg data-world-svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#17191c" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <defs>
        <pattern id="world-hatch" width="24" height="24" patternUnits="userSpaceOnUse"><path d="m0 24 24-24" stroke="#c4c8cc" strokeWidth="1" /></pattern>
        <pattern id="geology-hatch" width="30" height="30" patternUnits="userSpaceOnUse"><path d="m0 30 30-30" stroke="#c4c8cc" strokeWidth="1" /></pattern>
      </defs>
      <FarLayer />
      <MidLayer />
      <g data-world-camera data-depth="1">
        <Ground />
        <GeologyPitWorld />
        <MaterialFlowWorld />
        <g transform={`translate(${RECOVERY_SHIFT} 0)`}><RecoveryWorld /></g>
        <g data-finale-signals className="cv-layer" data-art="cv">
          {/* Subtle journey network route connecting all 12 capabilities across the one world */}
          <path
            data-finale-network-route
            d={`M${landmarks.map((l, i) => `${l.x} ${l.y - (i % 2 ? 72 : 48)}`).join(" L")}`}
            fill="none"
            stroke="#f45b3d"
            strokeWidth="2"
            strokeDasharray="6 6"
            strokeOpacity="0.45"
            opacity="0"
          />
          {landmarks.map((l, i) => <g key={l.number} data-landmark-signal={l.number} data-x={l.x} data-y={l.y} transform={`translate(${l.x} ${l.y})`} opacity="0">
            <circle r="5" fill="#f45b3d" stroke="none" />
            <path d={`M0-4V-${i % 2 ? 58 : 34}`} stroke="#f45b3d" strokeWidth="1.5" strokeDasharray="3 3" />
            <g transform={`translate(0 -${i % 2 ? 72 : 48})`}>
              <circle data-pulse r="14" stroke="#f45b3d" strokeWidth="1.5" fill="none" />
              <circle r="14" fill="#17191c" stroke="#f45b3d" strokeWidth="2" />
              <text data-number y="4" textAnchor="middle" fill="#ffb09f" style={{ fontSize: 11, fontWeight: 800 }}>{String(l.number).padStart(2, "0")}</text>
              <text data-landmark-label y="-21" textAnchor="middle" fill="#3b3f45" style={{ fontSize: 11, fontWeight: 600 }}>{l.short}</text>
            </g>
          </g>)}
        </g>
      </g>
      <ForegroundLayer />
    </svg>
  </div>;
}

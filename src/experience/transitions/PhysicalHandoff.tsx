import { Belt, Drone, Rock, Truck } from "../illustrations/Primitives";
import styles from "../styles/Journey.module.css";

/** One moving carrier bridges each pair of worlds; only its current physical form is painted. */
export function PhysicalHandoff() {
  return (
    <div className={styles.carrier} data-carrier aria-hidden="true">
      <svg
        data-handoff="rock"
        viewBox="-30 -30 65 60"
        stroke="#20221f"
        strokeWidth="1.5"
      >
        <Rock />
      </svg>
      <svg
        data-handoff="road"
        viewBox="-200 -150 450 270"
        fill="none"
        stroke="#20221f"
        strokeWidth="2.5"
      >
        <Truck />
        <path d="M-240 92h590m-590 16h590" stroke="#909b80" />
      </svg>
      <svg
        data-handoff="belt"
        viewBox="0 0 1400 210"
        fill="none"
        stroke="#20221f"
        strokeWidth="2.5"
      >
        <Belt x={-50} y={75} width={1500} />
        {Array.from({ length: 21 }, (_, i) => (
          <Rock key={i} x={i * 70} y={48} size={0.75 + (i % 3) * 0.2} />
        ))}
      </svg>
      <svg
        data-handoff="seam"
        viewBox="0 0 1400 60"
        fill="none"
        stroke="#f45b3d"
        strokeWidth="3"
      >
        <path d="M-40 32q160-43 365-2t400 0 740-1" />
        <path d="M420 20v25m279-29v28m336-26v30" strokeDasharray="3 6" />
      </svg>
      <svg
        data-handoff="water"
        viewBox="0 0 1400 100"
        fill="none"
        stroke="#909c7d"
        strokeWidth="3"
      >
        <path
          d="M-20 38q70-45 140 0t140 0 140 0 140 0 140 0 140 0 140 0 140 0 140 0 180 0v90H-20Z"
          fill="#d3dac6"
        />
      </svg>
      <svg
        data-handoff="drone"
        viewBox="-90 -60 180 150"
        fill="none"
        stroke="#20221f"
        strokeWidth="2"
      >
        <Drone />
      </svg>
    </div>
  );
}

import { PLANT_X as P, RECOVERY_SHIFT as R } from "./actors";

/** The places where each capability appeared, in journey order. The finale reactivates them in this order. */
export const landmarks = [
  { number: 1, short: "Core", x: 180, y: 560 },
  { number: 2, short: "Grade", x: 980, y: 400 },
  { number: 3, short: "Fragmentation", x: 1150, y: 590 },
  { number: 6, short: "Proximity", x: 1870, y: 640 },
  { number: 4, short: "Bucket", x: 2250, y: 470 },
  { number: 5, short: "Driver", x: 3380, y: 200 },
  { number: 7, short: "Foreign object", x: P + 760, y: 545 },
  { number: 8, short: "Particle size", x: P + 1080, y: 545 },
  { number: 9, short: "Sorting", x: P + 1330, y: 545 },
  { number: 10, short: "Froth", x: R + 5240, y: 440 },
  { number: 11, short: "3D survey", x: R + 6330, y: 400 },
  { number: 12, short: "Thermal", x: R + 6870, y: 450 },
];

import { PLANT_X, roadY } from "./actors";
import { Rock } from "../illustrations/Primitives";

const f = (n: number) => Number(n.toFixed(1));
const ridge = (x0: number, x1: number, base: number, amp: number, step: number, seed: number) => {
  let d = `M${x0} ${base}`;
  for (let x = x0, i = 0; x <= x1; x += step, i++) {
    const h = Math.abs(Math.sin(i * 1.7 + seed)) * amp + Math.abs(Math.sin(i * .63 + seed * 2)) * amp * .6;
    d += ` L${f(x + step * .5)} ${f(base - h)} L${f(x + step)} ${f(base - h * .35)}`;
  }
  return d;
};

/** Distant ranges: barely move, establishing scale and a horizon for every shot. */
export function FarLayer() {
  return <g data-depth=".22" stroke="#c6cace" strokeWidth="1.4" fill="none">
    <circle cx="560" cy="372" r="30" fill="#f45b3d" stroke="none" opacity=".88" />
    <path d={ridge(-1600, 2600, 470, 120, 150, 1)} fill="#f6f4ee" />
    <path d={ridge(-1500, 2600, 500, 70, 110, 4)} stroke="#d6d9dc" />
    <g data-ambient="drift-slow">
      {[-900, -300, 380, 1100, 1800].map((x, i) => <path key={x} d={`M${x} ${200 + (i % 2) * 50}q14-20 32-6 10-24 34-10 22-6 26 14h-92Z`} stroke="#c9ccd0" fill="#fcfaf5" />)}
    </g>
    <g data-ambient="birds" stroke="#8d939a" strokeWidth="1.3">
      {[0, 1, 2].map(i => <path key={i} d={`M${120 + i * 26} ${300 - i * 9}q6-6 11 0 5-6 11 0`} />)}
    </g>
  </g>;
}

/** The open pit and plant in the middle distance: terraces, a small truck on a bench, plant silhouettes. */
export function MidLayer() {
  const benches = [0, 1, 2, 3].map(i => `M-500 ${560 - i * 34}` + Array.from({ length: 28 }, (_, k) => ` L${-500 + k * 210} ${f(560 - i * 34 - Math.sin(k * .7 + i) * 18)}`).join(""));
  return <g data-depth=".55" stroke="#b4b9be" strokeWidth="1.5" fill="none">
    <path d={`M-500 600${benches[3].slice(benches[3].indexOf(" L"))} L5400 620 L-500 620Z`} fill="#efeee9" stroke="none" />
    {benches.map((d, i) => <path key={i} d={d} strokeWidth={i === 0 ? 1.8 : 1.2} />)}
    {Array.from({ length: 40 }, (_, i) => <path key={i} d={`m${-420 + i * 140} ${f(540 - (i % 4) * 34)} 6 14`} stroke="#c8ccd0" strokeWidth="1.1" />)}
    <g data-ambient="haul-distant"><g transform="translate(300 478)"><path d="M-22-14h28l6 14h-36Z" fill="#f9a26b" strokeWidth="1.3" /><path d="M6-12h12l4 12H6Z" fill="#f9a26b" strokeWidth="1.3" /><circle cx="-14" cy="2" r="4" fill="#9aa0a6" /><circle cx="14" cy="2" r="4" fill="#9aa0a6" /></g></g>
    <g data-ambient="dust-plume" stroke="#cfccc4"><path d="M780 520q-20-24 4-36 6-24 30-14 22-12 30 10" /></g>
    <g transform="translate(2120 0)" strokeWidth="1.4">
      <path d="M0 560V420h46v140M8 420v-60h12v60M60 560V450h80v110M74 450v-38h10v38M150 560 260 470l8 9-102 81" fill="#f1f1ee" />
      <path d="M300 560V430h90v130m-80-130 70-50 10 50" fill="#f1f1ee" />
      <ellipse cx="470" cy="540" rx="60" ry="14" fill="#f1f1ee" /><path d="M410 540v20h120v-20" />
      <path d="M560 560v-96h22v96m-28-96h34" />
    </g>
    <g transform="translate(3420 0)" strokeWidth="1.4"><path d="M0 560q80-110 160 0M110 560q90-150 200 0" fill="#f1f1ee" /><path d="M320 560v-60m-10 0h20" /></g>
    {[200, 900, 1600, 2600, 3300].map(x => <g key={x}><path d={`M${x} 560v-70m-14 8h28m-24 8h20`} strokeWidth="1.1" /></g>)}
  </g>;
}

/** The haul road leaves the pit floor and climbs an embankment to the run-of-mine pad. */
export function Ground() {
  const pts: string[] = [];
  for (let x = 1850; x <= 3660; x += 30) pts.push(`${x} ${f(roadY(x) + 82)}`);
  const road = `M${pts.join(" L")}`;
  const crest = PLANT_X + 360;
  return <g data-world-terrain>
    <path d={`M-1400 692 L9800 692 L9800 2400 L-1400 2400Z`} fill="#f4f2ec" stroke="none" />
    <path d="M-1400 692Q1200 686 2400 693T6000 689 9800 692" stroke="#8f959c" strokeWidth="2.4" fill="none" />
    <path d="M-1400 735Q1200 722 2400 737T6000 731 9800 736" stroke="#c4c8cc" strokeWidth="1.4" fill="none" />
    <g stroke="#cfd2d6" strokeWidth="1.3" fill="none">
      <path d="M-1400 820Q300 790 1900 822T5200 812 9800 826" />
      <path d="M-1400 930Q700 896 2600 932T6400 918 9800 936" />
      {Array.from({ length: 70 }, (_, i) => <path key={i} d={`m${-1200 + i * 155} ${780 + (i % 3) * 52} 12 20m-6-12 9-3`} />)}
    </g>
    <g data-landmark="pit-wall" strokeWidth="2">
      <path d="M1240 692 1310 470 1500 430 1700 445 1950 400 2240 420 2520 380 2780 360 3050 330 3300 300 3600 290 3700 692Z" fill="#eff0f1" stroke="#9aa0a7" />
      <path d="M1290 560 1520 535 1760 548 2010 520 2280 532 2540 512 2900 500 3300 470M1275 620 1520 600 1760 610 2020 588 2290 598 2550 580 2900 570 3300 540M1318 492 1520 470 1730 480 1960 450 2240 466 2525 440 2900 420 3300 400" stroke="#b9bec4" fill="none" />
      {Array.from({ length: 40 }, (_, i) => <path key={i} d={`m${1330 + i * 54} ${f(470 + (i % 4) * 46 - Math.max(0, i - 24) * 4)} 9 18m-4-9 8-3`} stroke="#c3c7cc" strokeWidth="1.3" />)}
      <g transform="translate(2380 452)" strokeWidth="1.6"><path d="M-34-4h44l4-18h20l10 22Z" fill="#fbb07c" /><path d="M-38 0h84" strokeWidth="4" /><circle cx="-26" cy="6" r="5" fill="#9aa0a6" /><circle cx="34" cy="6" r="5" fill="#9aa0a6" /></g>
      <g transform="translate(1600 432)" strokeWidth="1.5"><path d="M0 0V-58m-8 0h16" /><g data-ambient="beacon"><circle cy="-64" r="5" fill="#ffb33b" /></g></g>
    </g>
    <path d={`${road} L${crest} 344 L${crest} 692 L2300 692Z`} fill="#e7e8ea" stroke="#17191c" strokeWidth="3" strokeLinejoin="round" />
    <g stroke="#a3a9b0" strokeWidth="1.4" fill="none">
      {Array.from({ length: 22 }, (_, i) => { const x = 2650 + i * 46; const top = roadY(x) + 96; return top < 720 ? <path key={i} d={`M${x} ${f(top + 14)} l10 22m-4-11 9-4`} /> : null; })}
      <path d={`M2700 ${f(roadY(2700) + 120)} Q3100 600 ${crest - 20} 520`} />
    </g>
    <path d={road} stroke="#c2c6cb" strokeWidth="14" fill="none" />
    <path d={road} stroke="#fcfaf5" strokeWidth="9" fill="none" />
    <path d={road} stroke="#8f959c" strokeWidth="1.5" strokeDasharray="26 22" fill="none" />
    <path d={`M${crest} 344V692`} stroke="#17191c" strokeWidth="3" />
    {[0, 1, 2, 3, 4, 5].map(i => <path key={i} d={`M${crest - 6} ${400 + i * 55}h-34`} stroke="#9aa0a7" strokeWidth="1.4" />)}
    {[2760, 3000, 3240].map(x => <g key={x} transform={`translate(${x} ${f(roadY(x) + 80)})`}><path d="M0 0v-36h14V0" fill="#fffaf2" strokeWidth="1.6" stroke="#17191c" /><path d="M0-30h14v8H0Z" fill="#f97832" /></g>)}
  </g>;
}

/** Near-camera objects. They pass faster than the world and give each move physical depth. */
export function ForegroundLayer() {
  return <g data-depth="1.32" stroke="#17191c" strokeWidth="3" strokeLinejoin="round">
    <g transform="translate(1980 900)">
      {[0, 1, 2, 3, 4].map(i => <Rock key={i} x={i * 70 - (i % 2) * 20} y={(i % 3) * 14} size={1.6 + (i % 3) * .4} variant={i} />)}
    </g>
    <g transform="translate(3060 920)">{[0, 1, 2].map(i => <Rock key={i} x={i * 90} y={(i % 2) * 18} size={1.9 - i * .2} variant={i + 2} />)}</g>
    <g transform={`translate(${f((PLANT_X + 1640) * 1.32)} 0)`}>
      <path d="M-40 1100V420h26v680m100 0V420h26v680M-60 420h192v22H-60Z" fill="#e1e4e7" />
      <path d="M-40 520 112 640M-40 640 112 520M-40 780 112 900M-40 900 112 780" stroke="#9aa0a7" strokeWidth="2" fill="none" />
    </g>
  </g>;
}

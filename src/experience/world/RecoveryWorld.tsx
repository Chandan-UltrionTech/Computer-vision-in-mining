import type { SceneId } from "../core/types";
import { beatAt } from "../core/storyBeats";
import { Drone, Rock, Worker } from "../illustrations/Primitives";
import { dronePose } from "./actors";

const ORANGE = "#f97832";
const INK = "#202227";
const PAPER = "#faf8f2";
const mound = "M5965 667 6057 604 6156 470 6280 345 6404 426 6515 395 6719 669Z";

function Pipe({ d }: { d: string }) {
  return <g fill="none"><path d={d} stroke={INK} strokeWidth="19" /><path d={d} stroke="#b6bbc1" strokeWidth="12" /><path d={d} stroke={PAPER} strokeWidth="2" /></g>;
}

function FrothCell({ x, y, scale = 1, primary = false }: { x: number; y: number; scale?: number; primary?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} data-landmark={primary ? "flotation-cell" : "recovery-cell"}>
    <path d="M-224 0v134q224 110 448 0V0" fill="#d1d4d7" strokeWidth="4" />
    <path d="M-223 106q224 109 447 0M-223 127q224 109 447 0" fill="none" stroke="#8d9299" strokeWidth="1.4" />
    {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${-217 + i * 36} 24v${(112 + Math.sin(i / 12 * Math.PI) * 49).toFixed(3)}`} stroke="#737981" strokeWidth="1.6" />)}
    <ellipse rx="224" ry="79" fill={PAPER} strokeWidth="4" />
    <g data-recovery={primary ? "cell-water" : undefined}>
      <ellipse rx="213" ry="68" fill="#c7ccd1" stroke="none" />
      <path d="M-183 9q44-20 85 0t84 0 81 0 77 0M-136 37q76-19 140 0t145 0" fill="none" stroke="#828992" strokeWidth="1.5" />
      {Array.from({ length: 25 }, (_, i) => <circle key={i} cx={-164 + i % 9 * 40} cy={-38 + Math.floor(i / 9) * 34} r={2 + i % 3} fill="#535962" stroke="none" />)}
    </g>
    <g data-recovery={primary ? "cell-froth" : undefined} opacity={primary ? 0 : 1}>
      <ellipse rx="211" ry="67" fill="#ffb276" stroke="none" />
      {Array.from({ length: 51 }, (_, i) => {
        const row = Math.floor(i / 11), col = i % 11;
        const bx = Number((-172 + col * 34 + Math.sin(i * 2) * 6).toFixed(3));
        const by = Number((-43 + row * 20 + Math.sin(i) * 4).toFixed(3));
        if (bx * bx / (202 * 202) + by * by / (62 * 62) > 1) return null;
        return <g key={i} data-art={i % 7 === 0 ? "froth-bubble" : undefined} data-ambient={i % 4 === 0 ? "bubbles" : undefined} style={i % 4 === 0 ? { animationDelay: `${-(i % 9) * .37}s` } : undefined}>
          <ellipse cx={bx} cy={by} rx={8 + i % 5 * 2} ry={6 + i % 5 * 1.3} fill={i % 6 === 0 ? ORANGE : "#ffe2c8"} strokeWidth="1.3" />
          <path d={`m${(bx - 4).toFixed(3)} ${(by - 3).toFixed(3)} 3-2 4 1`} stroke={PAPER} fill="none" strokeWidth="2" />
        </g>;
      })}
      <path d="M-175 39q50-11 88 1t91-2 119 3" stroke={PAPER} fill="none" strokeWidth="3" />
    </g>
    <path d="M-233-19q233 112 466 0M-233-43q233 110 466 0M-233-43v30M233-43v30" fill="none" strokeWidth="3" />
    {[-213, -145, -70, 0, 70, 145, 213].map(i => <path key={i} d={`M${i} ${24 - Math.abs(i) / 4}v-25`} strokeWidth="2" />)}
    <path d="M-18-3v-165h36V-3" fill={ORANGE} strokeWidth="3" />
    <path d="M-215-165h430v17h-430ZM-215-165v-26h430v26m-430-13h430" fill={PAPER} strokeWidth="2.5" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-210 + i * 38}-191v26`} strokeWidth="1.5" />)}
    <path d="M-14-146v128m28-128v128M-30 160h60m-233-159v148m-7-137h15m-15 13h15m-15 13h15m-15 13h15m-15 13h15m-15 13h15" fill="none" strokeWidth="1.5" />
    {primary && <>
      <path d="M-258-140v-81h98l117 42" fill="none" strokeWidth="6" />
      <path d="M-255-218h94l108 39M-252-207h87l106 37" fill="none" stroke="#9da3aa" strokeWidth="1.5" />
      <path d="M-55-194h38v24h-38Z" fill={INK} /><circle cx="-27" cy="-181" r="6" fill={ORANGE} />
      <g className="cv-layer" data-art="cv" data-recovery="froth-rays" fill="none" stroke="#f45b3d" opacity="0"><path d="M-27-166-161-6m134-160 160 160m-160-160v166" strokeDasharray="5 8" /></g>
      <g className="cv-layer" data-art="cv" data-recovery="froth-flow" stroke="#f45b3d" fill="none" opacity="0">
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-130 + i % 4 * 76} ${-29 + Math.floor(i / 4) * 54}h35l-7-5m7 5-7 5`} strokeWidth="2" />)}
        <path d="M-149-41q35-15 72 0l24 29q-47 18-84-4ZM78 11q32-9 59 8l-13 27-63-10Z" />
      </g>
      <g className="cv-layer" data-art="cv" data-recovery="froth-signal" fill="none" stroke="#f45b3d" opacity="0">
        <path d="M236 61h45l12-20 14 32 20-25 16 10h44V-20h62" strokeWidth="2.5" />
        <text x="242" y="95" fontSize="14" stroke="none" fill="#b7462b">motion / texture / stability</text>
        <text x="265" y="-36" fontSize="14" stroke="none" fill="#b7462b">process signal → operator</text>
      </g>
    </>}
  </g>;
}

export function RecoveryWorld() {
  return <g data-world-part="recovery" stroke={INK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
    <defs>
      <clipPath id="recovery-pile-clip"><path d={mound} /></clipPath>
      <clipPath id="recovery-thermal-clip"><rect data-recovery="thermal-wipe" x="6620" y="255" width="0" height="435" /></clipPath>
    </defs>
    <g data-landmark="plant-backbone">
      <path d="M4540 720h1395m-1395-14h1395" stroke="#9298a0" strokeWidth="1.5" />
      <path d="M4800 607V343h106v264m-96-264v-84h27v84m44 0v-69h24v69" fill="#d5d8dc" />
      <path d="M4781 398h148v25h-148Zm0 0v-28h148v28m-148-14h148m-136-14v28m28-28v28m28-28v28m28-28v28m28-28v28" fill={PAPER} strokeWidth="2" />
      <path d="M4811 356v233m81-234v234m-67-254v-64m-9 9h19m-19 13h19m-19 13h19m-19 13h19" fill="none" strokeWidth="1.5" />
      <path d="M4915 357h340m-340-12h340m-330-16v28m40-28v28m40-28v28m40-28v28m40-28v28m40-28v28m40-28v28m40-28v28" fill="none" stroke="#727983" strokeWidth="2" />
      <path d="M5540 639V362h125v277m-111-277v-70h30v70m45 0v-91h28v91" fill="#dadddf" />
      <path d="M5524 407h158v-27h-158Zm0-13h158m-148-14v27m30-27v27m30-27v27m30-27v27m30-27v27" fill="none" strokeWidth="2" />
      <path d="M5665 507h124v117h-124Z" fill={PAPER} /><path d="M5678 519h47v29h-47Z" fill="#a5b1b8" /><path d="M5740 519h37v29h-37Zm-62 45h97m-53-14v64" fill="none" strokeWidth="2" />
      <path d="M5789 524h68v100h-68Z" fill={ORANGE} /><path d="M5803 540h35v22h-35Zm0 37h35m-35 10h22" fill="none" strokeWidth="2" />
      <Worker x={5764} y={654} scale={0.43} />
    </g>
    <g data-landmark="grinding-feed">
      <path d="M4500 500h166l37-64h37v27l-61 83h-179Z" fill={ORANGE} />
      <path d="M4510 513h156m-140 10h130m-30 23v126m-75-126v126m0-84 75 72m-75 0 75-72" fill="none" strokeWidth="2" />
      <path d="M4648 419h106l-22 72h-65Z" fill="#d2d5d9" /><path d="M4659 428h83m-74 15h65" fill="none" strokeWidth="1.5" />
      <path d="M4688 486h32v40h-32Z" fill={ORANGE} />
      <path d="M4698 536h159q38 0 38 55t-38 55h-159Z" fill="#b4b9bf" />
      <ellipse cx="4698" cy="591" rx="28" ry="55" fill={ORANGE} /><ellipse cx="4698" cy="591" rx="16" ry="40" fill="#656b73" />
      <path d="M4724 548h120m-120 85h120m-115-69h113m-113 18h113m-113 18h113m-113 18h113" stroke="#7c838c" strokeWidth="1.5" />
      <path d="M4711 647v35h168v-35M4725 655v26m135-26v26" fill="none" /><path d="M4816 514h61v-28h31" fill="none" strokeWidth="8" /><path d="M4816 514h61v-28h31" fill="none" stroke="#d5d8dc" strokeWidth="4" />
      <Pipe d="M4880 601h104V491h53" />
      <g data-recovery="suspended-mineral" fill="#69717a" stroke="none">
        {Array.from({ length: 17 }, (_, i) => <circle key={i} cx={4920 + i % 3 * 10} cy={514 + Math.floor(i / 3) * 15} r={2 + i % 3} />)}
      </g>
      <text x="4670" y="722" fontSize="15" stroke="none" fill="#6b717b">grinding → water → suspended mineral</text>
    </g>
    <FrothCell x={5240} y={506} primary />
    <Pipe d="M5460 590h56v-82h45" />
    <FrothCell x={5650} y={590} scale={0.44} />
    <g data-landmark="product-stacker">
      <path d="M5750 658 6127 394l16 21-382 267Z" fill={ORANGE} />
      <path d="M5772 653 6122 412m-350 252 350-245" stroke={PAPER} strokeWidth="2" />
      <path d="m5819 620 1 72m111-151 22 148m92-225 27 205m-253-25 134-106m-133-3 133 111m1-7 119-149m-143-35 142 181" fill="none" strokeWidth="2.5" />
      <path d="M6108 384h42v35h-42Z" fill={INK} /><circle cx="6126" cy="403" r="8" fill="#a5abb3" />
    </g>
    <g data-landmark="stockpile">
      <path d={mound} fill="#d4d7db" strokeWidth="4" />
      <path d="m6280 345-56 195-167 64m223-259 124 81 88 239m23-270-67 153-44-122m-180 114 109 61 115-53M6085 624q276-58 582 13" fill="none" stroke="#7d848d" strokeWidth="2" />
      <g clipPath="url(#recovery-pile-clip)" stroke="#8e949c" strokeWidth="1.1">
        {Array.from({ length: 69 }, (_, i) => <path key={i} d={`m${6020 + i % 15 * 46} ${440 + Math.floor(i / 15) * 47} 9 18-3 7m-12-8 5-2`} />)}
      </g>
      {Array.from({ length: 12 }, (_, i) => <Rock key={i} x={5985 + i * 63} y={665 + i % 3 * 7} size={0.38 + i % 4 * 0.12} variant={i} />)}
      <g data-recovery="product-fall" transform="translate(6148 449)">
        {[0, 1, 2, 3].map(i => <Rock key={i} x={i % 2 * 16} y={i * 24} size={0.2 + i % 2 * 0.08} accent variant={i} />)}
      </g>
      <path d="M5880 721q198-4 436-9t483-14M5875 739q252-4 440-6t490-16" fill="none" stroke="#a2a7ae" strokeWidth="2" />
      <text x="6230" y="729" fontSize="16" stroke="none" fill="#6b717b">product inventory</text>
    </g>
    <g data-landmark="inspection-highwall">
      <path d="M6641 654 6700 407 6817 273 6926 324 7009 348 7093 434 7180 386 7314 641Z" fill="#e4e6e8" strokeWidth="4" />
      <path d="M6665 588 6787 526 6924 550 7069 534 7285 598M6681 523 6794 458 6926 477 7060 490 7265 546M6697 461 6810 390 6942 410 7070 465 7239 484M6726 392l98-73 103 46 143 67" fill="none" strokeWidth="2.5" />
      {Array.from({ length: 39 }, (_, i) => <path key={i} d={`m${6717 + i % 10 * 50} ${433 + Math.floor(i / 10) * 48} 8 19m-4-10 10 7`} stroke="#9298a0" strokeWidth="1.4" />)}
      <path d="m6817 273 27 65-17 74 30 66-8 69m160-199-25 59 10 58 31 69m55-148-20 75 22 69m-151-89-22 55-1 53" fill="none" stroke="#777f88" strokeWidth="1.5" />
      <path d="M6657 667q342-41 669 2" fill="none" stroke="#90969e" strokeWidth="2" />
      <path d="M7173 604v-82h76v82m-68-69h59m-48-13v82m37-82v82" fill={PAPER} strokeWidth="2" />
      <text x="6990" y="714" fontSize="16" stroke="none" fill="#6b717b">inspection bench / exposed face</text>
    </g>
    <path d="M5907 660h117l25 24h-164Z" fill="#e5e7e9" strokeWidth="2" /><ellipse cx="5986" cy="670" rx="33" ry="7" fill="none" stroke="#8d959e" strokeWidth="1.5" />
    <g data-recovery="drone" data-actor="survey-drone" transform="translate(6020 643)"><Drone scale={0.82} /></g>
    <g className="cv-layer" data-art="cv" data-recovery="capture" stroke="#f45b3d" fill="none" opacity="0" strokeWidth="1.6">
      {[0, 1, 2].map(i => <path key={i} d={`M${6110 + i * 116} ${478 - i % 2 * 34}h160v107h-160Zm14 14h21m-21 0v20m132 59v-20m0 20h-21`} strokeDasharray="5 7" />)}
      <text x="6370" y="306" fontSize="15" stroke="none" fill="#b7462b">overlapping imagery → geometry</text>
    </g>
    <g className="cv-layer" data-art="cv" data-recovery="cloud" clipPath="url(#recovery-pile-clip)" stroke="none" fill="#f45b3d" opacity="0">
      {Array.from({ length: 128 }, (_, i) => <circle key={i} cx={Number((5995 + i % 16 * 47 + Math.sin(i) * 7).toFixed(3))} cy={655 - Math.floor(i / 16) * 40} r={2.1} />)}
    </g>
    <g className="cv-layer" data-art="cv" data-recovery="mesh" clipPath="url(#recovery-pile-clip)" stroke="#f45b3d" strokeWidth="1.6" fill="none" opacity="0">
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${5964 + i * 66} 669 6280 345 6719 669M${5964 + i * 66} 669 6515 395`} />)}
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M5965 ${641 - i * 35}q325-${30 + i * 4} 754 0`} />)}
    </g>
    <g className="cv-layer" data-art="cv" data-recovery="measure" stroke="#f45b3d" strokeWidth="2" fill="none" opacity="0">
      <path d="M5970 694h745m-745-7v14m745-14v14M6745 669V345m-7 0h14m-14 324h14" />
      <text x="6155" y="757" fill="#b7462b" stroke="none" fontSize="15">volume / geometry / change · illustrative</text>
      <text x="6765" y="512" fill="#b7462b" stroke="none" fontSize="14">height</text>
      <path d="M6480 683v56l50 21 49-30v-49m-99 0h99m-99 0 99 47m-50-45v77" strokeDasharray="4 6" />
      <text x="6460" y="796" stroke="none" fill="#b7462b" fontSize="13">void geometry · cutaway</text>
    </g>
    <g className="cv-layer" data-art="cv" data-recovery="thermal" clipPath="url(#recovery-thermal-clip)" opacity="0">
      <path d="M6641 654 6700 407 6817 273 6926 324 7009 348 7093 434 7180 386 7314 641Z" fill="#f5bc89" fillOpacity=".62" stroke="none" />
      <path d="M6803 431q65-23 83 26t-21 75q-49 35-71-16t9-85m257 86q64-32 101 22t-34 66q-65 14-84-31t17-57" fill="#f47544" fillOpacity=".8" stroke="#ef854e" strokeWidth="1.5" />
      <path d="M6822 459q26-14 35 14t-17 38q-24 2-26-22t8-30m285 79q28-8 36 12t-30 26q-24-2-20-17t14-21" fill="#c9452a" stroke="none" />
      <path d="M6796 420h96v121h-96Z" fill="none" stroke="#b83b26" strokeDasharray="7 5" />
    </g>
    <g className="cv-layer" data-art="cv" data-recovery="thermal-target" fill="none" stroke="#c4472d" opacity="0" strokeWidth="2">
      <path d="M6790 415h16m-16 0v18m107-18h-16m16 0v18m0 115h-16m16 0v-18m-107 18h16m-16 0v-18M6844 548v76h84" />
      <text x="6870" y="650" fill="#b7462b" stroke="none" fontSize="15">anomaly located → inspect here</text>
      <text x="6970" y="682" fill="#b7462b" stroke="none" fontSize="13">visual + thermal · illustrative sensor view</text>
    </g>
    <g className="cv-layer" data-art="cv" data-recovery="network" fill="none" stroke="#f45b3d" opacity="0" strokeWidth="3">
      {[[5230, 502], [6350, 562], [6844, 474]].map(([x, y]) => <g key={x}><circle cx={x} cy={y} r="12" fill="#f45b3d" /><circle cx={x} cy={y} r="25" opacity=".5" /></g>)}
      <path d="M5230 502q310-126 1120 60t494-88" strokeDasharray="8 14" />
    </g>
  </g>;
}

const cache = new WeakMap<SVGElement, Map<string, SVGElement[]>>();
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ramp = (p: number, from: number, to: number) => clamp((p - from) / (to - from));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

/** Pure scroll state: every property is assigned on every call, including backwards seeks. */
export function updateRecovery(root: SVGElement, scene: SceneId, progress: number) {
  let nodes = cache.get(root);
  if (!nodes) {
    nodes = new Map();
    root.querySelectorAll<SVGElement>("[data-recovery]").forEach(node => {
      const name = node.dataset.recovery!;
      nodes!.set(name, [...nodes!.get(name) ?? [], node]);
    });
    cache.set(root, nodes);
  }
  const set = (name: string, attr: string, value: string | number) => nodes!.get(name)?.forEach(node => node.setAttribute(attr, String(value)));
  const opacity = (name: string, value: number) => set(name, "opacity", value);
  const p = clamp(progress);
  const order: SceneId[] = ["slurry", "froth", "stockpile", "survey", "thermal", "finale"];
  const index = order.indexOf(scene);
  const slurry = index < 0 ? 0 : index === 0 ? p : 1;
  const froth = index < 1 ? 0 : index === 1 ? p : 1;
  // Water and froth are process media; the tank, rails and bridge stay fully opaque.
  opacity("cell-froth", ramp(slurry, .65, 1));
  opacity("cell-water", 1 - ramp(slurry, .65, 1));
  opacity("suspended-mineral", index === 0 ? 1 - ramp(p, .78, 1) : 0);
  set("suspended-mineral", "transform", `translate(0 ${mix(0, -28, slurry)})`);
  set("product-fall", "transform", `translate(6148 ${449 + (index === 2 ? p : 1) * 62})`);

  const frothObserve = beatAt("froth", "temporalObservation", .4);
  const frothSignal = beatAt("froth", "stabilitySignal", .67);
  const dormantFroth = 1 - ramp(froth, beatAt("froth", "plantPullback", .97), 1);
  const frothActive = scene === "froth" ? dormantFroth : 0;
  opacity("froth-rays", frothActive * ramp(p, frothObserve, frothObserve + .055));
  opacity("froth-flow", frothActive * ramp(p, frothObserve + .06, frothObserve + .18));
  // The control signal reaches the operator before the .88 result copy.
  opacity("froth-signal", frothActive * ramp(p, frothSignal, .84));

  const drone = dronePose(scene, p);
  set("drone", "transform", `translate(${drone.x.toFixed(2)} ${drone.y.toFixed(2)}) rotate(${drone.tilt.toFixed(2)})`);
  // The physical actor stays mounted. Only its camera rays are intelligence marks.
  nodes.get("drone")?.forEach(drone => drone.querySelectorAll<SVGElement>("[data-art='cv']").forEach(rays => rays.setAttribute("opacity", String(scene === "survey" ? ramp(p, .28, .34) * (1 - ramp(p, .9, .99)) : scene === "thermal" ? ramp(p, .4, .46) * (1 - ramp(p, .9, .99)) : 0))));

  const survey = scene === "survey" ? p : scene === "thermal" || scene === "finale" ? 1 : 0;
  const surveyExit = scene === "survey" ? 1 - ramp(p, .9, .99) : 0;
  const finalIntel = scene === "finale" ? ramp(p, .34, .56) : 0;
  opacity("capture", surveyExit * ramp(survey, beatAt("survey", "imageCapture", .28), .34) * (1 - ramp(survey, .63, .8)));
  opacity("cloud", Math.max(surveyExit * ramp(survey, beatAt("survey", "featurePoints", .4), .59), finalIntel));
  opacity("mesh", Math.max(surveyExit * ramp(survey, beatAt("survey", "meshBuild", .63), .77), finalIntel));
  opacity("measure", surveyExit * ramp(survey, beatAt("survey", "measurement", .83), .89));

  const thermal = scene === "thermal" ? p : scene === "finale" ? 1 : 0;
  const thermalIntel = scene === "thermal" ? 1 - ramp(p, .9, .99) : finalIntel;
  set("thermal-wipe", "width", 700 * ramp(thermal, beatAt("thermal", "thermalWipe", .4), .78));
  opacity("thermal", thermalIntel);
  opacity("thermal-target", thermalIntel * ramp(thermal, .76, .825));
  opacity("network", finalIntel);
}

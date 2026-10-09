import type { SceneId } from '../core/types';
import { storyAt } from '../core/storyBeats';
import { Camera, Distribution, Drill, Rock, rockShapes, Worker } from '../illustrations/Primitives';
import { after, bucketWorld, clamp, excavatorPose, gravity, heavy, mix as lerp, ramp, smooth, truckPose, workerPose } from './actors';

const ink = '#17191c';
const orange = '#f97832';
const red = '#f45b3d';
const f1 = (n: number) => Number(n.toFixed(2));
/** Bench-site coordinates sit 70 units above world space so the bench foot meets the pit floor at y 690. */
const SITE = 70;
const BASE = 617;
const fragments = Array.from({ length: 64 }, (_, i) => {
  const row = Math.floor(i / 16), col = i % 16;
  const x = 660 + col * 68 + row * 26 + (i * 37 % 19);
  const y = 604 - row * 40 + (col % 3) * 7 - (row === 3 ? (col % 2) * 8 : 0);
  return { x, y, size: .62 + (i * 7 % 5) * .13, sx: x - (x - 1140) * .18, sy: 330 + row * 55 + (col % 4) * 18, spin: (i % 2 ? 1 : -1) * (30 + (i * 13 % 50)) };
}).filter(fr => fr.x < 1730 - (604 - fr.y) * .9).sort((a, b) => a.y - b.y);
const holes = [[760, 339], [880, 313], [1000, 338], [1120, 342], [1240, 326], [1360, 358]];
const puffs = Array.from({ length: 11 }, (_, i) => ({ x: 640 + i * 95 + (i % 2) * 30, y: 330 + (i % 3) * 40, r: 70 + (i * 23 % 5) * 16 }));
const flyers = [[940, 360, -120, 520, 2.1], [1180, 350, 60, 560, 2.6], [1060, 330, -20, 610, 1.8], [1300, 370, 190, 500, 2.3], [860, 380, -260, 470, 1.6]];
const puff = (r: number) => {
  let d = '';
  for (let k = 0; k < 9; k++) {
    const a = k / 9 * Math.PI * 2, b = (k + 1) / 9 * Math.PI * 2, rr = r * (1 + (k % 3) * .08);
    const x1 = Math.cos(a) * rr, y1 = Math.sin(a) * rr * .72, x2 = Math.cos(b) * rr, y2 = Math.sin(b) * rr * .72;
    const mx = Math.cos((a + b) / 2) * rr * 1.28, my = Math.sin((a + b) / 2) * rr * .92;
    d += `${k ? '' : `M${f1(x1)} ${f1(y1)}`}Q${f1(mx)} ${f1(my)} ${f1(x2)} ${f1(y2)}`;
  }
  return d + 'Z';
};
const benchTop = 'M535 617 593 401 727 348 865 310 1070 352 1220 321 1460 384 1740 612Z';
const wire = `M556 604C600 600 610 540 630 470S700 360 ${holes.map(([x, y]) => `${x} ${y - 7}`).join('L')}`;

function CoreStation() {
  return <g data-landmark="core-station">
    <path d="M-90 690V336m600 354V336M-120 336h660l-34-46H-86Z" fill="#fff8ef" />
    <path d="M-120 336h660" strokeWidth="4" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-100 + i * 54} 336l12-46`} stroke="#c9ccd0" strokeWidth="1.5" />)}
    <text x="-70" y="322" fill="#6b717b" fontSize="11" letterSpacing="2">CORE LOGGING</text>
    <path d="M-60 690v-72m510 72v-72M-70 618h530" strokeWidth="3" />
    <g transform="translate(-74 640)">{[0, 1, 2].map(i => <path key={i} d={`M0 ${-i * 18}h92v18H0Z`} fill={i === 1 ? '#c9cdd2' : '#e3e5e8'} strokeWidth="2" />)}</g>
    <g data-ambient="idle"><Worker x={555} y={638} scale={.66} /></g>
    <path d="m575 597 22-10 7 17-21 9Z" fill="#2b2f35" strokeWidth="2" /><path d="m580 598 14-6 4 10-13 6Z" fill="#a5b1b8" strokeWidth="1" />
    <path d="M620 690V430m-12 0h24M612 448h16" strokeWidth="2.5" /><g data-ambient="beacon"><circle cx="620" cy="422" r="7" fill="#ffb33b" /></g>
  </g>;
}

/** Cross-section under the bench: the strata the drill passes through, with the ore seam the core samples. */
function Cutaway() {
  const band = (y: number, amp: number, k: number) => `M430 ${y}` + Array.from({ length: 15 }, (_, i) => ` L${430 + (i + 1) * 100} ${f1(y + Math.sin(i * .9 + k) * amp)}`).join('');
  return <g data-landmark="cutaway" strokeWidth="1.6">
    <path d="M430 694 L1930 694 L1930 735 1890 760 1915 800 1880 850 1910 905 L430 905 400 860 425 820 395 770 420 730Z" fill="#ebe9e3" stroke="#a7acb2" strokeDasharray="10 6" />
    <path d={`${band(770, 10, 1)} L1930 812 L430 812Z`} fill="#f3d2bb" stroke="none" />
    <path d={band(770, 10, 1)} stroke="#c98a63" />
    <path d={band(812, 8, 2)} stroke="#c98a63" />
    <path d={band(745, 6, 3)} stroke="#b7bcc2" /><path d={band(860, 9, 4)} stroke="#b7bcc2" />
    {Array.from({ length: 30 }, (_, i) => <path key={i} d={`m${450 + i * 49} ${720 + (i % 5) * 36} 8 14m-3-8 7-3`} stroke="#a7acb2" strokeWidth="1.2" />)}
    <text x="1500" y="796" fill="#a2593a" fontSize="13">mineralised seam</text>
  </g>;
}

function Excavator() {
  return <g data-actor="excavator" data-gp="excavator" transform="translate(1760 606)">
    <g data-gp="undercarriage"><path d="M-139 36h242a24 24 0 0 1 0 48h-242a24 24 0 0 1 0-48Z" fill="#202227" /><path d="M-130 46H94a14 14 0 0 1 0 27h-224Z" fill="#666b73" />{Array.from({ length: 13 }, (_, i) => <path key={i} d={`m${-135 + i * 19} 41-6 38`} stroke="#cbd0d5" strokeWidth="2" />)}{[-110, -50, 10, 70].map(x => <circle key={x} cx={x} cy="60" r="7" fill="#30343b" />)}<path d="M-60 28h80v8h-80Z" fill="#30343b" /></g>
    <g data-gp="house">
      <path d="M-150 28v-76q0-9 12-9h110l27 85Z" fill={orange} /><path d="M-126-36h56m-56 10h56m-56 10h56m-56 10h56" strokeWidth="2" />
      <path d="M-150 18h40" stroke={red} strokeWidth="4" />
      <path d="M-14 29-24-93h64l23 122Z" fill={orange} /><path d="M-14-82h46l11 58h-49Z" fill="#c4ced1" /><path d="M11-81v56M-4 5h29" />
      <path d="M-56 24v-78m-4 10h8m-8 14h8m-8 14h8m-8 14h8" strokeWidth="1.6" />
      <g data-ambient="beacon"><path d="M-112-57v-16h15v16" fill="#ffb34b" /></g><path d="M-100-83v-8m-13 10-5-6m30 6 5-6" strokeWidth="1.4" />
      <circle cx="54" cy="5" r="12" fill="#30343b" />
      <g data-gp="boom"><path d="M44-4 133-198 316-251 419-92 398-73 303-218 150-173 73 17Z" fill={orange} /><path d="M64-1 142-185 309-235 408-87" stroke="#fff6e8" strokeWidth="5" /><path d="M48-21 121-197 289-248M292-247 399-94" strokeWidth="5" /><path d="M48-21 121-197 289-248M292-247 399-94" stroke="#bfc5ca" strokeWidth="2" />{[[137, -187], [310, -234], [406, -88]].map(([x, y]) => <g key={x}><circle cx={x} cy={y} r="9" fill="#b4bbc2" /><circle cx={x} cy={y} r="3" fill={ink} /></g>)}
        <g data-actor="bucket" data-gp="bucket" transform="translate(406 -80)"><path d="M-31-6q49-15 79 8L25 66q-42 24-70-16Z" fill="#3d4249" /><path d="M-30 1q43-11 68 4L18 53q-28 16-53-12Z" fill="#808791" /><path d="m-23 3-8 37m25-39-6 45m23-45-4 47m19-43-9 35" strokeWidth="2" />{[-29, -10, 9, 28].map((x, i) => <path key={x} data-gp={`tooth-${i}`} d={i === 2 ? `m${x} 57-2 7 10-2 1-8Z` : `m${x} 57-6 23 12-3 6-24Z`} fill="#d9dbdc" strokeWidth="1.7" />)}
          <g data-gp="bucket-load">{[[-20, 22, .5], [2, 16, .6], [22, 22, .48], [-6, 6, .42]].map(([x, y, s], i) => <Rock key={i} x={x} y={y} size={s} variant={i} />)}</g>
          <g data-gp="bucket-cv" data-art="cv" className="cv-layer" stroke={red} opacity="0"><path data-gp="tooth-scan" d="M-46 50h88v40h-88Z" strokeWidth="1.3" strokeDasharray="4 3" /><path data-gp="bucket-defect" d="m6 51-10 36 18-3 9-36Z" strokeWidth="2.2" /><text data-gp="bucket-defect" x="50" y="74" fill="#b9432d" stroke="none" fontSize="9">tooth wear</text><path data-gp="bucket-defect" d="M26 70h22" strokeWidth="1" /></g>
        </g>
      </g>
    </g>
    <path data-gp="swing-arc" d="M-150-150q130-70 260 0m-14-14 14 14-20 4" stroke={red} strokeWidth="2.4" strokeDasharray="7 7" opacity="0" />
  </g>;
}

function Truck() {
  return <g data-actor="truck" data-gp="truck" transform="translate(2560 605)">
    {/* Truck Exterior: bed, wheels, chassis, headlights, exterior cab body */}
    <g data-gp="truck-exterior">
      <g data-gp="truck-dust" stroke="#b4b0a6" strokeWidth="1.6" opacity="0"><path d="M-198 70q-50-24-76-1m64 12h-82m42-25-48-6M-210 52q-30-30-64-8" /></g>
      <path d="M-176 10h335v37h-335Z" fill="#30343b" />
      <g data-gp="truck-bed"><path d="M-195-82H49l28 86h-231Z" fill={orange} /><path d="m-178-72 37 66m8-66 34 66m12-66 32 66m13-66 27 66M-199-84H66" strokeWidth="3" />
        <g data-gp="truck-payload">{Array.from({ length: 14 }, (_, i) => <g key={i} data-payload={i}><Rock x={-172 + (i % 8) * 28 + Math.floor(i / 8) * 14} y={-86 - Math.floor(i / 8) * 22} size={.47 + (i % 3) * .12} variant={i} accent={i === 5} /></g>)}</g>
      </g>
      {/* Exterior cab body */}
      <path d="M67-105h95l35 114v38H74ZM86-94h58l22 48H86Z" fill={orange} fillRule="evenodd" />
      {/* Exterior cab window with small exterior driver silhouette */}
      <g data-gp="cab-exterior" transform="translate(83 -98)">
        <clipPath id="cab-window"><path d="M3 4h58l22 48H3Z" /></clipPath>
        <g clipPath="url(#cab-window)" strokeWidth=".45">
          <path d="M3 34h80v20H3Z" fill="#d9dcdf" />
          <path d="M5 8h50l12 24H5Z" stroke="#9aa0a7" strokeWidth=".35" fill="none" />
          <path d="M18 24q2-3 6-3h7l3 26H17Z" fill="#3a3f46" />
          <g data-gp="driver">
            <path d="M28 33q1-7 8-8l9 1q6 2 6 9l-1 14H29Z" fill="#202227" />
            <path d="M33 27l9-1 6 3-1 17h-13Z" fill={orange} />
            <path d="M34 35h13m-12 5h12" stroke="#fffaf3" strokeWidth=".9" />
            <path d="m44 31 8 4 9 1" stroke="#202227" strokeWidth="2.2" fill="none" />
            <path d="m60 36 2 0" stroke="#f2eede" strokeWidth="2" />
            <g data-gp="driver-head">
              <path d="M38 23q-2-9 4-12 7-2 10 4l1 4 2 2-2 1-1 3q-3 3-8 2Z" fill="#f2eede" />
              <path d="M37 13q0-7 7-7 8 0 9 7l2 1-19 1Z" fill={orange} />
              <path d="M35 14.5h21" strokeWidth=".7" />
              <path data-gp="driver-eyes" d="m49 16.5 2.4-.4" strokeWidth=".55" />
              <path d="m53 19 1.4.6m-3.2 2.4 2 .1" strokeWidth=".35" />
            </g>
          </g>
          <ellipse cx="63" cy="37" rx="2" ry="7" transform="rotate(-18 63 37)" fill="none" strokeWidth=".9" />
          <path d="M63 41 69 47M64 46h20l4 8H64Z" fill="#2b2f35" />
          <path data-gp="cab-screen" d="M71 41.5h6v4h-6Z" fill="#a5b1b8" strokeWidth=".3" />
          <path data-gp="driver-alert" d="m72.6 45 1.4-2.6 1.4 2.6Z" fill={red} stroke="none" opacity="0" />
          <path d="M58 6h5l1 3h-5Z" fill={orange} strokeWidth=".3" /><circle cx="59.5" cy="7.5" r=".7" fill={ink} stroke="none" />
          <g data-gp="driver-cv" data-art="cv" className="cv-layer" stroke={red} opacity="0" strokeWidth=".22" fill="none">
            <path d="m59 8.5-8 8m8-8-4 12m4-12 2 14" strokeDasharray=".8 .8" />
            <path d="M47 14h8v8h-8Z" strokeWidth=".3" />
            {[[50, 16.5], [52, 19.5], [51, 22], [46, 18]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r=".45" fill={red} stroke="none" />)}
            <path data-gp="head-axis" d="M44 9v15" strokeDasharray=".6 .6" />
            <text x="56" y="13" fill="#b9432d" stroke="none" fontSize="1.3">eye closure</text>
            <text x="56" y="25" fill="#b9432d" stroke="none" fontSize="1.3">head pose</text>
          </g>
        </g>
        <path d="M0 0h70l25 69H0Z" fill="none" strokeWidth="2.3" />
        <path d="M3 4h58l22 48H3Z" fill="none" strokeWidth="1.3" />
        <path d="M4 1v51m61-48 20 48M2 52h83" stroke="#252930" strokeWidth="3" />
        <path d="M30 52v14m-26-4h22" strokeWidth="1.2" />
      </g>
      {/* Front stairs / access ladder & headlights */}
      <path d="M159-41h23l17 43m-12 7h15m-15 8h15m-15 8h15M91-10h15M73 5v27h15V5m-12 9h9m-9 9h9" strokeWidth="1.8" />
      <path d="M178 36h27v12h-27Z" fill="#bec3c8" /><g data-ambient="beacon"><path d="M114-117h18v10h-18Z" fill="#ffb34b" /></g>
      {/* Wheels */}
      {[-126, 48, 155].map(cx => <g key={cx} transform={`translate(${cx} 45)`}><circle r="37" fill="#202227" /><circle r="24" fill="#aab1b9" /><circle r="11" fill="#4e555f" /><g data-gp="wheel"><path d="M0-32v10m32 22H22M0 32V22m-32-22h10" stroke="#68717b" strokeWidth="4" />{[0, 1, 2, 3, 4, 5].map(i => <circle key={i} cx={f1(Math.cos(i * Math.PI / 3) * 16)} cy={f1(Math.sin(i * Math.PI / 3) * 16)} r="2" fill="#252930" stroke="none" />)}</g></g>)}
    </g>

    {/* Cab detail stage: dedicated interior composition revealed through the windshield frame */}
    <g data-gp="cab-detail-stage" data-gp-alias="cab-interior-detail" opacity="0" transform="translate(83 -98)">
      <defs>
        <clipPath id="cab-window-clip">
          <path d="M-10 -15H115L145 75H-10Z" />
        </clipPath>
      </defs>

      {/* Cab interior wrapped in window clip */}
      <g clipPath="url(#cab-window-clip)">
        {/* Cab interior background shell */}
        <path d="M-14 -18h134l34 98H-14Z" fill="#181b22" stroke="#101216" strokeWidth="2" />
        {/* Windshield road perspective & haul road outside */}
        <path d="M-6 -10h112l26 68H-6Z" fill="#c3ccd5" />
        <path d="M-6 24h134" stroke="#8c97a2" strokeWidth="2" />
        <path data-gp="driver-road-line" d="M10 48l45 -22" stroke="#f8eed3" strokeWidth="3.5" strokeDasharray="12 9" />
        {/* Distant haul road bench contour visible through window */}
        <path d="M-6 18q50 -12 120 4" stroke="#a4adb6" strokeWidth="1.8" fill="none" />

        {/* Dashboard console and steering wheel */}
        <path d="M-10 34h136v40H-10Z" fill="#262a32" stroke="#15181e" strokeWidth="2" />
        <circle cx="20" cy="48" r="8" fill="#181a1f" stroke="#5d6572" strokeWidth="1.5" />
        <circle cx="72" cy="48" r="8" fill="#181a1f" stroke="#5d6572" strokeWidth="1.5" />
        {/* Heavy haul steering wheel */}
        <ellipse cx="45" cy="42" rx="22" ry="15" fill="none" stroke="#131518" strokeWidth="4.8" />
        <path d="M23 42h44M45 42v15" stroke="#131518" strokeWidth="3.6" />

        {/* Driver torso and hi-vis vest */}
        <path d="M14 38q2-16 18-18h24q16 2 18 18v34H14Z" fill="#1b1e23" />
        <path d="M22 32l10-12h18l10 12v30H22Z" fill={orange} />
        <path d="M26 32h28M26 42h28" stroke="#ffffff" strokeWidth="2.4" />
        <circle cx="25" cy="42" r="4.5" fill="#ebdcc8" /><circle cx="65" cy="42" r="4.5" fill="#ebdcc8" />

        {/* Detailed driver head and clearly readable eyelid cues */}
        <g data-gp="driver-detail-head" style={{ transformOrigin: '45px 18px' }}>
          <path d="M30 10q3-16 15-16t15 16l4 2H26Z" fill={orange} stroke="#1b1d22" strokeWidth="1.6" />
          <path d="M25 12h40v3.5H25Z" fill="#22262d" />
          <path d="M31 13v12q0 8 14 8t14-8V13Z" fill="#ebdcc8" stroke="#22262d" strokeWidth="1.8" />
          <path d="M29 18v5M59 18v5" stroke="#22262d" strokeWidth="1.5" />
          <g data-gp="driver-detail-eyes">
            <path data-gp="eye-l" d="M36 19.5h7" stroke="#1a1c22" strokeWidth="2.6" strokeLinecap="round" />
            <path data-gp="eye-r" d="M47 19.5h7" stroke="#1a1c22" strokeWidth="2.6" strokeLinecap="round" />
            <circle data-gp="pupil-l" cx="39.5" cy="20" r="1.4" fill="#1a1c22" />
            <circle data-gp="pupil-r" cx="50.5" cy="20" r="1.4" fill="#1a1c22" />
          </g>
          <path d="M45 18v5l-2 1M40 27h10" stroke="#333840" strokeWidth="1.4" />
        </g>

        {/* In-cab fatigue optical sensor mounted on A-pillar */}
        <path d="M84 2h20v16H84Z" fill="#20242b" stroke="#383e48" strokeWidth="1.6" />
        <circle cx="94" cy="10" r="4.2" fill="#454c57" />
        <circle data-gp="cab-cv-led" cx="100" cy="5.5" r="1.8" fill="#4ade80" />
        <g data-gp="cab-cv-detail" data-art="cv" className="cv-layer" opacity="0" stroke={red} fill="none">
          <path d="M94 10L40 18M94 10L50 22M94 10L45 28" strokeWidth="1.3" strokeDasharray="3 3" />
          <rect x="33" y="12" width="24" height="20" rx="2.5" strokeWidth="1.8" />
          <text x="60" y="8" fill="#b9432d" stroke="none" fontSize="7" fontWeight="bold">FATIGUE TRACKING</text>
          <text x="60" y="17" fill="#b9432d" stroke="none" fontSize="6">PERCLOS: ELEVATED</text>
        </g>

        {/* Dashboard fatigue intervention alert */}
        <g data-gp="cab-detail-alert" opacity="0">
          <circle cx="45" cy="52" r="7" fill="#ef4444" />
          <path d="M45 48v5M45 55v1.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          <text x="31" y="65" fill="#ef4444" stroke="none" fontSize="6" fontWeight="bold">ALERT: REFOCUS</text>
        </g>
      </g>

      {/* Foreground cab frame: angled structural A-pillar, roof edge, and window mullions */}
      <g data-gp="cab-frame-fg" stroke="#131519" strokeWidth="2" fill="#1c1f26">
        {/* Left A-pillar (angled structural steel) */}
        <path d="M-12 -16h14l22 92H-12Z" />
        {/* Roof line / lintel */}
        <path d="M-12 -16h134v8H-12Z" />
        {/* Right pillar / door frame */}
        <path d="M96 -16h18l24 92H118Z" />
        {/* Windshield lower sill */}
        <path d="M18 68h112v8H18Z" fill="#14161b" />
      </g>
    </g>
  </g>;
}

/** One bench, one muckpile, one excavator, one worker and one truck. Semantic beats change their state. */
export function GeologyPitWorld() {
  return <g data-world-part="geology-pit" stroke={ink} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" fill="none">
    <Cutaway />
    <CoreStation />
    <g data-gp="bench-site" transform={`translate(0 ${SITE})`}>
      <path d="M470 617 520 455 640 400 860 370 1100 400 1300 360 1560 430 1800 617Z" fill="#eceef0" stroke="#a3a9b0" strokeWidth="2" />
      <g data-gp="bench-face">
        <path d={benchTop} fill="#dcdfe3" strokeWidth="3.4" />
        <path d={benchTop} fill="url(#geology-hatch)" stroke="none" />
        <path d="M573 489 739 435 1001 459 1233 421 1630 487M549 551 755 498 1013 514 1295 477 1683 551M603 403 811 381 1075 410 1297 378 1508 417" stroke="#8c9198" strokeWidth="1.6" />
        {Array.from({ length: 25 }, (_, i) => <path key={i} d={`m${625 + i * 40} ${425 + (i % 4) * 29} 9 23-4 16m1-21-8-7`} stroke="#9aa0a7" strokeWidth="1.5" />)}
        {[[690, 560, .8], [930, 590, .7], [1250, 575, .9], [1520, 590, .6], [1100, 470, .5]].map(([x, y, s], i) => <Rock key={i} x={x} y={y} size={s} variant={i} />)}
      </g>
      <g data-gp="holes" opacity="0">
        <path d={wire} strokeWidth="1.8" />
        {holes.map(([x, y]) => <g key={x}><path d={`M${x} ${y}v26`} stroke="#5d636b" strokeWidth="5" /><ellipse cx={x} cy={y} rx="9" ry="3.5" fill="#30343b" strokeWidth="1.6" /><path d={`M${x - 2} ${y - 8}v-14l12 5-12 4`} fill={orange} strokeWidth="1.4" /></g>)}
        <path data-gp="wire-pulse" d={wire} pathLength="1000" stroke={red} strokeWidth="5" strokeDasharray="60 2000" strokeDashoffset="60" />
      </g>
      <g data-gp="detonator" transform="translate(556 604)"><path d="M-9-9h18v18h-18Z" fill="#dee0e3" strokeWidth="2" /><circle r="3" fill={red} stroke="none" /><text x="16" y="5" stroke="none" fill="#767b82" fontSize="11">charge line</text></g>
      <g data-gp="fragments" opacity="0">
        {fragments.map((fr, i) => <g key={i} data-fragment={i}><Rock x={fr.x} y={fr.y} size={fr.size} variant={i} /></g>)}
      </g>
      <g data-gp="blast-burst" opacity="0">
        {holes.map(([x, y], i) => <g key={x} data-burst={i} transform={`translate(${x} ${y}) scale(.55)`}><path d={`M0-${70 + i % 2 * 30}l14 44 40-26-22 40 50 6-48 18 26 34-42-14-8 44-14-42-36 28 12-44-46-4 42-20-30-36 42 14Z`} fill="#ffa56b" stroke={red} strokeWidth="3" /><path d="M0-30l8 22 22-8-14 18 20 10-24 2 4 22-14-16-14 16 2-22-22-4 20-10-12-18 20 8Z" fill="#fff4e0" stroke="none" /></g>)}
        <path data-burst-lines d="M690 300 630 240M1450 310l70-70M1080 270V190M820 270l-36-66M1330 280l46-70M960 280l-14-60M1210 280l20-62" stroke="#8c9198" strokeWidth="2.4" strokeDasharray="14 8" />
      </g>
      <g data-gp="flyers" opacity="0">{flyers.map((_, i) => <g key={i} data-flyer={i}><Rock x={0} y={0} size={1} variant={i + 1} /></g>)}{flyers.map(([x], i) => <path key={`l${x}`} data-flyer-trail={i} d="M0 0h-30" stroke="#8c9198" strokeWidth="2" />)}</g>
      <g data-gp="dust" opacity="0">
        {puffs.map((pf, i) => <g key={i} data-puff={i} transform={`translate(${pf.x} ${pf.y})`}><path d={puff(pf.r)} fill={i % 3 ? '#eeeae2' : '#e4dfd4'} stroke="#b9b2a5" strokeWidth="2" /><path d={`M${-pf.r * .4} ${pf.r * .1}q${pf.r * .3}-${pf.r * .3} ${pf.r * .6} 0`} stroke="#cdc6b9" strokeWidth="1.6" /></g>)}
      </g>
      <g data-gp="grade-cv" className="cv-layer" data-art="cv" stroke={red} fill="#ffddc3" fillOpacity=".5" opacity="0">
        <path data-gp="grade-ore" d="M624 495 729 348 865 311 1069 353 1020 535 737 589Z" />
        <path data-gp="grade-waste" d="M1069 353 1220 321 1460 384 1621 517 1320 563 1020 535Z" fill="#bcc0c5" />
        <path d="M737 589 865 311M737 589 1069 353M1020 535 1220 321" fill="none" strokeDasharray="5 8" />
        <path data-gp="grade-sweep" d="M600 300v330" stroke={red} strokeWidth="3" fill="none" />
        <text x="790" y="469" fill="#b9432d" stroke="none" fontSize="21">ore region</text>
        <text x="1275" y="458" fill="#595c62" stroke="none" fontSize="21">waste region</text>
        <text x="760" y="660" fill="#b9432d" stroke="none" fontSize="15">grade proxies · site calibration and assays required</text>
      </g>
      <g data-gp="fragment-cv" data-art="cv" className="cv-layer" stroke={red} opacity="0">
        {fragments.map((fr, i) => i % 2 === 1 ? <path key={i} data-contour={i} transform={`translate(${fr.x} ${fr.y}) scale(${f1(fr.size * 1.16)})`} d={rockShapes[i % 5]} strokeWidth={f1(2.2 / fr.size)} strokeDasharray={`${f1(5 / fr.size)} ${f1(2 / fr.size)}`} opacity="0" /> : null)}
        <g data-gp="fragment-distribution"><Distribution x={760} y={330} /></g>
      </g>
      <g data-actor="drill" data-gp="drill-rig" transform="translate(650 455)"><Drill scale={.83} /></g>
      <g data-gp="fragment-camera" transform="translate(1650 382)"><path d="M0 0v240" strokeWidth="3" /><Camera scale={.7} /></g>
    </g>
    <g data-actor="core-tray" data-gp="core-tray" transform="translate(40 540)">
      <path d="M-18-16h458l27 156H-35Z" fill="#c6cbd0" />
      {[0, 1, 2].map(row => <g key={row}><path d={`M${-12 - row * 5} ${row * 44}h444l7 33H${-18 - row * 5}Z`} fill="#7b8189" />{Array.from({ length: 8 }, (_, i) => row === 0 && i < 3 ? null : <g key={i}><path d={`M${i * 54 - row * 5} ${7 + row * 44}q5-8 15-7h30l8 25-51 2Z`} fill={i % 3 === 0 ? '#aaafb5' : '#e3e4e6'} strokeWidth="1.6" /><path d={`m${i * 54 + 23 - row * 5} ${row * 44 + 2}-5 11 8 5-5 10`} strokeWidth="1.1" /></g>)}</g>)}
      <g data-gp="core-cv" data-art="cv" className="cv-layer" stroke={red} opacity="0"><path data-gp="core-marks" d="M135 2v120M285 2v120m-50-87-7 13 9 5-4 13M60 50l20 18m120 30 16-14" /><text x="147" y="-24" fill="#b9432d" stroke="none" fontSize="8">fracture · vein · lithology boundary</text><path data-gp="core-scan" d="M0-13v143" strokeWidth="2.5" /></g>
      <path d="M-34 143v7m481-10v10" /><text x="9" y="160" stroke="none" fill="#767b82" fontSize="7">DH-04 · core tray 12 · illustrative</text>
    </g>
    <g data-actor="core" data-gp="core-sample" transform="translate(706 700)" opacity="0"><path d="M-9-125q9-9 18 0V0q-9 8-18 0Z" fill="#bcc1c6" /><path d="m-9-90 18-6m-18 43 18-9m-18 39 18-7" strokeWidth="1.5" /><path d="m-9-70 18 4" stroke={red} strokeWidth="2" /></g>
    <path data-gp="seam" data-art="cv" className="cv-layer" d={`M120 556C260 548 420 600 600 640L737 ${589 + SITE} 1020 ${535 + SITE} 1069 ${353 + SITE}`} pathLength="1000" stroke={red} strokeWidth="3.4" strokeDasharray="1000" strokeDashoffset="1000" />
    <Excavator />
    <g data-gp="boulder" opacity="0"><Rock size={.95} variant={3} /><g data-gp="boulder-cv" data-art="cv" className="cv-layer" opacity="0"><path d="M-34-30h68v58h-68Z" stroke={red} strokeWidth="2" /><text x="-36" y="-40" fill="#b9432d" stroke="none" fontSize="12">oversize</text></g></g>
    <g data-gp="safety-cv" data-art="cv" className="cv-layer" stroke={red} opacity="0">
      <ellipse data-gp="safety-zone" cx="1740" cy="690" rx="440" ry="58" strokeDasharray="7 8" fill="#ffd9c8" fillOpacity=".35" />
      <path data-gp="proximity" d="M1900 600h150" strokeWidth="2" />
      <text x="1640" y="780" fill="#b9432d" stroke="none" fontSize="16">swing radius · exclusion zone</text>
      <text data-gp="operator-warning" x="1640" y="804" fill="#b9432d" stroke="none" fontSize="16">operator warned · swing held</text>
    </g>
    <g data-actor="worker" data-gp="worker" transform="translate(2600 640)"><g data-gp="worker-body"><Worker scale={1} /></g></g>
    <g data-gp="worker-cv" data-art="cv" className="cv-layer" stroke={red} opacity="0" transform="translate(2600 640)"><path d="M-24-80h48V56h-48Z" strokeWidth="2" /><path d="M-16-80v-8h-8m40 8v-8h8" strokeWidth="2" /><text x="-46" y="-96" stroke="none" fill="#b9432d" fontSize="13">person · helmet · vest</text></g>
    <g data-actor="loading-material" data-gp="falling-load" opacity="0">{[0, 1, 2, 3].map(i => <g key={i} data-fall={i}><Rock size={.5 + (i % 2) * .15} variant={i} /></g>)}</g>
    <Truck />
    <g data-actor="dump-material" data-gp="dump-material" opacity="0">{[0, 1, 2, 3, 4].map(i => <g key={i} data-dump={i}><Rock size={.5 + (i % 3) * .14} variant={i + 2} accent={i === 2} /></g>)}</g>
  </g>;
}

type Nodes = Map<string, SVGElement[]>;
const cache = new WeakMap<SVGElement, Nodes>();
function nodes(root: SVGElement) {
  let result = cache.get(root);
  if (!result) {
    result = new Map();
    const scope = root.querySelector('[data-world-part="geology-pit"]') ?? root;
    scope.querySelectorAll<SVGElement>('[data-gp]').forEach(el => {
      const name = el.getAttribute('data-gp')!;
      result!.set(name, [...(result!.get(name) ?? []), el]);
    });
    if (result.has('cab-detail-stage') && !result.has('cab-interior-detail')) {
      result.set('cab-interior-detail', result.get('cab-detail-stage')!);
    }
    const all = (sel: string) => Array.from(scope.querySelectorAll<SVGElement>(sel));
    result.set('$fragments', all('[data-fragment]'));
    result.set('$bursts', all('[data-burst]'));
    result.set('burst-lines', all('[data-burst-lines]'));
    result.set('$contours', all('[data-contour]'));
    result.set('$puffs', all('[data-puff]'));
    result.set('$flyers', all('[data-flyer]'));
    result.set('$trails', all('[data-flyer-trail]'));
    result.set('$payload', all('[data-payload]'));
    result.set('$fall', all('[data-fall]'));
    result.set('$dump', all('[data-dump]'));
    result.set('$pipe', all('[data-actor="drill"] [data-art="pipe"]'));
    result.set('$sensor-rays', all('[data-gp="fragment-camera"] [data-art="cv"]'));
    cache.set(root, result);
  }
  return result;
}

/** Pure scroll projection: seeking any scene gives the same attributes, including in reverse. */
export function updateGeologyPit(root: SVGElement, scene: SceneId, progress: number) {
  const p = clamp(progress), q = nodes(root);
  const attr = (name: string, key: string, value: string | number) => q.get(name)?.forEach(el => el.setAttribute(key, String(value)));
  const transform = (name: string, value: string) => attr(name, 'transform', value);
  const opacity = (name: string, value: number) => attr(name, 'opacity', f1(clamp(value)));
  const story = storyAt(scene, p);
  const activeCV = ['observing', 'solution', 'action', 'result'].includes(story);
  const cvFade = 1 - ramp(p, .9, .98);
  const is = (id: SceneId) => scene === id;
  opacity('$sensor-rays', is('fragments') && activeCV ? 1 : 0);

  // Drill and core: the pipe descends, the sample rises on the wireline and is laid in the tray.
  const pipe = is('drill') ? heavy(ramp(p, .08, .5)) * 140 : is('core') ? 140 * (1 - heavy(ramp(p, .25, .6))) : 0;
  transform('$pipe', `translate(0 ${f1(pipe)})`);
  // The rig trams clear of the bench before it is charged.
  const tram = is('grade') ? heavy(ramp(p, .84, 1)) * .55 : is('blast') ? .55 + heavy(ramp(p, 0, .16)) * .45 : after(scene, 'blast') ? 1 : 0;
  transform('drill-rig', `translate(${f1(lerp(650, 150, tram))} ${f1(lerp(455, 560, tram))})`);
  const lift = is('drill') ? smooth(ramp(p, .58, .96)) : after(scene, 'drill') ? 1 : 0;
  const lay = is('core') ? heavy(ramp(p, 0, .2)) : after(scene, 'core') ? 1 : 0;
  const arc = Math.sin(lay * Math.PI) * 70;
  transform('core-sample', `translate(${f1(lerp(706, 48, lay))} ${f1(lerp(810 - lift * 270, 560, lay) - arc)}) rotate(${f1(lay * 90)})`);
  opacity('core-sample', is('drill') ? ramp(p, .56, .6) : after(scene, 'drill') ? 1 : 0);
  opacity('core-cv', is('core') && (activeCV || p > .9) ? cvFade : 0);
  transform('core-scan', `translate(${f1(is('core') ? ramp(p, .39, .7) * 420 : 0)} 0)`);
  attr('core-marks', 'opacity', is('core') ? f1(ramp(p, .5, .58)) : 0);
  const seam = is('core') ? smooth(ramp(p, .82, 1)) * .35 : is('grade') ? .35 + smooth(ramp(p, 0, .3)) * .65 : 0;
  opacity('seam', is('core') && p > .82 || is('grade') && p < .55 ? 1 : is('grade') ? 1 - ramp(p, .55, .62) : 0);
  attr('seam', 'stroke-dashoffset', f1(1000 * (1 - seam)));

  // Grade: the boundary becomes material regions; the overlay recedes before the bench is charged.
  const grade = is('grade') ? ramp(p, .32, .55) * (1 - ramp(p, .84, .92)) : 0;
  opacity('grade-cv', is('grade') && activeCV ? grade : 0);
  transform('grade-sweep', `translate(${f1(is('grade') ? ramp(p, .3, .56) * 1050 : 0)} 0)`);
  opacity('grade-sweep', is('grade') && p > .3 && p < .56 ? 1 : 0);

  // Blast: handle, pulse, stillness, impulse, dust curtain, the same bench settles as a muckpile.
  const holesIn = is('grade') ? ramp(p, .88, 1) : is('blast') ? 1 - ramp(p, .5, .52) : 0;
  opacity('holes', holesIn);
  attr('wire-pulse', 'stroke-dashoffset', is('blast') ? f1(60 - ramp(p, .26, .44) * 1060) : 60);
  opacity('detonator', is('blast') || (is('grade') && p > .9) ? 1 : 0);
  const b = is('blast') ? ramp(p, .5, .86) : after(scene, 'blast') ? 1 : 0;
  const collapse = 1 - Math.pow(1 - b, 3);
  const sy = 1 - collapse * .72, sx = 1 + collapse * .04;
  transform('bench-face', `translate(${f1(1140 * (1 - sx))} ${f1(BASE * (1 - sy))}) scale(${f1(sx)} ${f1(sy)})`);
  opacity('fragments', b > 0 ? 1 : 0);
  q.get('$fragments')?.forEach((el, i) => {
    const fr = fragments[i], t = clamp(b * 1.15 - (i % 7) * .02);
    const e = 1 - Math.pow(1 - t, 2.4);
    const hop = Math.sin(t * Math.PI) * (40 + (i % 5) * 26);
    el.setAttribute('transform', `translate(${f1(lerp(fr.sx, fr.x, e) - fr.x)} ${f1(lerp(fr.sy, fr.y, e) - fr.y - hop)}) rotate(${f1((1 - e) * fr.spin)} ${fr.x} ${fr.y})`);
  });
  // Delay-timed holes fire in sequence along the bench.
  opacity('blast-burst', is('blast') && p > .49 && p < .62 ? 1 : 0);
  q.get('$bursts')?.forEach((el, i) => {
    const k = is('blast') ? ramp(p, .5 + i * .011, .545 + i * .011) : 0;
    el.setAttribute('opacity', String(f1(Math.sin(k * Math.PI))));
    el.setAttribute('transform', `translate(${holes[i][0]} ${holes[i][1]}) scale(${f1(.3 + k * .4)})`);
  });
  attr('burst-lines', 'opacity', is('blast') ? f1(Math.sin(ramp(p, .5, .58) * Math.PI)) : 0);
  const fly = is('blast') ? ramp(p, .5, .68) : 0;
  opacity('flyers', fly > 0 && fly < 1 ? 1 : 0);
  q.get('$flyers')?.forEach((el, i) => {
    const [x, y, dx, dy, s] = flyers[i], t = Math.pow(fly, 1.4);
    el.setAttribute('transform', `translate(${f1(x + dx * t)} ${f1(y + dy * t - Math.sin(t * Math.PI) * 120)}) scale(${f1(.6 + t * (s - .6))}) rotate(${f1(t * 160 * (i % 2 ? 1 : -1))})`);
  });
  q.get('$trails')?.forEach((el, i) => {
    const [x, y, dx, dy] = flyers[i], t = Math.pow(fly, 1.4);
    el.setAttribute('transform', `translate(${f1(x + dx * t)} ${f1(y + dy * t - Math.sin(t * Math.PI) * 120)}) rotate(${f1(Math.atan2(dy, dx) * 180 / Math.PI + 180)})`);
  });
  const dust = is('blast') ? smooth(ramp(p, .5, .6)) * (1 - ramp(p, .9, 1) * .45) : is('fragments') ? .55 * (1 - smooth(ramp(p, 0, .22))) : 0;
  opacity('dust', dust);
  q.get('$puffs')?.forEach((el, i) => {
    const pf = puffs[i], g = is('blast') ? ramp(p, .5, .8) : is('fragments') ? 1 + ramp(p, 0, .22) * .5 : 0;
    const drift = is('fragments') ? ramp(p, 0, .22) * -90 : 0;
    el.setAttribute('transform', `translate(${f1(pf.x - g * 30 + drift)} ${f1(pf.y + 170 - g * 120 - (i % 3) * g * 25)}) scale(${f1(.35 + Math.min(g, 1) * .85 + Math.max(0, g - 1) * .3)})`);
  });

  // Fragmentation: contours trace individual rocks, then the distribution builds.
  const contours = is('fragments') ? ramp(p, .34, .58) : 0;
  opacity('fragment-cv', is('fragments') && activeCV ? 1 - ramp(p, .9, .97) : 0);
  q.get('$contours')?.forEach((el, i, list) => el.setAttribute('opacity', String(f1(ramp(contours * list.length - i, 0, 1)))));
  opacity('fragment-distribution', is('fragments') ? ramp(p, .58, .66) : 0);

  // Pit: excavator slews between muckpile, worker path and truck.
  const ex = excavatorPose(scene, p);
  const facing = Math.sign(ex.facing || 1) * Math.max(.06, Math.abs(ex.facing));
  transform('excavator', `translate(${f1(ex.x)} 606)`);
  transform('house', `translate(-20 0) scale(${f1(facing)} 1) translate(20 0)`);
  transform('boom', `rotate(${f1(ex.boom)} 54 5)`);
  transform('bucket', `translate(406 -80) rotate(${f1(ex.bucket)})`);
  opacity('bucket-load', ex.load > .05 ? 1 : 0);
  transform('bucket-load', `translate(0 ${f1((1 - ex.load) * 16)}) scale(1 ${f1(.4 + ex.load * .6)})`);
  opacity('swing-arc', is('safety') ? Math.sin(ex.swing * Math.PI) : 0);
  const lip = bucketWorld(ex.x, facing, ex.boom);
  const dropT = is('bucket') ? gravity(ramp(p, .76, .84)) : after(scene, 'bucket') ? 1 : 0;
  const carried = (is('excavation') && ex.load > .6) || is('safety') || (is('bucket') && p < .76);
  opacity('boulder', carried || dropT > 0 ? 1 : 0);
  transform('boulder', `translate(${f1(lerp(lip.x + 4 * facing, 1985, dropT))} ${f1(lerp(lip.y + 6, 664, dropT) - Math.sin(dropT * Math.PI) * 30)}) rotate(${f1(dropT * 70)})`);
  opacity('boulder-cv', is('bucket') && p >= .64 ? 1 - ramp(p, .9, .96) : 0);
  opacity('bucket-cv', is('bucket') && activeCV ? 1 - ramp(p, .88, .93) : 0);
  transform('tooth-scan', `translate(0 ${is('bucket') ? f1(Math.sin(ramp(p, .37, .58) * Math.PI * 2) * 3) : 0})`);
  opacity('bucket-defect', is('bucket') && p >= .58 ? 1 : 0);

  // Worker walks into the swing path, is warned, and steps clear before the truck reverses in.
  const wk = workerPose(scene, p);
  transform('worker', `translate(${f1(wk.x)} ${f1(wk.y)})`);
  transform('worker-body', `scale(${wk.dir * .68} .68) rotate(${f1(wk.walk * Math.sin(wk.x / 14) * 3)})`);
  transform('worker-cv', `translate(${f1(wk.x)} 640)`);
  opacity('worker-cv', is('safety') && (activeCV || p > .9) ? cvFade : 0);
  opacity('safety-cv', is('safety') && (activeCV || p > .9) ? cvFade : 0);
  attr('safety-zone', 'rx', is('safety') ? f1(120 + ramp(p, .4, .52) * 320) : 440);
  attr('proximity', 'd', `M${f1(Math.min(2180, wk.x - 30))} 600H${f1(wk.x - 26)}`);
  opacity('operator-warning', is('safety') && p >= .7 ? 1 : 0);

  // Loading: material falls from the bucket lip into the same truck bed.
  const t = truckPose(scene, p);
  const pouring = (is('bucket') && p > .9) || (is('loading') && p < .38);
  const pourT = is('bucket') ? ramp(p, .9, .98) : ramp(p, 0, .38);
  opacity('falling-load', pouring ? 1 : 0);
  q.get('$fall')?.forEach((el, i) => {
    const k = (pourT * 2.2 + i * .27) % 1, g = gravity(k);
    el.setAttribute('transform', `translate(${f1(lip.x + 10 + i * 9 + g * 30)} ${f1(lip.y + 30 + g * (t.y - 90 - lip.y))}) rotate(${f1(k * 90)})`);
  });
  const shown = Math.round(t.payload * 14);
  q.get('$payload')?.forEach((el, i) => el.setAttribute('opacity', i < shown ? '1' : '0'));
  const settle = is('loading') ? Math.sin(ramp(p, .3, .5) * Math.PI) * 3 : 0;
  transform('truck', `translate(${f1(t.x)} ${f1(t.y + settle)}) rotate(${f1(t.angle)}) scale(${f1(Math.sign(t.facing || 1) * Math.max(.05, Math.abs(t.facing)))} 1)`);
  transform('truck-bed', `rotate(${f1(-t.bed * 34)} -167 3)`);
  transform('wheel', `rotate(${f1(t.wheel)})`);
  const moving = is('haul') || is('driver') || (is('loading') && p > .8) || (is('crusher') && p < .44);
  opacity('truck-dust', moving ? .85 : 0);

  // Dump: rocks leave the raised bed and fall behind the hopper wall.
  const dump = is('crusher') ? ramp(p, .5, .74) : 0;
  opacity('dump-material', dump > 0 && dump < 1 ? 1 : 0);
  q.get('$dump')?.forEach((el, i) => {
    const k = clamp(dump * 1.4 - i * .1), g = gravity(k);
    el.setAttribute('transform', `translate(${f1(3705 + i * 8 + k * 60)} ${f1(250 + i * 6 + g * 170)}) rotate(${f1(k * 120)})`);
  });

  // Driver: attention drifts, in-cab camera observes, alert prompts refocus.
  // Smooth architectural cab frame entry/exit with local magnification
  if (is('driver')) {
    // Timing arc:
    // 0.00-0.10: approach cab exterior
    // 0.10-0.22: A-pillar and windshield frame sweep into focal view, interior ramps in, local magnification scales 1.0 -> 2.4
    // 0.22-0.78: quiet interior sequence, held at 2.4x magnification, exterior truck hidden
    // 0.78-0.88: driver refocused, alert clears
    // 0.88-0.96: cab framing pulls back, magnification 2.4 -> 1.0, exterior truck restores
    // 0.96-1.00: exterior truck fully restored
    const intro = ramp(p, 0.10, 0.22);
    const outro = ramp(p, 0.86, 0.96);
    const interiorDominance = smooth(intro) * (1 - smooth(outro));
    const isInterior = interiorDominance > 0.05;

    // Exterior truck fades gracefully as camera arrives inside cab
    opacity('truck-exterior', 1 - interiorDominance);
    opacity('cab-exterior', 1 - interiorDominance);

    // Interior stage opacity
    opacity('cab-detail-stage', interiorDominance);
    opacity('cab-interior-detail', interiorDominance);

    // Local magnification: scale from 1.0 up to 2.4 centered around (45, 18)
    const localScale = 1.0 + interiorDominance * 1.4; // 1.0 -> 2.4
    const ox = 45, oy = 18;
    const tx = 83 + ox * (1 - localScale);
    const ty = -98 + oy * (1 - localScale);
    transform('cab-detail-stage', `translate(${f1(tx)} ${f1(ty)}) scale(${f1(localScale)})`);

    // Fatigue development: attention drifts, eyes droop, alert at 0.60, refocus at 0.72
    const tired = smooth(ramp(p, 0.28, 0.54)) * (1 - smooth(ramp(p, 0.68, 0.78)));
    transform('driver-detail-head', `rotate(${f1(tired * 18)} 45 18) translate(0 ${f1(tired * 2.5)})`);
    transform('driver-head', `rotate(${f1(tired * 16)} 44 25) translate(0 ${f1(tired * 1.2)})`);

    // Eyes droop to slits when tired
    const eyeSlit = tired > 0.45;
    opacity('pupil-l', eyeSlit ? 0 : 1);
    opacity('pupil-r', eyeSlit ? 0 : 1);
    attr('eye-l', 'd', eyeSlit ? `M36 ${19.5 + tired * 1.5}h7` : 'M36 19.5h7');
    attr('eye-r', 'd', eyeSlit ? `M47 ${19.5 + tired * 1.5}h7` : 'M47 19.5h7');
    attr('driver-eyes', 'd', eyeSlit ? 'm49 17.2 2.4 0' : 'm49 16.5 2.4-.4');

    // CV fatigue sensor cone and HUD signals
    opacity('cab-cv-detail', activeCV && isInterior && p >= 0.34 && p <= 0.84 ? 1 : 0);
    opacity('driver-cv', is('driver') && activeCV ? 1 - ramp(p, .82, .9) : 0);
    transform('head-axis', `rotate(${f1(tired * 16)} 44 24)`);

    // Alert indicator
    const alerting = isInterior && p >= 0.60 && p <= 0.78;
    opacity('cab-detail-alert', alerting ? 1 : 0);
    attr('cab-cv-led', 'fill', alerting ? '#ef4444' : '#4ade80');
    opacity('driver-alert', is('driver') && p >= .62 && p < .8 ? 1 : 0);
    attr('cab-screen', 'fill', is('driver') && p >= .62 && p < .8 ? '#ffd2c2' : '#a5b1b8');
  } else {
    opacity('truck-exterior', 1);
    opacity('cab-exterior', 1);
    opacity('cab-detail-stage', 0);
    opacity('cab-interior-detail', 0);
    transform('cab-detail-stage', 'translate(83 -98) scale(1)');
  }
}

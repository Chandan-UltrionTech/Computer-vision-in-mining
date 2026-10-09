import type { SceneId } from '../core/types';
import { beatAt, storyAt } from '../core/storyBeats';
import { Belt, Camera, Rock, Worker } from '../illustrations/Primitives';
import { PLANT_X, materialFlowState } from './actors';

const feed = Array.from({ length: 25 }, (_, i) => ({
  size: .38 + (i % 5) * .085,
  variant: i % 5,
}));
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const smooth = (n: number) => n * n * (3 - 2 * n);

/** One plant line. Semantic beats change its operation, never its physical identity. */
export function MaterialFlowWorld() {
  return <g data-world-part="material-flow" transform={`translate(${PLANT_X} 0)`} fill="none" stroke="#17191c" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
    <g data-material="plant-context" stroke="#969ca3" strokeWidth="1.4">
      <path d="M477 293 641 258 828 304 969 261 1191 300 1390 255 1560 308 1800 279 1980 342" />
      <path d="M433 367 715 343 947 363 1211 340 1490 367 1850 352" />
      <path d="M938 455V270h82v185m-72-170h62m-62 33h62m-62 34h62m-62 34h62m-62 34h62" fill="#edeef0" />
      <path d="M876 445v-90h172v90m-172-75h172m-148-15v90m39-90v90m40-90v90m40-90v90M1048 403h121v-38h56v75" />
      <path d="M-90 686q338-28 628-7t658-1 818 5M0 709q368-19 609-5t814-2 536 7" />
      <path d="M873 664v-45h36v45m-32-42h29m-29 11h29m-29 11h29m263 10v-41h114v-73h31v-47" strokeWidth="5" />
      <path d="M873 664v-45h36v45m265-10v-41h114v-73h31v-47" stroke="#c4c8ce" strokeWidth="2" />
    </g>
    <g data-material="crusher">
      <path d="M298 428 365 371 423 371 480 405l-18 28-50-25-86 46Z" fill="#b9bfc6" strokeWidth="3" />
      <path d="m310 434 61-48 43 0 51 27" stroke="#707986" strokeWidth="1.5" />
      <path d="M360 346h290l-67 76H429Z" fill="#f97832" strokeWidth="4" />
      <path d="m381 365 248 0-30 34H411Z" fill="#252a2f" />
      <path d="M420 422h173v112H420Z" fill="#343a41" strokeWidth="4" />
      <path d="M403 422v185h23V422m164 0v185h23V422" fill="#c8ccd1" />
      <g data-material="jaw-left"><path d="m425 429 58 16-14 14 17 15-18 15 19 16-59 19Z" fill="#b8bec5" /></g>
      <g data-material="jaw-right"><path d="m590 429-58 16 14 14-17 15 18 15-19 16 59 19Z" fill="#b8bec5" /></g>
      <path d="m445 531 13 31h95l19-31" fill="#9ba3ac" />
      <path d="M372 350V309h276v41m-276-26h276m-259-15v41m34-41v41m34-41v41m34-41v41m34-41v41m34-41v41m34-41v41m34-41v41" strokeWidth="2" />
      <path d="M618 383h43v163m-43-147h43m-43 20h43m-43 20h43m-43 20h43m-43 20h43m-43 20h43m-43 20h43m-43 20h43" strokeWidth="1.8" />
      <circle cx="625" cy="474" r="23" fill="#f97832" /><circle cx="625" cy="474" r="9" fill="#292d32" />
      <path d="M605 539h61v28h-61Z" fill="#848b93" /><path d="M611 546h49m-49 7h49m-49 7h49" strokeWidth="1.3" />
      <text x="440" y="293" fill="#737b85" stroke="none" fontSize="11" letterSpacing="2">PRIMARY CRUSHING</text>
    </g>
    {/* The outlet, hazard inspection and sizing share this exact belt node. */}
    <g data-material="main-belt"><Belt x={488} y={564} width={917} /></g>
    <g data-material="downstream-belt" transform="translate(1450 564) rotate(-13)"><Belt width={475} /></g>
    <g data-material="gantry">
      <path d="M697 562V340h138v222m-124-1V353h110v208m-109-81 108-120m-108 1 108 119M686 339h160v-22H686Z" fill="#e0e3e6" />
      <path d="M686 317v-30h160v30m-160-15h160m-148-15v30m24-30v30m24-30v30m24-30v30m24-30v30m24-30v30m24-30v30" strokeWidth="1.8" />
      <Worker x={759} y={286} scale={.34} />
      <Camera x={871} y={424} scale={.65} />
      <path d="M855 428v133m-14-130h20" />
      <path d="M886 558v-14h21v14" fill="#f97832" />
      <circle data-material="alarm" cx="897" cy="539" r="7" fill="#9ba3ac" />
      <Worker x={964} y={622} scale={.5} />
      <g data-material="retrieval-arm"><path d="M961 583 939 570 896 549" strokeWidth="8" stroke="#30363d" /></g>
    </g>
    <g data-material="sizing-head"><path d="M1089 562V396h108m-108 14h110" strokeWidth="5" /><Camera x={1197} y={400} scale={.58} /></g>
    <g data-material="sorter-hardware">
      <path d="M1249 562V376h181v186m-167-187v-22h152v22m-152-9h152m-140-13v22m28-22v22m28-22v22m28-22v22m28-22v22m28-22v22" />
      {[1274, 1332, 1390].map(x => <g key={x}><path d={`M${x} 375v37h28v-37Z`} fill="#343a41" /><circle cx={x+14} cy="403" r="5" fill="#e3e6e9" /></g>)}
      <path d="M1404 568 1475 588 1545 679h-67l-68-79Z" fill="#aeb5bd" />
      <path d="M1422 600 1488 676m-49-63 58 60" stroke="#676f79" />
      <path d="M1470 682h91v31h-91Z" fill="#d2d6dc" />
      <path d="M1409 526h30v16h-30Z" fill="#343a41" />
      <path d="M1440 534h36v-26h19" strokeWidth="5" />
      <text x="1243" y="322" fill="#737b85" stroke="none" fontSize="11" letterSpacing="2">OPTICAL PRE-CONCENTRATION</text>
      <text x="1468" y="748" fill="#737b85" stroke="none" fontSize="14">reject stream</text>
    </g>
    <g data-material="feed">
      {feed.map((item, i) => <g key={i} data-feed-particle={i} transform={`translate(${500+i*36} 549)`}>
        <Rock size={item.size} variant={item.variant} accent={i===0} />
        <g data-material="particle-contour" className="cv-layer" data-art="cv" opacity="0" stroke="#f45b3d" strokeWidth="1.6">
          <path d="m-24 4 6-22 23-10 22 18 2 29-23 10-29-12Z" />
          {i % 3 === 0 && <g data-material="particle-span"><path d="M-22-41h44m-44-5v10m44-10v10" /><text x="-16" y="-50" stroke="none" fill="#c4472d" fontSize="10">{75+i%4*55} mm</text></g>}
        </g>
      </g>)}
    </g>
    <g data-material="crusher-hero"><Rock size={1.28} variant={2} accent /></g>
    <g data-material="tool" transform="translate(735 285)">
      <path d="m24 7-43-23q-5-15-20-13l10 12-10 12-13-8q0 22 23 20L15 30l12-3 4-12Z" fill="#aab1b9" strokeWidth="3" />
      <circle cx="22" cy="19" r="4" />
    </g>
    <g data-material="hazard-cv" className="cv-layer" data-art="cv" stroke="#f45b3d" opacity="0">
      <g data-material="hazard-box"><path d="M-57-37v-13h23m53 0h23v18m0 39v17H19m-54 0h-22V6" strokeWidth="3" /><text x="-57" y="-60" fill="#c4472d" stroke="none" fontSize="12">foreign object · tool steel</text></g>
      <path d="M869 434 777 519m92-85 25 97" strokeDasharray="5 7" strokeWidth="1.5" />
      <text data-material="belt-action-label" x="916" y="490" fill="#c4472d" stroke="none" fontSize="12">operator alert · belt held</text>
    </g>
    <g data-material="sizing-cv" className="cv-layer" data-art="cv" stroke="#f45b3d" opacity="0">
      <path d="M1187 414 998 524m189-110 73 110" strokeDasharray="5 7" strokeWidth="1.5" />
      <text x="1004" y="440" fill="#c4472d" stroke="none" fontSize="12">calibrated particle spans</text>
      <g data-material="distribution"><path d="M1090 333h120m-120 0v-75" /><path d="M1101 329v-12h13v12m5 0v-30h13v30m5 0v-49h13v49m5 0v-36h13v36m5 0v-20h13v20m5 0v-8h13v8" fill="#ffceb2" /><text x="1090" y="250" fill="#c4472d" stroke="none" fontSize="13">PSD · representative</text></g>
    </g>
    <g data-material="sorter-cv" className="cv-layer" data-art="cv" stroke="#f45b3d" opacity="0">
      {[1288,1346,1404].map(x => <path key={x} d={`M${x} 415 ${x-28} 532m28-117 28 117`} strokeDasharray="5 7" strokeWidth="1.5" />)}
      <g data-material="classification"><text x="1263" y="476" fill="#c4472d" stroke="none" fontSize="14">mineral signature</text><path d="M1395 492h65v-22" /><text x="1468" y="471" fill="#c4472d" stroke="none" fontSize="14">keep / reject</text></g>
      <g data-material="jet"><path d="m1419 542 41 27m-34-31 38 15m-44-4 30 36" strokeDasharray="4 6" /></g>
      <g data-material="separated"><path d="M1560 534h78m-78-5v10m78-10v10" /><text x="1565" y="510" fill="#c4472d" stroke="none" fontSize="14">accepted → recovery</text></g>
    </g>
    <g stroke="#929aa3" strokeWidth="1.3">{Array.from({length:23},(_,i)=><Rock key={i} x={354+i*67} y={706+i%3*7} size={.12+i%3*.05} variant={i}/>)}</g>
  </g>;
}

const flowCache = new WeakMap<SVGElement, {
  material: Map<string, SVGElement>;
  particles: SVGElement[];
  beltFlows: SVGElement[];
}>();

/** Stateless seek: forward, reverse and skipped scenes produce identical physical state. */
export function updateMaterialFlow(root: SVGElement, scene: SceneId, progress: number) {
  const world = root.querySelector<SVGGElement>('[data-world-part="material-flow"]');
  if (!world) return;

  let cached = flowCache.get(world);
  if (!cached) {
    const matMap = new Map<string, SVGElement>();
    world.querySelectorAll<SVGElement>('[data-material]').forEach(el => {
      const name = el.dataset.material;
      if (name) matMap.set(name, el);
    });
    cached = {
      material: matMap,
      particles: Array.from(world.querySelectorAll<SVGElement>('[data-feed-particle]')),
      beltFlows: Array.from(world.querySelectorAll<SVGElement>('[data-art="belt-flow"]')),
    };
    flowCache.set(world, cached);
  }

  const p = clamp(progress);
  const ids: SceneId[] = ['crusher','conveyor','sizing','sorter','slurry','froth','stockpile','survey','thermal','finale'];
  const index = ids.indexOf(scene);
  const phase = index < 0 ? 0 : Math.min(index + p, 4);

  const q = (name: string) => cached!.material.get(name);
  const attr = (name: string, key: string, value: string | number) => q(name)?.setAttribute(key, String(value));
  const opacity = (name: string, n: number) => attr(name, 'opacity', n);

  world.setAttribute('data-story-state', storyAt(scene, p));
  world.setAttribute('data-material-scene', scene);

  // Material advances, visibly freezes while the foreign object is retrieved, then resumes.
  const flowState = materialFlowState(scene, p);
  const beltStep = flowState.beltStep;
  const travel = flowState.travel;
  const split = scene === 'sorter' ? smooth(span(p, beatAt('sorter', 'airJetFires', .63), .91)) : index > 3 ? 1 : 0;

  cached.particles.forEach((particle, i) => {
    let x = 500 + ((i * 38 + travel) % 1400);
    let y = 548 - (i % 3) * 3;
    if (i === 4 && split > 0) { x = 1451 + split * 48; y = 548 + split * 127; }
    else if (x > 1450) y -= (x - 1450) * .238;
    particle.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
    const contour = particle.querySelector<SVGElement>('[data-material="particle-contour"]');
    contour?.setAttribute('opacity', scene === 'sizing' && p >= beatAt('sizing', 'particlesSegmented', .29) && x > 930 && x < 1290 ? '1' : '0');
    particle.querySelector('[data-material="particle-span"]')?.setAttribute('opacity', p >= beatAt('sizing', 'spansMeasured', .5) ? '1' : '0');
  });

  cached.beltFlows.forEach(el => el.setAttribute('stroke-dashoffset', String(-travel)));

  const crush = scene === 'crusher' ? smooth(span(p, .72, .97)) : index > 0 ? 1 : 0;
  attr('jaw-left', 'transform', `translate(${Math.sin(crush * Math.PI) * 17} 0)`);
  attr('jaw-right', 'transform', `translate(${-Math.sin(crush * Math.PI) * 17} 0)`);

  const intoGrinder = scene === 'slurry' ? smooth(span(p, 0, .45)) : index > 4 ? 1 : 0;
  const materialPhase = index === 1 ? 1 + beltStep / 220 : phase;
  const heroX = (materialPhase <= 1 ? 507 : materialPhase <= 2 ? 507 + (materialPhase - 1) * 315 : materialPhase <= 3 ? 822 + (materialPhase - 2) * 428 : 1250 + (materialPhase - 3) * 590) + intoGrinder * 60;
  const heroY = phase <= 1 ? 379 + crush * 163 : phase >= 4 ? 455 + intoGrinder * 25 : heroX > 1450 ? 548 - (heroX - 1450) * .238 : 548;
  attr('crusher-hero', 'transform', `translate(${heroX.toFixed(2)} ${heroY.toFixed(2)}) scale(${(1 - crush * .65 - intoGrinder * .29).toFixed(3)})`);
  opacity('crusher-hero', index < 0 ? 0 : scene === 'crusher' ? span(p, .64, .7) : scene === 'slurry' ? 1 - span(p, .4, .5) : index > 4 ? 0 : 1);

  // Flagship conveyor sequence:
  // Tool falls with gravity -> physical bounce on belt -> travels -> detected -> belt stops -> retrieved -> flow resumes
  const activeHazard = scene === 'conveyor';
  const fallT = span(p, .08, .26);
  const fall = fallT * fallT;
  const bounce = p > .26 && p < .36 ? Math.sin((p - .26) / .1 * Math.PI) * 12 : 0;
  const advance = span(p, .34, .7) * 143;
  const retrieve = smooth(span(p, .78, .9));

  const toolX = activeHazard ? 735 + advance + retrieve * 61 : index > 1 ? 939 : 735;
  const toolY = activeHazard ? 285 + fall * 256 - bounce - retrieve * 114 : 285;
  attr('tool', 'transform', `translate(${toolX} ${toolY}) rotate(${activeHazard ? (1 - fallT) * -28 : 0})`);
  opacity('tool', activeHazard && p < .91 ? 1 : 0);

  opacity('hazard-cv', activeHazard ? span(p, beatAt('conveyor', 'cameraWakes', .42), beatAt('conveyor', 'cameraWakes', .42) + .04) * (1 - span(p, .9, .97)) : 0);
  attr('hazard-box', 'transform', `translate(${toolX} ${toolY})`);
  opacity('hazard-box', activeHazard && p >= beatAt('conveyor', 'objectDetected', .54) && p < .91 ? 1 : 0);
  opacity('belt-action-label', activeHazard && p >= beatAt('conveyor', 'beltResponse', .7) && p < .91 ? 1 : 0);

  const beltStopped = activeHazard && p >= .7 && p < .91;
  attr('alarm', 'fill', beltStopped ? '#f45b3d' : '#9ba3ac');
  attr('retrieval-arm', 'transform', `rotate(${activeHazard ? -retrieve * 26 : 0} 961 583)`);

  const tail = 1 - span(p, .9, .98);
  opacity('sizing-cv', scene === 'sizing' ? span(p, beatAt('sizing', 'particlesSegmented', .29), beatAt('sizing', 'particlesSegmented', .29) + .04) * tail : 0);
  opacity('distribution', scene === 'sizing' ? span(p, beatAt('sizing', 'distributionComplete', .81), beatAt('sizing', 'distributionComplete', .81) + .04) : 0);
  opacity('sorter-cv', scene === 'sorter' ? span(p, beatAt('sorter', 'particleScanned', .3), beatAt('sorter', 'particleScanned', .3) + .04) * tail : 0);
  opacity('classification', scene === 'sorter' && p >= beatAt('sorter', 'classification', .48) ? 1 : 0);
  opacity('jet', scene === 'sorter' && p >= beatAt('sorter', 'airJetFires', .63) && p < .8 ? 1 : 0);
  opacity('separated', scene === 'sorter' && p >= beatAt('sorter', 'streamsSeparated', .91) ? 1 : 0);
}

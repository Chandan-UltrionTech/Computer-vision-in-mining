import type { SceneId } from '../core/types';
export type TransitionKind = 'approach' | 'coreSeam' | 'bench' | 'blastRock' | 'muckpile' | 'bucket' | 'payload' | 'truck' | 'cab' | 'cabExit' | 'crusherFall' | 'sameBelt' | 'sorterBelt' | 'acceptedRock' | 'slurry' | 'plantPullback' | 'droneLaunch' | 'inspectionFlight' | 'aerialReveal';
export interface TransitionShot {
  kind: TransitionKind;
  start: number;
  from: [number, number];
  to: [number, number];
  scale: number;
}
// Coordinates are in the 1400 x 790 illustrated world, not arbitrary screen midpoints.
export const transitionShots: Partial<Record<SceneId, TransitionShot>> = {
  arrival: {kind:'approach',start:.64,from:[1290,470],to:[800,440],scale:1.5},
  drill: {kind:'approach',start:.73,from:[925,477],to:[740,460],scale:1.25},
  core: {kind:'coreSeam',start:.78,from:[854,602],to:[688,329],scale:.8},
  grade: {kind:'bench',start:.83,from:[714,559],to:[710,545],scale:.88},
  blast: {kind:'blastRock',start:.79,from:[700,430],to:[690,595],scale:1},
  fragments: {kind:'muckpile',start:.8,from:[825,625],to:[825,644],scale:1.08},
  excavation: {kind:'muckpile',start:.82,from:[817,596],to:[817,596],scale:1},
  safety: {kind:'bucket',start:.88,from:[1100,490],to:[620,445],scale:1.8},
  bucket: {kind:'payload',start:.9,from:[768,418],to:[415,530],scale:.9},
  loading: {kind:'truck',start:.74,from:[415,621],to:[720,575],scale:1.2},
  haul: {kind:'cab',start:.67,from:[865,540],to:[1010,420],scale:2.4},
  driver: {kind:'cabExit',start:.9,from:[1010,420],to:[448,373],scale:.72},
  crusher: {kind:'crusherFall',start:.76,from:[828,650],to:[220,551],scale:1.25},
  conveyor: {kind:'sameBelt',start:.92,from:[823,422],to:[823,422],scale:1},
  sizing: {kind:'sorterBelt',start:.85,from:[1100,551],to:[180,523],scale:1},
  sorter: {kind:'acceptedRock',start:.9,from:[965,581],to:[575,414],scale:1.4},
  slurry: {kind:'slurry',start:.7,from:[978,640],to:[744,498],scale:1.25},
  froth: {kind:'plantPullback',start:.87,from:[744,498],to:[1220,534],scale:.65},
  stockpile: {kind:'droneLaunch',start:.7,from:[940,510],to:[662,280],scale:.84},
  survey: {kind:'inspectionFlight',start:.89,from:[830,195],to:[827,275],scale:.9},
  thermal: {kind:'aerialReveal',start:.8,from:[651,479],to:[1111,473],scale:.52},
};

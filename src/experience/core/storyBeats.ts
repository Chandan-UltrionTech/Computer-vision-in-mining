import type { NarrativeState, SceneId } from './types';

export interface StoryBeat { name: string; at: number; state?: NarrativeState }
// Physical consequences and capsule confirmation share this clock. Every beat is reversible.
export const storyBeats: Partial<Record<SceneId, StoryBeat[]>> = {
  core: [{name:'coreInspected',at:.2,state:'problem'},{name:'scanStarts',at:.39,state:'observing'},{name:'geologyLogged',at:.53,state:'solution'},{name:'archiveStructured',at:.78,state:'result'},{name:'seamExtends',at:.9,state:'normal'}],
  grade: [{name:'faceRevealed',at:.16,state:'problem'},{name:'spectralSweep',at:.32,state:'observing'},{name:'regionsMapped',at:.55,state:'solution'},{name:'boundaryConfirmed',at:.79,state:'result'},{name:'benchReframes',at:.93,state:'normal'}],
  fragments: [{name:'dustSettles',at:.19,state:'problem'},{name:'contoursStart',at:.34,state:'observing'},{name:'distributionBuilds',at:.58,state:'solution'},{name:'measurementComplete',at:.8,state:'result'},{name:'excavatorArrives',at:.94,state:'normal'}],
  safety: [{name:'distanceCloses',at:.25,state:'problem'},{name:'workerTracked',at:.4,state:'observing'},{name:'boundaryBreached',at:.56,state:'solution'},{name:'operatorWarned',at:.7,state:'action'},{name:'workerClear',at:.87,state:'result'},{name:'bucketApproaches',at:.96,state:'normal'}],
  bucket: [{name:'bucketEntersMaterial',at:.25,state:'problem'},{name:'toothScanStarts',at:.37,state:'observing'},{name:'healthyTeethPass',at:.43},{name:'abnormalToothFound',at:.58,state:'solution'},{name:'boulderDetected',at:.64},{name:'loadingDecision',at:.72,state:'action'},{name:'suitableMaterialLoaded',at:.94,state:'result'},{name:'followTruck',at:.99,state:'normal'}],
  driver: [{name:'attentionDrifts',at:.28,state:'problem'},{name:'landmarksTracked',at:.4,state:'observing'},{name:'fatigueRecognized',at:.52,state:'solution'},{name:'warningIssued',at:.62,state:'action'},{name:'driverRefocused',at:.78,state:'result'},{name:'exitCab',at:.99,state:'normal'}],
  conveyor: [{name:'problemRecognized',at:.32,state:'problem'},{name:'cameraWakes',at:.42,state:'observing'},{name:'objectDetected',at:.54,state:'solution'},{name:'beltResponse',at:.7,state:'action'},{name:'flowResumes',at:.91,state:'result'},{name:'populationMeasurement',at:.99,state:'normal'}],
  sizing: [{name:'materialFlowing',at:.15,state:'problem'},{name:'particlesSegmented',at:.29,state:'observing'},{name:'spansMeasured',at:.5,state:'solution'},{name:'distributionComplete',at:.81,state:'result'},{name:'sorterApproaches',at:.95,state:'normal'}],
  sorter: [{name:'particlesSpaced',at:.17,state:'problem'},{name:'particleScanned',at:.3,state:'observing'},{name:'classification',at:.48,state:'solution'},{name:'airJetFires',at:.63,state:'action'},{name:'streamsSeparated',at:.91,state:'result'},{name:'followAccepted',at:.99,state:'normal'}],
  froth: [{name:'surfaceChanges',at:.24,state:'problem'},{name:'temporalObservation',at:.4,state:'observing'},{name:'stabilitySignal',at:.67,state:'solution'},{name:'operatorSignal',at:.88,state:'result'},{name:'plantPullback',at:.97,state:'normal'}],
  survey: [{name:'droneLaunch',at:.14,state:'problem'},{name:'imageCapture',at:.28,state:'observing'},{name:'featurePoints',at:.4},{name:'pointCloud',at:.48},{name:'meshBuild',at:.63,state:'solution'},{name:'surfaceReconstruction',at:.77},{name:'measurement',at:.83},{name:'reconstructionComplete',at:.92,state:'result'},{name:'inspectionFlight',at:.99,state:'normal'}],
  thermal: [{name:'ordinaryRGB',at:.22,state:'problem'},{name:'thermalWipe',at:.4,state:'observing'},{name:'heatRevealed',at:.65,state:'solution'},{name:'targetLocalized',at:.84,state:'result'},{name:'cameraClimbs',at:.98,state:'normal'}],
};
export function storyAt(id: SceneId, progress: number): NarrativeState {
  let state: NarrativeState = 'normal';
  for (const beat of storyBeats[id] ?? []) if (progress >= beat.at && beat.state) state = beat.state;
  return state;
}
export function beatAt(id: SceneId, name: string, fallback: number) {
  return storyBeats[id]?.find(beat => beat.name === name)?.at ?? fallback;
}

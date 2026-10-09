import fs from 'node:fs/promises';
import path from 'node:path';
import { sceneRegistry } from '../src/experience/core/sceneRegistry';
import { sceneMotionDirection } from '../src/experience/core/motionDirection';
import { cameraKinematicsAt, type CameraMode } from '../src/experience/world/CameraDirector';

const outDir = path.resolve('test-results/kinematics');

function analyzeMode(mode: CameraMode) {
  const boundaries = [];
  const spikes = [];

  for (let i = 0; i < sceneRegistry.length - 1; i++) {
    const s1 = sceneRegistry[i].id;
    const s2 = sceneRegistry[i + 1].id;
    const carrier = sceneMotionDirection[s1].transitionCarrier;
    const bMotion = carrier.boundaryMotion;

    // Kinematics immediately before, at knot, and immediately after
    const kBefore = cameraKinematicsAt(s1, 0.999, mode);
    const kExit = cameraKinematicsAt(s1, 1.0, mode);
    const kEntry = cameraKinematicsAt(s2, 0.0, mode);
    const kAfter = cameraKinematicsAt(s2, 0.001, mode);

    const dot = kBefore.vx * kAfter.vx + kBefore.vy * kAfter.vy;
    const magBefore = Math.hypot(kBefore.vx, kBefore.vy);
    const magAfter = Math.hypot(kAfter.vx, kAfter.vy);
    const cosAngle = magBefore * magAfter > 0 ? dot / (magBefore * magAfter) : 1;
    const angleDeg = Math.acos(Math.min(1, Math.max(-1, cosAngle))) * (180 / Math.PI);

    const speedRatio = kBefore.speed > 0 && kAfter.speed > 0 ? kBefore.speed / kAfter.speed : 1;

    boundaries.push({
      boundary: `${s1}->${s2}`,
      carrier: carrier.carrier,
      technique: carrier.technique,
      boundaryMotion: bMotion,
      exitKnotSpeed: +kExit.speed.toFixed(2),
      entryKnotSpeed: +kEntry.speed.toFixed(2),
      speedBefore: +kBefore.speed.toFixed(2),
      speedAfter: +kAfter.speed.toFixed(2),
      speedRatio: +speedRatio.toFixed(2),
      angleDeg: +angleDeg.toFixed(2),
      accelerationBefore: +kBefore.accelerationMagnitude.toFixed(2),
      accelerationAfter: +kAfter.accelerationMagnitude.toFixed(2),
      jerkBefore: +kBefore.jerkMagnitude.toFixed(2),
      jerkAfter: +kAfter.jerkMagnitude.toFixed(2),
    });
  }

  // Scan internal scenes for acceleration and jerk spikes
  for (const s of sceneRegistry) {
    for (let step = 0; step <= 20; step++) {
      const p = step / 20;
      const k = cameraKinematicsAt(s.id, p, mode);
      spikes.push({
        scene: s.id,
        progress: p,
        speed: +k.speed.toFixed(1),
        accel: +k.accelerationMagnitude.toFixed(1),
        jerk: +k.jerkMagnitude.toFixed(1),
      });
    }
  }

  const topAccelSpikes = [...spikes].sort((a, b) => b.accel - a.accel).slice(0, 10);
  const topJerkSpikes = [...spikes].sort((a, b) => b.jerk - a.jerk).slice(0, 10);

  return {
    mode,
    boundaries,
    topAccelSpikes,
    topJerkSpikes,
  };
}

(async () => {
  await fs.mkdir(outDir, { recursive: true });
  const desktopData = analyzeMode('desktop');
  const mobileData = analyzeMode('mobile');

  await fs.writeFile(
    path.join(outDir, 'camera-desktop.json'),
    JSON.stringify(desktopData, null, 2),
  );
  await fs.writeFile(
    path.join(outDir, 'camera-mobile.json'),
    JSON.stringify(mobileData, null, 2),
  );

  console.log('Kinematics analysis saved to test-results/kinematics/');
  console.log('Desktop carry boundaries summary:');
  for (const b of desktopData.boundaries) {
    console.log(`  ${b.boundary} [${b.boundaryMotion}]: knotSpeed=${b.exitKnotSpeed}, ratio=${b.speedRatio}, angle=${b.angleDeg}°`);
  }
  console.log('\nMobile carry boundaries summary:');
  for (const b of mobileData.boundaries) {
    console.log(`  ${b.boundary} [${b.boundaryMotion}]: knotSpeed=${b.exitKnotSpeed}, ratio=${b.speedRatio}, angle=${b.angleDeg}°`);
  }
})();

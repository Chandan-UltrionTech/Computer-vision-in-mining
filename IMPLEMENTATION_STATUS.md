# Persistent cinematic world — 8 October 2026

Status of the master investor-quality remediation. This supersedes the earlier panel/crossfade completion claims.

## Architecture

- One persistent SVG world (`world/PersistentWorldStage.tsx`) replaces the 22 full-screen visual panels. Scene `<section>`s carry only captions, the detonator button and reduced-motion copy.
- `core/JourneyController.ts` maps scroll to (scene, progress), owns Lenis, panel inertness, captions and the rail. It no longer draws anything.
- `world/StageDirector.ts` owns the camera rig, parallax layers, actor updates, off-screen culling, finale signals and the projected detonator position.
- `world/CameraDirector.ts`: keyframed shots per scene, one shared pose per boundary, logarithmic zoom, follow shots derived from actor poses, cab roll compensation, decaying blast shake.
- `world/actors.ts`: shared, pure poses for truck, excavator, bucket lip, drone and detonator. The camera and the artwork read the same functions.
- Parallax depths: far ridge 0.22, mid pit and plant silhouettes 0.55, operation 1, foreground 1.32.
- Retired: `transitions/PhysicalHandoff.tsx`, `transitions/choreography.ts`, `recoveryFocus`.

## Continuity (QA matrix, forward and reverse at 1440×900)

| Boundary | Anchor | Result |
|---|---|---|
| arrival → drill → core | drill rig, core rises out of the cut-away seam and is laid in the tray | continuous |
| core → grade → blast | orange seam line; drill trams clear before charging | continuous |
| blast → fragments → excavation | same bench collapses to the muckpile behind the dust curtain; excavator tracks in | continuous |
| safety → bucket → loading | one excavator; camera follows the bucket lip; boulder drops beside the truck | continuous |
| haul → driver → crusher | camera dollies through the cab window and back out | continuous |
| crusher → conveyor | truck turns, reverses, tips, lowers its bed and drives away down the ramp | continuous |
| conveyor → sizing → sorter → slurry | one belt, one plant line | continuous |
| froth → stockpile → survey → thermal → finale | one climb; the finale retraces the route and reactivates markers 01–12 in place | continuous |

CV overlays fade in and out with the scene clock instead of switching off at the boundary. Contact sheets: `node scripts/contact-sheet.mjs 1440 900 all .15,.55,.92` (add `REVERSE=1` to step backwards).

## Responsive

- Phones (390×844, 430×932): subject centred and lifted; the CV capsule docks at the bottom; landmark numbers stay visible in the finale; the finale pulls back further so the whole route fits.
- The detonator button is projected onto the world position of the charge line and clamped on screen.

## Verification

- `npm run lint`: clean. `npm test`: 6/6, including a new "no cut inside any scene" camera continuity test. `npm run test:browser`: 8/8. `npm run build`: passes.
- Frame pacing (`node scripts/perf.mjs`, headless Chromium with software rendering): median 16.7 ms overall. The 95th percentile is 33 ms. The cab dolly is the heaviest segment.

## Known limitations

- Pacing figures come from software rasterisation; GPU browsers should do better, but this has not been measured on target hardware.
- On narrow phones the charge line itself is off screen during the blast; the plunger button is clamped to the left edge.
- The subtitle can sit close to the truck at the start of the crusher scene; a text halo keeps it readable.

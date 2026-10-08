# Computer Vision in Mining

A custom illustrated, scroll-driven journey through one mining operation. The physical process carries the story; twelve computer vision capabilities appear at the moments where they matter.

## Run

Requires Node.js 20.9 or later. This project was verified with Node 24 and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For production, run `npm run build`, then `npm start`.

```sh
npm run lint
npm test
npx playwright install chromium
# Run the app in another terminal, then:
npm run test:browser
```

## Structure

- `src/experience/core/sceneRegistry.ts`: canonical physical sequence, pacing, capability copy and capsule anchors.
- `src/experience/core/storyBeats.ts`: scene-specific semantic event clocks, including action states and delayed result confirmation.
- `src/experience/transitions/choreography.ts`: per-boundary shot duration, subject coordinates, camera scale and physical prop selection.
- `src/experience/core/JourneyController.ts`: scroll coordinates, active local timelines, responsive rebuilds, physical handoffs and discrete semantic updates.
- `src/experience/scenes/`: separate Part I, II and III compositions; normalized choreography and visible-scene idle motion.
- `src/experience/illustrations/`: independently animatable SVG machines, geology and whole-mine composition.
- `src/experience/hud/`: one CV capsule, accessible switch and process route.
- `src/components/Deployment.tsx`: post-story transcript, practical starting workflows, production pipeline and downloadable local pilot brief.
- `tests/`: narrative-order tests and full browser journeys.
- `IMPLEMENTATION_STATUS.md`: current checkpoint and verification evidence.

## Design and runtime

The stage remains sticky while the document scrolls normally. Scene artwork is modular; no SVG contains the entire experience. Each scene has a local GSAP timeline. Handoffs overlap incoming and outgoing local timelines. Explicit shot definitions set different durations and physical source/target coordinates. Cab and slurry entry use aperture masks, crusher discharge reveals the belt from below, a blast rock occludes the viewport, and the shared conveyor camera remains fixed. Screen matrices project travelling props through responsive framing and camera transforms. SVG is sufficient for the finite effects; there is no Canvas or WebGL renderer.

Lenis runs through GSAP's ticker and forwards scrolling to ScrollTrigger, following the [Lenis integration documentation](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger). GSAP contexts and [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/) collect animations for cleanup and responsive rebuilding. Continuous visual properties never use React state; Zustand stores scene identity, narrative state, integer journey progress and preferences.

Mobile uses shorter scroll distances, subject-focused framing, vertical camera movement, fewer background details and a compact readable annotation strip. Reduced motion renders normal-flow illustrated scenes and complete explanations with no smooth-scroll or scrubbed camera travel. The CV switch and detonator remain usable. A post-story text transcript also provides all capability explanations.

The detonator supports click, keyboard Enter/Space and touch. It advances the scroll clock rather than running an independent animation on the blast artwork. Wheel/touch input interrupts that advance; replay seeks back along the same reversible timeline. Scrolling also triggers the blast, so it cannot trap visitors. The belt hazard sequence stops the physical belt, signals the operator, removes the tool and resumes flow. A pilot brief can be generated and downloaded locally; nothing is submitted to a server.

## Source and production boundaries

`context/` and `scenes/` are preserved source authorities. All site machinery and scene art is original inline SVG; the supplied infographics are not displayed as page sections.

This is an illustrative experience, not a mining control system. Reconstruction, sensor zones and distributions are clearly conceptual; there is no live telemetry, calibrated imagery, production CV model or PLC integration. A deployment would require site-reviewed data, cameras, calibration, thresholds, validation and approved control interfaces. No additional artwork files are required to run the experience.

`npm audit` currently reports an upstream, development-only `braces` advisory through Next's ESLint dependency chain, with no fixed braces release available. The production dependency audit is clean. Avoid applying an automatic major downgrade of Next ESLint to address that report.

## Second cinematic pass (8 October 2026)

Physical mining orange (#f97832) and CV coral (#ff4d43) have distinct roles. Machinery uses heavy silhouette strokes, construction detail and neutral windows; PPE has a more expressive human silhouette. Five irregular rock families, bench geometry, plant structures, gantries, pipes and small workers enrich the operation. Later narration is smaller than the opening headline and respects top/bottom HUD safe areas.

The capsule begins as a 38px eye marker. Width, height and radius morph while its numbered source identity stays visible and contextual copy transitions separately. Original use-case numbers remain independent of journey order: safety 06, bucket 04 and driver 05. Physical consequences complete before result confirmation.

`node scripts/visual-review.mjs` captures desktop/tablet/mobile scene frames and reports application console errors. `node scripts/transition-review.mjs` captures handoff frames and measures a bounded survey scroll sample. Verification evidence and device limitations are in `IMPLEMENTATION_STATUS.md`.

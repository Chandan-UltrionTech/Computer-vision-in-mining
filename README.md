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
- `src/experience/core/JourneyController.ts`: scroll coordinates, active local timelines, responsive rebuilds, physical handoffs and discrete semantic updates.
- `src/experience/scenes/`: separate Part I, II and III compositions; normalized choreography and visible-scene idle motion.
- `src/experience/illustrations/`: independently animatable SVG machines, geology and whole-mine composition.
- `src/experience/hud/`: one CV capsule, accessible switch and process route.
- `src/components/Deployment.tsx`: post-story transcript, practical starting workflows, production pipeline and downloadable local pilot brief.
- `tests/`: narrative-order tests and full browser journeys.
- `IMPLEMENTATION_STATUS.md`: current checkpoint and verification evidence.

## Design and runtime

The stage remains sticky while the document scrolls normally. Scene artwork is modular; no SVG contains the entire experience. Each scene has a local GSAP timeline. Handoffs use geology seams, rock occlusion, the haul road, belt, water and drone ascent. SVG is sufficient for the finite effects; there is no Canvas or WebGL renderer.

Lenis runs through GSAP's ticker and forwards scrolling to ScrollTrigger, following the [Lenis integration documentation](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger). GSAP contexts and [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/) collect animations for cleanup and responsive rebuilding. Continuous visual properties never use React state; Zustand stores scene identity, narrative state, integer journey progress and preferences.

Mobile uses shorter scroll distances, different framing and vertical handoffs. Reduced motion renders normal-flow illustrated scenes and complete explanations with no smooth-scroll or scrubbed camera travel. The CV switch and detonator remain usable. A post-story text transcript also provides all capability explanations.

The detonator supports click, keyboard Enter/Space and touch. Scrolling also triggers the blast, so it cannot trap visitors. The belt hazard sequence stops the physical belt, signals the operator, removes the tool and resumes flow. A pilot brief can be generated and downloaded locally; nothing is submitted to a server.

## Source and production boundaries

`context/` and `scenes/` are preserved source authorities. All site machinery and scene art is original inline SVG; the supplied infographics are not displayed as page sections.

This is an illustrative experience, not a mining control system. Reconstruction, sensor zones and distributions are clearly conceptual; there is no live telemetry, calibrated imagery, production CV model or PLC integration. A deployment would require site-reviewed data, cameras, calibration, thresholds, validation and approved control interfaces. No additional artwork files are required to run the experience.

`npm audit` currently reports an upstream, development-only `braces` advisory through Next's ESLint dependency chain, with no fixed braces release available. The production dependency audit is clean. Avoid applying an automatic major downgrade of Next ESLint to address that report.

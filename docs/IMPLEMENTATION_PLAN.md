# Mining journey implementation plan

Goal: Follow material through one illustrated mine, exposing CV as contextual intelligence.

Architecture: A sticky viewport contains individually composed SVG scenes. Each scene owns a normalized local timeline. A JourneyController maps scroll to those timelines, moving outgoing/incoming worlds with physical transition carriers. Discrete semantic events update Zustand and one HUD. Native document headings and reduced-motion scenes preserve the narrative without animation.

Stack: Next App Router, TypeScript, GSAP / useGSAP / ScrollTrigger, Lenis, Zustand, CSS Modules.

1. Create application/configuration in root; preserve context/ and scenes/. Install dependencies with npm.
2. Define scene contracts and centrally ordered registry with local durations and capability problem/observation/solution/result copy. Test semantic beat boundaries and ordering.
3. Integrate one GSAP ticker with Lenis and one controller; ensure teardown, media-query rebuilds and asset refresh.
4. Create structured SVG primitives: rocks, terraces, drill, tray, worker, excavator arm/bucket/teeth, truck bed/wheels, belt, camera, tank, drone and mine map.
5. Compose geological scenes; drill cutaway and core transfer; extend seam; wire blast; animate debris and close rock; trace fragmentation contours and contextual distribution.
6. Compose excavation through conveying. Worker approaches/retreats, actual bucket inspection, truck loading/road/cab, tipping/crushing. Tool falls from maintenance gantry, bounces/travels, approaches camera, is detected, belt stops, operator removes tool, belt resumes. Particle contours replace anomaly box.
7. Compose sorting through inspection. Two streams physically split; accepted particle becomes slurry, then froth. Pull back to stockpile. Drone ascends; feature points become cloud and mesh. Scroll reveals thermal anomalies. Pull back to connected whole-mine view.
8. Implement one persistent capsule, CV switch, process route, keyboard/touch detonator and working local pilot planner after story.
9. Mobile changes framing, shorter scroll distances and vertical handoffs; reduced motion uses static illustrations plus full semantic explanations and retains controls.
10. Run browser full-journey checks at 1440x900, 1024x768, 768x1024, 390x844 and 320px. Test CV toggle, detonator, backscroll, resize and reduced motion. Inspect screenshots. Run npm run lint, npm test and npm run build.

Completion evidence and remaining limitations are recorded in IMPLEMENTATION_STATUS.md.

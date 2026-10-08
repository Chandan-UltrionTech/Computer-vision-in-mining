# 1. REPOSITORY CONTEXT

The project directory is:

`CV In Mining/`

It currently contains two important directories:

```text
CV In Mining/
│
├── context/
│   └── six mining/CV infographic reference images
│
└── scenes/
    ├── PART1.md
    ├── PART2.md
    └── PART3.md

Before writing implementation code:
1. Inspect every image inside context/.
2. Read all of scenes/PART1.md.
3. Read all of scenes/PART2.md.
4. Read all of scenes/PART3.md.
5. Understand the full story before deciding architecture or animation timing.
Do not skim only the first scene or first reference image.
2. SOURCE-OF-TRUTH RULES
There are two different authorities in this repository.
context/ = VISUAL AUTHORITY
The six images define the visual inspiration.
Derive the website's design language from them:
- doodle-style mining illustration
- warm/off-white canvas
- near-black hand-drawn linework
- grey secondary illustration/details
- orange/coral/red mining accent
- heavy, confident typography
- hand-drawn arrows
- technical annotations
- camera/sensor rays
- segmentation outlines
- measurement marks
- wireframes
- mining machinery
- rocks, workers, conveyors, drones, processing equipment
- soft rounded surfaces where appropriate
- playful technical/engineering personality
- clean professional composition despite the doodle aesthetic
The references are inspiration, not page layouts.
DO NOT turn the six reference images into six sections.
DO NOT simply put the provided infographics on screen.
DO NOT reproduce their card layouts mechanically.
The final website should look like the visual world of those references has expanded into a living, animated mining environment.
scenes/ = NARRATIVE AUTHORITY
PART1.md, PART2.md, and PART3.md define the cinematic journey.
The mining process is the story.
The Computer Vision use cases are events/capabilities that appear naturally inside that story.
Do not restructure the website into:
Use Case 1
Use Case 2
Use Case 3
...
Use Case 12

The visitor should feel that they are travelling through one mine and following material through the mining lifecycle.
If there is a conflict between an implementation shortcut and the scene narrative, preserve the narrative.
3. CORE EXPERIENCE PRINCIPLE
The experience should communicate:
"Experience the mining process and discover where Computer Vision operates."

NOT:
"Scroll through 12 Computer Vision use-case cards."

The mine is the backbone.
The CV capabilities are contextual intelligence events inside the mine.
The perceived journey should approximately follow:
Geology
→ Drilling
→ Core Analysis
→ Grade Mapping
→ Blast Preparation
→ Blasting
→ Fragmentation
→ Excavation
→ Safety / Proximity
→ Loading
→ Haulage
→ Driver Monitoring
→ Crushing
→ Conveying
→ Foreign-Object Detection
→ Particle-Size Monitoring
→ Ore Sorting
→ Processing
→ Flotation
→ Recovery
→ Stockpile
→ Drone Survey / 3D Reconstruction
→ Thermal + Visual Inspection
→ Whole-Mine Reveal

Use PART1.md, PART2.md, and PART3.md for the detailed choreography.
4. CANONICAL CV CAPABILITY ORDER
The original infographic numbering is NOT the website order.
Use the mining process to determine placement.
The canonical narrative ordering is:
1. Drill-core analysis
2. Ore/waste & grade mapping
3. Blast fragmentation analysis
4. PPE, exclusion zones & proximity
5. Shovel bucket / tooth / boulder monitoring
6. Driver fatigue & distraction
7. Conveyor foreign-object & oversize detection
8. Online particle-size monitoring
9. Optical / laser ore sorting
10. Flotation froth monitoring
11. Drone 3D survey / stockpile / stope inspection
12. Thermal + visual field inspection

Do not expose these as "1–12 cards".
They should emerge from the physical process.
Some capabilities may overlap within the same physical scene.
That is desirable.
5. LOCKED TECHNICAL STACK
Use this stack unless the repository already contains something clearly equivalent that should be preserved.
Framework
- Next.js
- App Router
- TypeScript
Animation authority
- GSAP
- @gsap/react
- GSAP ScrollTrigger
GSAP is the main animation engine.
Do not introduce a second competing animation framework.
Smooth scrolling
- Lenis
Semantic experience state
- Zustand
Keep this state small.
GSAP owns continuous animation.
Zustand owns semantic/discrete experience state.
Graphics
Primary:
- inline SVG / SVG React components
Secondary:
- HTML/CSS
Selective dense effects only:
- Canvas 2D
Use Canvas only where SVG DOM density would be unreasonable, such as:
- blast particles/debris
- large dust particle fields
- dense flotation bubbles
- point-cloud reconstruction
- large numbers of tiny animated particles
Do NOT make Canvas the whole site.
Styling
Use:
- CSS Modules for cinematic scene internals
- Tailwind CSS for conventional site/UI layout where useful
Do not force every animation-specific selector into Tailwind utility strings.
Do NOT add by default
Avoid unless there is a proven, documented need:
- Three.js
- React Three Fiber
- WebGL as the primary renderer
- Framer Motion / Motion
- Lottie
- Rive
- Locomotive Scroll
- another smooth-scroll library
- another animation framework
The project is intentionally a 2D / 2.5D illustrated experience.
SVG + GSAP should remain the foundation.
6. INITIAL PROJECT SETUP
First inspect the repository.
If a Next.js application already exists, work with it rather than recreating it.
If the root currently contains only the provided context/ and scenes/ material and no frontend application exists:
Create the Next.js application in the project root while preserving:
context/
scenes/

Do not delete, move, rename, or overwrite those source directories.
Use a clean src/ structure.
Choose the existing package manager if a lockfile exists.
If no package manager is established, use a sensible default.
The project must ultimately support normal commands equivalent to:
npm run dev
npm run lint
npm run build

or the equivalent commands for the chosen package manager.
7. ARCHITECTURE
Do NOT wire ScrollTrigger callbacks directly to hundreds of random DOM elements.
Create a proper experience architecture.
The conceptual runtime flow must be:
USER INPUT
    ↓
LENIS
    ↓
SCROLLTRIGGER
    ↓
JOURNEY CONTROLLER
    ↓
GSAP SCENE TIMELINES
    ↓
SVG / CSS / SELECTIVE CANVAS
    ↓
CONTINUOUS MINING JOURNEY

And semantic experience state should sit alongside the timelines:
                    JOURNEY CONTROLLER
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
       GSAP TIMELINES               ZUSTAND STATE
             │                           │
     visual animation             semantic state
             │                           │
             ▼                           ▼
Camera / Objects / CV      Capsule / Current Scene /
                           CV Toggle / Progress / etc.

8. JOURNEY CONTROLLER
Create an explicit Journey Controller / scene orchestration system.
Its responsibility is to understand:
- current part
- current scene
- scene progress
- transition progress
- active CV capability
- whether the current narrative state is:
  - normal
  - problem
  - observing
  - solution
  - result
- current journey position
- whether the CV layer is enabled
- responsive choreography mode
- reduced-motion mode
Do not use React state as an animation frame loop.
DO NOT call React/Zustand setters continuously on every scroll frame unless absolutely necessary.
GSAP should directly animate visual properties.
Zustand should update only when semantic states meaningfully change.
9. SCENE ARCHITECTURE
The visitor should perceive one enormous continuous world.
The browser should NOT render one enormous monolithic SVG.
Instead, implement modular scenes and explicit transitions.
Conceptually:
Scene
↓
Transition
↓
Scene
↓
Transition
↓
Scene

For example:
BlastScene
↓
FlyingRockTransition
↓
FragmentationScene

HaulageScene
↓
TruckArrivalTransition
↓
CrusherScene

FlotationScene
↓
PlantPullbackTransition
↓
StockpileScene

Transitions are first-class pieces of the experience.
Do not simply fade one scene out and another scene in unless that is genuinely the best transition.
Prefer physical handoffs:
- truck exits one scene and enters another
- conveyor continues across scenes
- rock fills the viewport and becomes the next scene
- geological line extends into a mine-face boundary
- drone movement becomes camera movement
- material falls into another process
- plant pullback reveals stockpile
- camera climbs into survey view
10. RECOMMENDED CODE ORGANIZATION
Adapt naming if necessary, but keep a similarly disciplined structure.
Example:
src/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── experience/
│   ├── MiningJourney.tsx
│   │
│   ├── core/
│   │   ├── JourneyController.ts
│   │   ├── sceneRegistry.ts
│   │   ├── gsap.ts
│   │   ├── lenis.ts
│   │   └── types.ts
│   │
│   ├── store/
│   │   └── experienceStore.ts
│   │
│   ├── hud/
│   │   ├── CVCapsule.tsx
│   │   ├── CVToggle.tsx
│   │   ├── JourneyTrack.tsx
│   │   └── ExperienceHUD.tsx
│   │
│   ├── scenes/
│   │   ├── part-1/
│   │   ├── part-2/
│   │   └── part-3/
│   │
│   ├── transitions/
│   │
│   ├── illustrations/
│   │   ├── machinery/
│   │   ├── geology/
│   │   ├── processing/
│   │   ├── people/
│   │   └── cv/
│   │
│   ├── canvas/
│   │
│   └── styles/
│
└── components/

Do not put the entire experience in page.tsx.
Do not create one 5,000-line component.
Do not create one giant GSAP timeline containing the entire website.
Each major scene should own a local timeline and expose a predictable scene contract.
11. SCENE REGISTRY
Create a typed scene registry.
Each scene should have metadata such as:
{
  id,
  part,
  title,
  capability,
  scrollLength,
  pin,
  cvEvent,
  desktopTimeline,
  mobileTimeline
}

You may adapt the exact interface.
The important point is that scene ordering and duration should be understandable from one central system.
Avoid scattering anonymous start: "top top" and end: "+=4200" values randomly throughout the repository.
Use semantic constants/configuration where practical.
12. SCROLL SYSTEM
Lenis smooths input.
ScrollTrigger understands scroll progress.
GSAP animates the visual world.
Keep these responsibilities separate.
Use a robust Lenis + ScrollTrigger integration.
For example, architecturally:
physical wheel/touch
↓
Lenis
↓
smooth scroll position
↓
ScrollTrigger update
↓
GSAP timeline progress

Use the recommended Lenis/GSAP integration pattern for the installed versions.
Avoid running multiple competing RAF loops.
Ensure cleanup works correctly.
Ensure ScrollTrigger refreshes correctly after fonts/assets/layout settle.
13. GSAP IMPLEMENTATION RULES
Use @gsap/react / useGSAP appropriately.
Use timeline-based animation rather than hundreds of disconnected tweens.
Each major scene should have a readable cinematic timeline.
Example conceptually:
Conveyor scene

0.00 enter scene
0.12 material flowing
0.25 foreign object falls
0.32 problem state
0.43 object approaches camera
0.50 camera activates
0.56 detection draws
0.64 capsule expands
0.75 operational response
0.87 result
1.00 transition toward sizing

Do not mechanically use those exact values.
Derive choreography from the scene documents.
Use transforms/opacity whenever possible.
Avoid layout-triggering animation unless necessary.
Clean up GSAP contexts and ScrollTriggers on unmount.
14. WORLD / CAMERA MODEL
Although this is not a true 3D engine, structure scenes like cinematic worlds.
A scene may conceptually contain:
World
├── far background
├── background
├── environment
├── material
├── machinery
├── people
├── foreground
├── CV overlays
└── technical annotations

Create camera-like movement with:
- translation
- scaling
- parallax
- layer speed differences
- masks
- clip paths
- scene framing
Example:
far background     slow translation
mine structures    medium translation
foreground rock    faster translation

The result should feel like a 2.5D camera move.
Do not add Three.js merely because the word "camera" is used.
15. SVG ILLUSTRATION SYSTEM
SVG should be the primary illustration technology.
Create mining illustrations as structured components rather than single flattened images.
For example an excavator should conceptually contain independently animatable groups such as:
tracks
body
cab
boom
arm
bucket
teeth
camera
warning light

A truck may contain:
body
cab
wheels
truck bed
payload
warning beacon
driver
dust

This allows GSAP to animate actual machinery.
Keep SVG paths reasonably optimized.
Avoid thousands of DOM paths for effects better handled by Canvas.
Do not create one enormous SVG containing the complete mine.
16. CREATE THE DOODLE ARTWORK
Do not expect ready-made mining SVG assets.
Create the required visual assets yourself using SVG/CSS based on the style observed in context/.
The illustrations should deliberately feel:
- hand drawn
- slightly imperfect
- technical
- clean
- expressive
- mining-specific
Avoid generic icon-library visuals for major scene artwork.
Icon libraries may be used for tiny utility UI where appropriate, but the mine itself should feel custom.
Do not fall back to stock-photo design.
Do not create a futuristic cyberpunk/blue AI aesthetic.
This website must feel:
mining first, intelligence layered onto mining second.
17. VISUAL LANGUAGE
Inspect the references and derive actual design tokens.
Create CSS variables/design tokens for:
- canvas background
- ink
- secondary ink
- orange/coral mining accent
- warning accent
- muted surfaces
- borders
- shadows
- typography
- annotation scale
- stroke widths
- spacing
- radii
The final website should broadly preserve this relationship:
physical mine
= black / grey / warm-white doodle world

computer vision intelligence
= orange / coral / highlighted technical overlays

This is important.
Orange should communicate intelligence/observation/decision rather than merely being decorative everywhere.
18. TYPOGRAPHY
Use typography with a strong industrial/editorial personality compatible with the references.
The site should have:
- very large cinematic headings when appropriate
- heavy display typography
- restrained supporting text
- compact technical annotations
- clear hierarchy
Do not make every scene text-heavy.
The animation should explain most of the story.
Use copy to clarify:
- the physical problem
- the CV capability
- the operational result
19. THE PERSISTENT CV CAPSULE
Create exactly one persistent CV intelligence component.
Do not create unrelated popups in every scene.
This should behave like a smooth, Dynamic-Island-inspired cinematic capsule.
Call the component something equivalent to:
CVCapsule
It should support states similar to:
DORMANT
↓
PROBLEM
↓
OBSERVING
↓
SOLUTION
↓
RESULT
↓
DORMANT

The visual storytelling rule throughout the journey is:
PHYSICAL EVENT
↓
PROBLEM BECOMES UNDERSTANDABLE
↓
CV OBSERVES
↓
CV CAPABILITY IS EXPLAINED
↓
OPERATIONAL RESULT
↓
JOURNEY CONTINUES

This pattern should appear across the whole website.
Example:
foreign object falls on conveyor
↓
visitor sees the hazard
↓
capsule: "Foreign object on material stream"
↓
camera activates
↓
CV bounding box appears
↓
capsule expands:
"Conveyor foreign-object & oversize detection"
↓
operator/belt response
↓
capsule:
"Hazard identified before downstream equipment"
↓
capsule collapses

Do not show the solution before establishing the physical problem.
20. CAPSULE POSITIONING
The CV capsule should feel persistent but should not constantly cover the visual subject.
Implement responsive/safe positioning.
It may use different anchors depending on the scene.
For example:
excavator on right
→ capsule can expand left

driver face on right
→ capsule can expand left/top

conveyor across bottom
→ capsule can remain top-center

Preserve a consistent animation language even if position changes.
The movement must feel intentional and smooth.
Avoid annoying large jumps.
21. CV OVERLAY GRAMMAR
Different CV capabilities should NOT all use the same bounding-box visual.
Create a consistent but expressive visual grammar.
Examples:
Drill-core analysis
- fracture marks
- vein outlines
- geological boundaries
Grade mapping
- hand-drawn semantic regions
- scan sweep
- grade/ore/waste boundaries
Blast fragmentation
- rock contours
- size measurements
- P20/P50/P80 style annotations
PPE/proximity
- person/machine outlines
- exclusion-zone boundary
- distance line
- PPE status
Shovel monitoring
- bucket-tooth status
- oversized boulder outline
Driver monitoring
- minimal face landmarks
- head pose
- blink/attention indicators
Conveyor hazard
- anomaly bounding box
- foreign-object label
- distance to downstream equipment
Particle sizing
- segmentation contours
- dimensions
- distribution visualization
Ore sorting
- scan line
- classify
- keep/reject decision
Flotation
- bubble motion trails
- cluster/texture analysis
- stability indicators
Drone survey
- feature points
- point cloud
- mesh
- dimensions/volume
Thermal inspection
- thermal wipe
- abnormal heat region
- inspection target
Do not overwhelm the scene with every possible overlay.
Reveal information progressively.
22. PART I IMPLEMENTATION
Use scenes/PART1.md as the detailed authority.
Part I is approximately:
Reading the Rock & Breaking the Bench
The emotional progression is:
unknown geology
→ understand the rock
→ determine where value exists
→ prepare blast
→ detonate
→ measure fragmentation

Important sequence:
mine introduction
↓
drilling
↓
core extraction
↓
drill-core analysis
↓
mine-face / grade understanding
↓
ore/waste & grade mapping
↓
blast preparation
↓
detonator interaction
↓
blast
↓
flying-rock transition
↓
muckpile
↓
blast fragmentation analysis
↓
excavator enters

Implement the TNT/detonator interaction.
It should feel tactile.
Desktop may use pointer/drag/click behavior.
Mobile must have a reliable touch-friendly equivalent.
Do not make the interaction mandatory in a way that traps the user.
Scrolling should still be able to progress the story appropriately.
23. PART II IMPLEMENTATION
Use scenes/PART2.md as the detailed authority.
Part II is:
Moving the Mountain
This is the most kinetic section.
The continuity should feel approximately like:
muckpile
↓
excavator enters
↓
worker approaches active equipment
↓
PPE/proximity CV event
↓
bucket digs
↓
bucket/tooth/boulder monitoring
↓
rock enters bucket
↓
truck gets loaded
↓
follow material into truck
↓
haul road
↓
camera enters cab
↓
driver fatigue/distraction event
↓
camera exits cab
↓
truck reaches plant
↓
truck dumps material
↓
follow material into crusher
↓
material becomes smaller
↓
material drops onto conveyor
↓
foreign object physically falls onto conveyor
↓
danger becomes visible
↓
CV detects it
↓
operational response
↓
conveyor resumes
↓
particle-size monitoring
↓
material approaches ore sorter

The conveyor sequence is especially important.
Do not simply spawn a foreign object already boxed.
The foreign object must:
1. physically enter/fall onto the belt,
2. move with the material,
3. become a visible problem,
4. approach the sensor/camera,
5. be detected,
6. trigger the CV capsule,
7. lead to an operational response,
8. then allow the process to continue.
Make this sequence memorable.
24. PART III IMPLEMENTATION
Use scenes/PART3.md as the detailed authority.
Part III is:
Turning Ore into Value & Seeing the Whole Mine
The scale should evolve:
individual rock
→ particle
→ process
→ plant
→ stockpile
→ landscape
→ whole mine

Approximate continuity:
material reaches sorter
↓
optical/laser scanning
↓
keep/reject classification
↓
physical separation
↓
follow accepted material
↓
material becomes finer
↓
enter flotation
↓
froth scene
↓
froth CV analysis
↓
recovery
↓
camera leaves plant
↓
stockpile
↓
drone takes off
↓
camera rises with drone
↓
image capture
↓
feature points
↓
point cloud
↓
wireframe/mesh
↓
survey measurements
↓
drone continues
↓
visual inspection
↓
thermal wipe
↓
thermal anomaly
↓
inspection result
↓
drone/camera climbs
↓
whole-mine reveal

The final camera pullback must feel like the payoff for everything before it.
25. WHOLE-MINE FINALE
The final mine reveal should visually show that the earlier capabilities were not isolated demos.
As the full mine becomes visible, gradually reintroduce intelligence signals throughout the landscape.
For example:
- drilling/core
- mine face
- blast area
- excavation
- safety zone
- truck
- conveyor
- sorter
- flotation
- stockpile
- drone
- thermal target
Small orange intelligence signals should illuminate across the mine.
Do not make it look like a conventional network diagram.
It should still be the illustrated mine.
The message should communicate that:
Computer Vision becomes an intelligence layer across the operation.

Use the final narrative from PART3.md.
26. CV ON / OFF EXPERIENCE
Implement a persistent CV layer toggle.
This is NOT a theme switch.
When CV is ON:
- CV rays
- detection overlays
- measurements
- segmentation
- intelligence annotations
- wireframes
- alerts
- classifications
can appear according to the current scene.
When CV is OFF:
the physical mining operation remains visible, but the intelligence layer disappears.
The final whole-mine scene should make this particularly powerful:
CV OFF
→ operating mine without visible intelligence overlays

CV ON
→ intelligence appears across the operation

Use accessible control semantics.
Do not use color alone to communicate toggle state.
27. JOURNEY TRACK
Create a subtle persistent journey indicator.
It should not look like generic SaaS tabs.
It may resemble:
- a hand-drawn route
- conveyor
- mine rail
- geological journey line
Approximate stages might include:
Drill
Blast
Dig
Haul
Crush
Convey
Sort
Recover
Survey
Inspect

Keep it visually subtle.
It should help orientation without becoming the main UI.
Allow stage navigation only if doing so does not destabilize the cinematic timelines.
If direct jumping creates animation/state problems, prioritize robust storytelling first and use the track initially as a progress indicator.
28. CANVAS EFFECTS
Use Canvas selectively.
If Canvas is used:
- cap DPR where sensible
- reduce particle counts on mobile
- pause expensive loops when not visible
- avoid continuous work for scenes far outside the viewport
- keep semantic/important objects in SVG/HTML
- use Canvas for visual density, not interface semantics
Likely Canvas candidates:
- blast debris
- dust
- dense flotation bubbles
- survey point cloud
- subtle particle effects
Do not use Canvas where a small clean SVG works better.
29. RESPONSIVE DESIGN
Do NOT simply shrink the desktop cinematic canvas onto mobile.
Create distinct choreography where needed.
Use gsap.matchMedia() or an equivalent disciplined approach.
Desktop
Can use:
- wide compositions
- horizontal camera travel
- large parallax
- longer pinned sequences
- larger side-by-side layouts
Mobile
Prefer:
- more vertical progression
- tighter camera crops
- shorter pin distances
- fewer simultaneous labels
- simplified particle counts
- larger touch targets
- capsule using more viewport width
- no hover-only interactions
The same narrative should survive.
Do not create a radically different content hierarchy.
Test at minimum conceptually equivalent viewports around:
1440 × 900
1024 × 768
768 × 1024
390 × 844

Also ensure small widths around 320px do not catastrophically break.
30. REDUCED MOTION
Support prefers-reduced-motion.
Do not simply disable GSAP and leave a broken blank page.
Create a graceful reduced-motion presentation.
It may use:
- static illustrated scenes
- smaller fades
- minimal translations
- progressive content reveals
- no huge parallax
- no aggressive camera travel
- no forced scrub-heavy motion
All important content must remain understandable.
31. ACCESSIBILITY
The cinematic design must still be usable.
Ensure:
- meaningful controls are keyboard accessible
- buttons have clear labels
- CV toggle is accessible
- detonator has an accessible interaction
- focus states are visible
- text has sufficient contrast
- important information is not color-only
- decorative SVGs are hidden appropriately
- meaningful SVGs have suitable accessibility treatment
- semantic headings exist
- reduced motion works
- keyboard users are not trapped by pinned sections
- normal page scrolling remains functional
Provide semantic textual content for the major capabilities even though the presentation is highly visual.
32. PERFORMANCE
Performance is a core feature.
This site will contain many moving objects.
Optimize deliberately.
Prefer animation of:
- transforms
- opacity
Use will-change selectively rather than everywhere.
Avoid:
- expensive giant SVG filters
- huge blur animations
- thousands of live SVG nodes
- React rerenders tied to scroll frames
- unnecessary resize work
- unnecessary observers per tiny element
- hidden animations continuing forever
- giant raster images where SVG is appropriate
Pause/deactivate scene-specific expensive logic when far outside the active region.
Reduce decorative complexity on mobile where necessary.
The doodle aesthetic should help performance rather than harm it.
33. ASSET LOADING
Do not force the entire experience's expensive assets/effects to initialize immediately.
Prioritize:
- current scene
- previous scene
- next scene(s)
Initialize expensive Canvas or scene-specific effects near their usage.
Preserve predictable layout dimensions so loading does not cause major ScrollTrigger jumps.
Refresh ScrollTrigger safely after relevant assets/layout changes.
34. CONTENT INTEGRITY
Do not invent unsupported scientific performance claims.
Do not present fake demo numbers as real mining data.
If illustrative measurements/confidence values are needed for animation, clearly treat them as illustrative/demo values or use neutral labels.
Use the actual narrative/content from:
- scenes/
- the provided context material
Do not turn the website into marketing hype.
The experience should explain what Computer Vision can observe and why that matters operationally.
35. AVOID THESE DESIGN FAILURES
Do NOT build:
- twelve cards
- twelve disconnected sections
- generic alternating text/image landing-page sections
- giant rounded cards around every scene
- a blue futuristic AI dashboard
- neon cyberpunk graphics
- a standard corporate SaaS homepage
- a PowerPoint-like webpage
- a simple vertical timeline with icons
- full-page screenshots of the provided infographics
- a slideshow
- one scene per viewport with hard cuts
- endless fade-in/fade-out sections
The user should feel like they are inside one continuous illustrated mining journey.
36. DO NOT USE PLACEHOLDERS AS THE FINAL IMPLEMENTATION
Temporary placeholders are acceptable during construction.
Before considering the work complete, replace major placeholder boxes such as:
[EXCAVATOR]
[TRUCK]
[CONVEYOR]
[DRONE]
[ROCK]

with actual designed SVG/CSS artwork.
Major scenes should not ship as grey rectangles with labels.
The custom illustration system is part of the product.
37. IMPLEMENTATION ORDER
Work in a disciplined sequence, but do NOT stop after each phase waiting for approval.
Proceed continuously.
Recommended workflow:
A. Inspect references + all scene files
↓
B. Understand full cinematic narrative
↓
C. Scaffold/repair Next.js application
↓
D. Install/configure locked stack
↓
E. Build visual tokens / global art direction
↓
F. Build Lenis + ScrollTrigger integration
↓
G. Build Journey Controller + typed scene registry
↓
H. Build persistent HUD
   - CV capsule
   - CV toggle
   - journey track
↓
I. Build reusable SVG illustration primitives
↓
J. Implement Part I completely
↓
K. Connect Part I transitions
↓
L. Implement Part II completely
↓
M. Connect Part II transitions
↓
N. Implement Part III completely
↓
O. Build whole-mine finale
↓
P. Implement CV ON/OFF properly
↓
Q. Responsive choreography pass
↓
R. Reduced-motion pass
↓
S. Accessibility pass
↓
T. Performance pass
↓
U. Build/lint/runtime verification
↓
V. Fix defects discovered during verification

Do not interpret this as permission to stop after J, L, or N.
Continue through the complete workflow.
38. PERIODIC IMPLEMENTATION CHECKPOINTS
Because this is a large implementation, maintain a lightweight root file:
IMPLEMENTATION_STATUS.md
Use it as a checkpoint ledger.
Update it periodically, not only at the very end.
Record:
- what is completed
- what is currently being implemented
- important architecture decisions
- outstanding scenes
- known issues
- verification status
Do not turn it into a long essay.
It exists so another coding session can resume if interrupted.
Do NOT modify the narrative authority files in scenes/ just to track implementation progress.
39. BROWSER VERIFICATION
After implementing the experience:
Run the application.
If browser automation/preview tools are available, actually inspect the site rather than assuming it looks correct.
Perform at least one complete scroll-through from beginning to end.
Verify:
- no blank pinned scenes
- no major jumps
- no overlapping broken text
- no stuck ScrollTriggers
- no visual discontinuities caused by missing scene handoffs
- CV capsule states match their scene
- CV toggle works
- detonator works
- conveyor foreign-object story works
- mobile layout is usable
- no console errors
- reduced motion remains understandable
Inspect both desktop and mobile-sized layouts if possible.
Fix issues found.
40. BUILD VERIFICATION
Before finishing, run the relevant commands.
At minimum:
lint
production build

Also run tests if tests are created.
Do not knowingly leave TypeScript errors.
Do not knowingly leave build errors.
Do not suppress meaningful errors with unsafe broad any usage simply to pass compilation.
41. QUALITY BAR FOR THE KEY SCENES
Give extra care to these moments because they define the experience:
Opening
The visitor should feel that they are entering the illustrated mine.
Drill-core → mine-face transition
A geological detail should meaningfully transition into larger-scale geology.
Detonator / blast
Should feel tactile and cinematic without becoming cartoonishly destructive.
Blast → fragmentation
Flying rock / dust should transition naturally into the muckpile.
Excavation safety
Worker + machine proximity should create understandable tension before CV appears.
Bucket inspection
Machine condition and boulder detection should be visible on the actual bucket/material.
Haulage → cab
Camera should transition into the driver's environment naturally.
Crusher
Follow material rather than presenting a new unrelated section.
Conveyor foreign object
This is one of the most important sequences.
The object must physically appear, travel, become dangerous, be detected, and produce an operational result.
Particle sizing
Should visually differ from foreign-object detection.
Ore sorter
Classification must lead to actual physical keep/reject separation.
Flotation
Slow the rhythm and visually communicate temporal CV analysis.
Drone reconstruction
Doodle terrain → feature points → point cloud → wireframe/mesh should be a major visual payoff.
Thermal inspection
RGB → thermal should be scroll-controlled and intuitive.
Whole-mine reveal
Must visually connect everything the visitor experienced.
42. CONTINUITY TEST
For every transition, ask:
"What physical object, line, movement, camera direction, or environmental feature carries the viewer into the next scene?"

If the answer is merely:
"fade out, fade in"

look for a stronger transition.
Not every transition needs to be spectacular, but the overall site must preserve the illusion of one journey.
43. STORY TEST
For each CV capability, verify this order:
1. The physical mining operation is visible.
2. A real operational problem/question becomes understandable.
3. The visitor has time to notice it.
4. Computer Vision begins observing.
5. The CV capability is revealed.
6. The visualization explains what CV sees.
7. An operational result/value becomes clear.
8. The process continues.

If a scene immediately displays an AI box and a paragraph before the user understands the situation, redesign the scene.
44. FINAL EXPERIENCE TEST
At the end, a visitor who knows little about mining or Computer Vision should nevertheless understand:
- where the material came from
- how it moved through the mine
- why different operational problems appeared
- what Computer Vision observed
- how those observations influenced decisions
- that the 12 capabilities belong to one connected mining lifecycle
The visitor should NOT leave thinking:
"I saw twelve AI product cards."

They should leave thinking:
"I travelled through a mine and saw where Computer Vision becomes useful."

45. FINAL REPORT
Only after the implementation and verification are complete, provide a concise final report containing:
- what was implemented
- major architecture decisions
- important files/directories created
- responsive/reduced-motion implementation status
- build/lint status
- any genuine remaining limitations
- anything that still requires custom production assets or real operational data
Do not replace implementation with the report.
The report is the final step after the work.
FINAL DIRECTIVE
Read everything first.
Then implement.
Do not repeatedly stop to ask for approval between scenes or phases.
Do not simplify the concept into a conventional landing page because that is easier.
Do not optimize for the fastest possible implementation at the expense of the core experience.
The defining idea of this project is:
one continuous, cinematic, scroll-driven mining journey where the physical mining process is the backbone and Computer Vision appears contextually as an intelligence layer.
Preserve that idea through the architecture, illustration system, animations, transitions, responsive behavior, and final whole-mine reveal.
Continue until the complete Parts I, II and III experience is implemented and verified.
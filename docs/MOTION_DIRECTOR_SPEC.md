# Motion Director Specification — CV in Mining (Remediated Final)

## 1. Executive Summary & Core Philosophy

This specification codifies the motion design, cinematic choreography, and transition architecture of the **CV in Mining** interactive experience.

The experience is directed not as 22 disconnected webpage sections or presentation slides, but as:
> **One continuous physical journey through an operating mine, where physical events causally trigger camera movement, and computer vision intelligence progressively decodes the operation.**

### Core Tenets
1. **Single Persistent World**: One continuous SVG world stage (`PersistentWorldStage.tsx`). No video cutaways, no full-screen whiteouts or panel wipes, no arbitrary scene swaps.
2. **Global Journey Coordinates & Clock**: Camera interpolation operates along a single global motion clock ($u \in [0, u_{\text{total}}]$), derived from cumulative authored scene lengths. Analytical Hermite derivative evaluation evaluates boundary knot velocity and acceleration, guaranteeing $C^1$ continuity across carry handoffs.
3. **Deterministic State**: State is a pure mathematical function of scroll position. Forward and reverse seeking reconstruct identical physical reality without stale artifacts or state leaks.
4. **Physical Evidence Before CV Interpretation**: Physical phenomena (geological contacts, fragmentation muckpiles, converging danger zones, foreign tools on conveyors, highwall thermal anomalies) become visible to the eye before computer vision overlays annotate them and before HUD capsules summarize them.
5. **Subordinated Bridge Scenes**: Operational conveyor, slurry, loading, crusher, and muckpile transitions are framed as physical material handoffs rather than chapter slides; standard large H2 and subtitle ceremony is suppressed in favor of concise connectors.
6. **Physical Restraint & Rhythm**: High-energy peaks (blast displacement, safety near-miss, belt hazard intervention) are counterbalanced by quiet, contemplative pauses (core inspection, driver interior, froth flotation breath, finale operational network).

---

## 2. Global Camera Motion Model & Kinematics

### Global Journey Coordinates
Rather than compiling independent splines for each scene, the camera engine (`CameraDirector.ts`) projects each scene's local progress $p \in [0, 1]$ into a cumulative journey coordinate $u$:

$$u = \sum_{k < i} L_k + p \cdot L_i$$

where $L_i$ is the authored scene length in viewport-height units:
- **Desktop Total Journey Length**: **35.15 vh**
- **Mobile Total Journey Length**: **25.30 vh**

### Precomputed Global Splines ($C^1$ Knot Continuity)
Keyframes are flattened and de-duplicated into an ordered global trajectory. Global Fritsch-Carlson monotone cubic Hermite splines interpolate position $(x, y)$, logarithmic scale $\ln(\text{scale})$, screen anchors $(ax, ay)$, and roll angle:

$$P(t) = (2t^3 - 3t^2 + 1)P_0 + (t^3 - 2t^2 + t)d_0 + (-2t^3 + 3t^2)P_1 + (t^3 - t^2)d_1$$

Analytical derivative functions (`cameraKinematicsAt`, `cameraDerivativeAtGlobalU`) calculate exact velocity vectors $\vec{v}(u) = dP/du$, accelerations $\vec{a}(u) = d^2P/du^2$, and finite-difference jerk magnitudes.

### Boundary Semantics: Carry vs Settle
- **`carry` (18 boundaries)**: The camera passes through the boundary with continuous physical momentum. Across all carry boundaries, knot speed is preserved ($r \in [0.90, 1.23] \le 1.45$) and direction angle change is bounded ($\le 16.92^\circ \le 25^\circ$).
- **`settle` (3 boundaries)**: The camera comes to an intentional physical rest ($v_{\text{knot}} = 0.00\text{ px/vh}$):
  - `grade → blast`: Settles into blast staging as charges and detonator are prepared.
  - `slurry → froth`: Settles into flotation breath to observe mineralized bubble kinetics.
  - `thermal → finale`: Settles before the drone zenith ascent and overview reveal.

### Monotonic Finale Trajectories
- **Mobile Finale**: After Thermal ($x \approx 7480$), the mobile camera travels strictly monotonically right-to-left ($7480 \to 6500 \to 4100 \to 1800 \to 1250$) and holds at the Pit. It never ping-pongs or reverses back toward the center. Operational synthesis is achieved via a dedicated screen-space layer (`FinaleSynthesis.tsx`).
- **Desktop Finale**: Retraces smoothly into an operational overview at $x=3800, y=420, \text{scale}=0.24$ with no last-second reversals ($7480 \to 6450 \to 4300 \to 3800$).

---

## 3. Transition Matrix (All 21 Boundaries)

| # | Boundary | Carrier Object | Technique | Boundary Motion | Narrative Purpose |
|---|---|---|---|---|---|
| 01 | **arrival → drill** | Drill rig / haul road | Motivated push into pit | **carry** | Enter physical mine gate down to active exploration drill. |
| 02 | **drill → core** | Extracted core cylinder | Subject follow | **carry** | Follow core extraction out of subsurface seam into core tray. |
| 03 | **core → grade** | Geological contact seam | Graphic match | **carry** | Micro geological vein matches macro ore/waste boundary on bench. |
| 04 | **grade → blast** | Bench / charge line | Context continuation | **settle** | Grade decision establishes charge wiring; environment quiets before blast. |
| 05 | **blast → fragments** | Same bench + dust curtain | Consequence reveal | **carry** | High-energy blast collapses bench; settling dust reveals muckpile. |
| 06 | **fragments → excavation** | Excavator tracks | Emergence through dust | **carry** | Excavator tracks through settling dust into freshly blasted muckpile. |
| 07 | **excavation → safety** | Worker + excavator cab | Converging motion | **carry** | Converging trajectories create visual tension prior to CV detection. |
| 08 | **safety → bucket** | Shovel bucket lip | Subject capture | **carry** | Machine clears hazard; camera follows bucket swing up to toothline. |
| 09 | **bucket → loading** | Bucket + selected rocks | Match on action | **carry** | Tooth integrity verified; payload swings over waiting haul truck. |
| 10 | **loading → haul** | Falling rock → truck bed | Attention transfer | **carry** | Rock drops into bed; truck suspension dips; camera tracks truck departure. |
| 11 | **haul → driver** | Cab windshield frame | Windshield framing | **carry** | Camera approaches side cab window; angled A-pillar framing reveals interior. |
| 12 | **driver → crusher** | Truck body + payload | Exit & follow | **carry** | Camera pulls out of cab; follows truck to primary crusher dump hopper. |
| 13 | **crusher → conveyor** | Hero rock payload | Material follow | **carry** | Truck tips payload; hero rock passes jaw crusher down onto conveyor belt. |
| 14 | **conveyor → sizing** | Same belt & rock stream | Semantic transformation | **carry** | Foreign tool removed; belt resumes; attention shifts to particle sizing. |
| 15 | **sizing → sorter** | Stream particles | Analytical continuation | **carry** | Belt particle sizing feeds directly into optical ore sorter chute. |
| 16 | **sorter → slurry** | Accepted particle stream | Material flow follow | **carry** | Air jet ejects waste; accepted copper ore drops into wet ball mill. |
| 17 | **slurry → froth** | Process slurry fluid | Fluid transformation | **settle** | Ground ore slurry flows continuously into flotation cell bank; contemplative pause. |
| 18 | **froth → stockpile** | Mineralized froth concentrate | Environmental pullback | **carry** | Copper concentrate froth decants; camera pulls back to concentrate stockpile. |
| 19 | **stockpile → survey** | Autonomous drone launch | Subject launch | **carry** | Autonomous survey drone lifts off from pad beside massive stockpile. |
| 20 | **survey → thermal** | Same drone & terrain | Sensor-mode change | **carry** | Same spatial geography transforms from 3D photogrammetry to thermal infrared. |
| 21 | **thermal → finale** | Drone vertical climb | Scale revelation | **settle** | Drone climbs to zenith; perspective expands to reveal entire integrated operation. |

---

## 4. Physical Actor Continuity & Global Units

### Truck Velocity in Global Journey Units
Truck motion (`truckPose` in `actors.ts`) is parameterized in global journey units ($v_{\text{global}} = v_{\text{local}} / L_{\text{scene}}$):
- `loading → haul`: Global velocity matches across boundary at $v_{\text{global}} \approx 460.8\text{ px/vh}$ (ratio $1.00$).
- `haul → driver`: Global velocity matches across boundary at $v_{\text{global}} \approx 460.8\text{ px/vh}$ (ratio $1.00$).
- `driver → crusher`: Truck initiates Hermite deceleration prior to boundary, matching pad approach at $v_{\text{global}} \approx 105.8\text{ px/vh}$ (ratio $1.00$).

### Drone Flight Continuity
The drone (`dronePose` in `actors.ts`) executes an unbroken flight:
- `stockpile`: Takeoff begins at $p=0.45$, accelerating to match survey entry global speed $v_{\text{global}} \approx 240.9\text{ px/vh}$.
- `survey`: Steady photogrammetry sweep across stockpile to highwall ($x=6120 \to 6650, y=360 \to 265$).
- `thermal`: Enters at $x=6650$, hovers over highwall bench anomaly, ascends toward zenith at $x=6960$.
- `finale`: Zenith overview ascent ($y \to 50$).

### Safety Physical Causality
Pure geometry function `safetyGeometry(p)` in `actors.ts` calculates real physical interaction:
1. $p < 0.70$: Worker approaches machine; distance decreases while excavator slews toward danger zone.
2. $p = 0.70$: Proximity threshold crossed; operator warning triggers.
3. $p \in [0.70, 0.86]$: Excavator holds swing stationary while worker retreats.
4. $p \ge 0.87$: Worker clears exclusion zone; excavator resumes swing.

### Conveyor Mechanical State Sharing
Pure function `materialFlowState(scene, p)` in `actors.ts` governs belt offset, particle feed offset, and tool trajectory:
- $p < 0.70$: Belt and feed particles advance continuously.
- $p \in [0.70, 0.90]$: Foreign maintenance tool detected; belt and feed particles freeze completely (`beltStopped = true`).
- $p > 0.90$: Tool removed; belt resumes advancing.
- Reverse seeking reconstructs exact identical mechanical state.

---

## 5. Driver Cab Interior Architecture

### Windshield Framing & Local Magnification
The old solid black rectangle occlusion path was eliminated. The cab transition is rebuilt with authentic structural truck framing:
1. **Angled Exterior Structure**: Truck exterior cab, windshield border, chassis, and wheels in `<g data-gp="truck-exterior">`.
2. **Windshield Clip**: `<clipPath id="cab-window-clip">` clips interior elements to the angled windshield window geometry.
3. **Local Cab Magnification**: Cab detail stage (`<g data-gp="cab-detail-stage">`) applies a local $2.4\times$ zoom centered on the driver head. On 390px mobile viewports, driver head height measures $\approx 98\text{px}$ ($\ge 70\text{px}$ acceptance threshold), ensuring eyelids and fatigue cues are clearly visible without requiring disorienting global camera zooms.
4. **Foreground Framing**: Foreground A-pillar and roof border (`<g data-gp="cab-frame-fg">`) frame the interior naturally.

---

## 6. Thermal Sensor Footprint & Highwall Anomaly

- **Subdued Sensor Cone**: Projection cone stroke fill reduced to `rgba(244, 91, 61, 0.045)` with `0.45` strokeOpacity, indicating geometry without washing out the scene.
- **Terrain Preservation**: The sensor footprint ellipse applies a subtle warm wash (`opacity="0.26"`), preserving the bench linework underneath.
- **Localized Target**: Inside the footprint, localized false-color contours and a target bounding box highlight the highwall heating anomaly.

---

## 7. Finale Operational Network & Synthesis

### Connected Operational Route
A subtle dashed accent route path (`<path data-finale-network-route>`) connects all 12 landmark locations across the mine in journey order (Core $\to$ Grade $\to$ Blast $\to$ Safety $\to$ Shovel $\to$ Driver $\to$ Foreign Object $\to$ Particle Sizing $\to$ Ore Sorting $\to$ Froth Flotation $\to$ 3D Survey $\to$ Thermal Inspection).

### Landmark Freshness Decay
In `StageDirector.ts`, landmark labels undergo freshness decay:
- Active landmark: Number, pulse ring, and text label visible.
- Previously revealed landmarks: Text labels fade down ($\le 0.12$ opacity) while number circle and signal dot remain visible.
- At $p=0.95$, only $\le 2$ fresh labels remain above $0.35$ opacity, avoiding visual clutter across the 12 capabilities.

### Mobile Operational Synthesis (`FinaleSynthesis.tsx`)
On portrait mobile screens where zooming out renders the mine sub-pixel, the camera holds at the Pit while a cinematic overlay presents the operational thesis:
- **ACT I · UNDERSTAND THE ROCK**: 01 Core logging · 02 Grade control · 03 Blast fragmentation
- **ACT II · MOVE THE MOUNTAIN**: 06 Exclusion zone · 04 Tooth wear · 05 Driver vigilance · 07 Foreign object · 08 Particle sizing · 09 Stream sorting
- **ACT III · RECOVER & INSPECT**: 10 Froth dynamics · 11 Stockpile survey · 12 Highwall thermal

---

## 8. Caption Hierarchy & Subordinated Bridges

`CaptionDirection` in `motionDirection.ts` configures explicit per-scene discovery windows:
- **Hero & Capability Scenes**: Title appears in sync with physical evidence (e.g. Grade title appears only after core seam matches bench geology; Safety title appears as worker enters hazard proximity; Conveyor title appears after tool lands on belt).
- **Bridge Scenes (`excavation`, `loading`, `crusher`, `slurry`, `stockpile`)**: Standard large H2 + subtitle chapter slides are suppressed; small connector phrases render subtly:
  - *Excavation*: "Into the muckpile."
  - *Loading*: "Follow the rock."
  - *Crusher*: "Into the crusher."
  - *Slurry*: "Rock becomes process."
  - *Stockpile*: "From process to product."

---

## 9. Performance & Measurement Policy

### Telemetry Reporting Policy
All performance metrics reported in project documentation must be drawn directly from automated profiling runs:
- Headless automated tests run in Chromium with ANGLE SwiftShader (Vulkan 1.3 CPU software rasterizer).
- **Desktop (1440×900)**: Median frame interval 33.3ms, p95 83.3ms, slowFramePct (>20ms) 66.9%.
- **Mobile (390×844)**: Median frame interval 16.7ms, p95 33.4ms, slowFramePct (>20ms) 15.5%.
- **Truthful Status**: Desktop CPU rasterizer did not meet the $\le 5\%$ slow frame threshold under software emulation. Target-device hardware GPU performance was not measured in this environment.
- Survey point cloud contains exactly **128 points** (achieving 3.2% slow frames on mobile).

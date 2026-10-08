# PART II — MOVING THE MOUNTAIN  
### Excavation → Safety → Loading → Haulage → Crushing → Conveying

Part II should feel noticeably different from Part I.

Part I was about **understanding and breaking rock**.

Part II is about **movement**.

Machines enter the story. People work around those machines. Material starts travelling. Risks become dynamic rather than geological.

The emotional progression becomes:

> **The blast created the material → now we have to move thousands of tonnes of it safely and efficiently.**

And I would deliberately make this the most kinetic part of the website.

The user should almost feel that the mine has “come alive.”

---

# SCENE 06 — “THE MINE WAKES UP”

### Mining stage
**Excavation / active loading area**

### CV capabilities entering this environment
- PPE detection
- Exclusion-zone monitoring
- People/equipment proximity
- Shovel bucket / tooth / boulder monitoring

The important thing here is that these shouldn't feel like four separate demonstrations.

They are all happening around **one working excavator**.

---

## Where Part I ended

We left the visitor looking at the fragmented muckpile.

The orange fragmentation outlines have disappeared.

We just see the physical rocks again.

Then:

```text
                    ╲
                     ╲
                      ╲____
                     /     \

 ROCK   ROCK   ROCK  ROCK  ROCK
```

An excavator bucket slowly enters from the right.

As the user continues scrolling, the camera pulls backward.

Now the entire excavator becomes visible.

Then a haul truck waiting beside it.

Then a worker.

Suddenly our quiet post-blast landscape becomes an operational loading zone.

Something like:

```text
                       EXCAVATOR
                           ___
                     _____/   \___
                    /           __\__
               ____/            \____/
              /                       \
      👷                     ROCK ROCK ROCK

                         🚛
```

Small animated details matter here:

- excavator tracks subtly moving
- hydraulic arm movement
- bucket swinging
- dust sketches
- truck suspension
- worker walking
- warning beacon pulsing

Nothing hyperrealistic.

Everything still belongs to your doodle world.

---

# The first danger should happen before any CV appears

A worker begins walking toward the machinery.

Maybe they are inspecting something.

The excavator simultaneously starts rotating.

The visitor should be able to see:

> those two trajectories may intersect.

Don't immediately throw a bounding box around the worker.

Let the viewer notice it.

Then our small contextual CV capsule wakes up:

```text
        ┌────────────────────────────┐
        │ ⚠ ACTIVE EQUIPMENT AREA   │
        └────────────────────────────┘
```

Continue scrolling.

The excavator keeps rotating.

The worker continues forward.

The distance closes.

```text
                   🚜
                ↙ rotating

                   6.2 m

             👷
                  →
```

Then:

```text
                   4.8 m
```

Then:

```text
                   3.1 m
```

Now CV activates.

---

# SCENE 07 — “WHO IS INSIDE THE DANGER ZONE?”

### CV capability
**PPE, exclusion zones & proximity**

This is where your original use case 6 belongs naturally.

Not on its own page.

Not necessarily after use case 5.

It appears because **we have entered an environment where people and heavy machinery interact.**

---

## The CV layer turns on

A hand-drawn orange bounding box sketches around the worker.

Another outline identifies the excavator.

Then a dashed exclusion zone grows organically from the excavator.

```text
            ┌───────────────┐
            │ EXCAVATOR     │
            └───────────────┘
                   🚜

        . . . . . . . . . . . .
     .                           .
    .      EXCLUSION ZONE         .
     .                           .
        . . . . . . . . . . . .

              ┌─────┐
              │ 👷  │
              └─────┘
                ↑
              2.9 m
```

But the UI shouldn't look like generic YOLO boxes slapped on top.

Keep your doodle identity:

- slightly hand-drawn corners
- orange dashed distance lines
- little handwritten labels
- sketch-like warning rings

---

## Dynamic capsule: problem state

```text
┌───────────────────────────────────────┐
│ ⚠ PERSON ENTERING EQUIPMENT ZONE    │
│ Distance to operating machine ↓      │
└───────────────────────────────────────┘
```

Then as scroll continues, it morphs:

```text
┌────────────────────────────────────────────┐
│ 👁 PPE, EXCLUSION ZONES & PROXIMITY       │
│                                            │
│ Vision detects people, PPE and vehicles,  │
│ then tracks entry into hazardous zones.   │
└────────────────────────────────────────────┘
```

Meanwhile the scene itself explains this.

Helmet:

```text
👷
↑
HELMET ✓
```

Vest:

```text
HI-VIS ✓
```

Machine proximity:

```text
3.0 m ⚠
```

Danger zone:

```text
BOUNDARY BREACH
```

---

## Outcome

The worker receives an alert.

Or the equipment operator receives one.

The worker stops and steps backward.

No dramatic emergency.

Just:

```text
        👷 ←

        3.0 m
        3.8 m
        5.2 m
```

The orange danger zone returns to normal.

Capsule becomes:

```text
┌─────────────────────────────────┐
│ ✓ PROXIMITY RISK IDENTIFIED    │
│ Safer people–equipment movement │
└─────────────────────────────────┘
```

Then contracts.

---

# Very important: the excavator never stopped being part of the story

While the safety interaction happens, the excavator remains working in the background.

Once the worker leaves the zone, our attention returns to the machine.

The bucket moves down toward the muckpile.

And this naturally exposes the next problem.

---

# SCENE 08 — “THE BUCKET TAKES THE PUNISHMENT”

### Mining stage
**Digging / loading**

### CV capability
**Shovel bucket / tooth / boulder monitoring**

Now the excavator scoops the material created in Scene 05.

This is where continuity becomes valuable.

These aren't random rocks.

Conceptually they are **the same fragmented rock we've been following since the blast**.

---

## First scoop

The bucket digs into the muckpile.

Rock flows inside.

Some falls around the edges.

The camera moves much closer to the bucket.

A large boulder presses against it.

Something looks slightly wrong with one tooth.

Again — no labels yet.

```text
             BUCKET

       ╱│ │ │ │   │ │╲
      ╱ │ │ │ │   │ │ ╲
        ✓ ✓ ✓ ?   ✓ ✓

        ROCKS / BOULDER
```

---

## Establish the physical problem

Mining tools are constantly operating against abrasive material.

A missing/damaged tooth can become:

- an equipment problem
- a downstream crusher hazard
- a productivity issue

An oversized boulder can also affect loading and crushing.

Our capsule expands:

```text
┌────────────────────────────────────┐
│ ? IS THE BUCKET READY TO LOAD?    │
└────────────────────────────────────┘
```

---

# A camera mounted near the shovel wakes up

Orange rays appear.

The bucket pauses visually for just a fraction of the scroll sequence.

The CV layer sketches itself across the bucket edge.

Each tooth gets a tiny marker.

```text
TOOTH STATUS

[✓] [✓] [✓] [!] [✓] [✓]
             ↑
       abnormal geometry
```

The problematic tooth gets a red/orange accent.

At the same time, the large rock is outlined:

```text
       ╭────────────────╮
      /                  \
     /      BOULDER       \
     ╰────────────────────╯

        OVERSIZE
```

---

## Dynamic capsule morph

```text
┌────────────────────────────────────────────┐
│ 👁 SHOVEL BUCKET / TOOTH / BOULDER       │
│                                            │
│ Vision checks bucket condition, detects   │
│ missing teeth and identifies oversize.    │
└────────────────────────────────────────────┘
```

Then the physical consequence.

Perhaps the operator changes the loading action rather than sending the boulder downstream.

The bucket repositions.

The problem rock remains.

Suitable material gets loaded.

---

## Outcome

```text
┌───────────────────────────────────────┐
│ ✓ LOADING CONDITION VERIFIED        │
│ Protect equipment • improve loading │
└───────────────────────────────────────┘
```

Collapse.

The excavator completes the scoop.

Now we get a satisfying physical payoff.

---

# SCENE 09 — “FOLLOW THE ROCK”

This scene has no new CV solution.

It exists purely to maintain continuity.

The bucket swings toward the truck.

The camera doesn't remain outside.

Instead, **we follow one recognizable group of rocks**.

You could distinguish our “hero material” with very subtle orange edge marks — not cartoon googly-eye character rocks, just enough visual continuity that the user subconsciously follows the same load.

Bucket reaches the truck:

```text
                 ______
               _/      \_
           ___/          \

     ROCK ROCK ROCK
          ↓↓↓↓↓

       ┌───────────┐
       │   TRUCK   │
       └───────────┘
```

The material falls into the truck bed.

Dust rises.

As the user scrolls, the camera travels **with the falling rock**.

For half a moment the screen is filled with material.

Then we emerge looking outward from inside the truck bed.

The excavator becomes smaller behind us.

The truck begins moving.

---

# Transition: excavation → haulage

The horizontal road becomes our new visual guide.

The mine background begins moving left.

The truck stays relatively fixed.

This creates the impression that we're travelling.

```text
        🚛  →


mountain     mountain        crusher
   ←            ←                ...
────────────────────────────────────────
                 ROAD
```

The journey indicator at the bottom might subtly move from:

**Excavation → Haulage**

but without interrupting the scene.

---

# SCENE 10 — “THE LONG HAUL”

### Mining stage
**Haulage**

### CV capability
**Driver fatigue & distraction**

This is where original use case 5 belongs.

And placing it here gives us an opportunity to completely change the camera perspective.

---

# First: let the haulage scene breathe

The dump truck travels along a winding mine road.

It passes:

- benches
- warning signs
- another haul truck
- excavators in the distance
- steep edges
- dust

No CV yet.

We want visitors to understand:

> hauling is repetitive, continuous and safety-critical.

As the scroll continues, daylight subtly shifts.

Maybe not full day-to-night — that could be too theatrical — but enough to communicate time passing.

The road keeps moving.

---

# Camera approaches the cab

Instead of cutting abruptly inside, the camera catches up with the truck.

Moves alongside.

Moves toward the cabin window.

Then passes through the illustrated glass.

Suddenly:

## First-person-ish interior scene.

The driver.

Steering wheel.

Dashboard.

Road moving outside.

```text
┌─────────────────────────────────────┐
│         WINDSHIELD                  │
│                                     │
│            mine road                │
│                                     │
└─────────────────────────────────────┘

           👤
       driver

  steering wheel          dashboard
```

The doodle style remains consistent.

---

# The problem happens gradually

The driver is fine initially.

Then scroll represents time passing.

Blink.

Blink.

Longer blink.

Slight head drop.

Maybe glance toward something too long.

No warning yet.

The visitor should notice the change.

Then:

```text
      eyelids ↓
      head angle ↓

          😴
```

The truck remains moving.

Now the capsule wakes:

```text
┌───────────────────────────────┐
│ ⚠ DRIVER ATTENTION CHANGING │
└───────────────────────────────┘
```

---

# CV begins observing the driver

A small in-cab camera becomes visible.

Orange dotted rays.

Then minimal facial landmarks appear.

Not hundreds of points.

Keep it visually readable.

```text
          •──────•
        eye      eye
           \    /
             •
           nose

       HEAD POSE ↓

      BLINK DURATION ↑
```

Perhaps three tiny indicators appear near the driver's head:

```text
EYES        ⚠
HEAD POSE   ⚠
ATTENTION   ↓
```

---

## Dynamic capsule morph

```text
┌─────────────────────────────────────────────┐
│ 👁 DRIVER FATIGUE & DISTRACTION            │
│                                             │
│ In-cab vision monitors eye, face and head  │
│ behaviour over time.                       │
└─────────────────────────────────────────────┘
```

Continue scrolling.

The system detects a fatigue event.

Dashboard alert appears.

```text
       ⚠ FATIGUE RISK
```

The driver responds.

Head returns upright.

Attention returns toward the road.

---

## Outcome

```text
┌────────────────────────────────────┐
│ ✓ FATIGUE EVENT IDENTIFIED        │
│ Safer haulage • fewer incidents   │
└────────────────────────────────────┘
```

Then capsule collapses.

---

# Camera exits the truck

The truck reaches the processing side of the operation.

Camera passes back through the windshield/window.

Pulls outward.

We see the truck travelling toward a huge receiving structure.

Now machinery starts becoming larger.

Conveyors appear.

Crusher structures enter the background.

This should feel like we're transitioning from:

> **mine environment**

into:

> **processing infrastructure.**

The visual density increases.

---

# SCENE 11 — “FROM TONNES TO FLOW”

### Mining stage
**Dumping / primary crushing**

No dedicated new use case needs to be forced here.

This is primarily a **physical transformation scene**.

That's important because the user needs to understand how we get from truck-sized material to conveyor-fed material.

---

## The truck reaches the dump pocket

It reverses.

The truck bed rises.

And now the same rocks we've followed since the blast begin sliding out.

```text
       ________
      /       /|
     /_______/ |
        ╲
         ╲  ROCKS
          ╲ ↓↓↓↓↓

       DUMP HOPPER
       ╲          ╱
        ╲        ╱
         ╲______╱
```

Scroll directly controls the tipping motion.

This should feel satisfyingly mechanical.

---

# Camera follows the rock downward

This is one of the places where we can do something cinematic.

Instead of watching from outside:

**follow the rock into the crusher.**

The screen gets darker/denser temporarily.

Huge crusher jaws or rotating elements surround the material.

Large fragment:

```text
      ◀      ROCK      ▶
```

Compression.

Crack.

```text
         CRACK
       ╱   │   ╲
      ◼    ◼    ◼
```

Large rocks become smaller rocks.

The viewport shakes only slightly during compression.

Again — no gratuitous screen-shake.

---

# Rock drops downward

Then suddenly—

white background again.

It lands on a moving conveyor.

```text
            ↓
        rock rock
═══════════════════════→
         conveyor
```

And now we enter what should be one of the strongest sequences in the whole website.

---

# SCENE 12 — “SOMETHING DOESN'T BELONG”

### Mining stage
**Conveying**

### CV capability
**Conveyor foreign-object & oversize detection**

This is specifically the sequence you described, and I think it deserves a longer cinematic treatment.

---

# Establish the conveyor first

Don't immediately create the problem.

Let the visitor travel beside the belt.

The conveyor might occupy roughly the lower half of the screen.

Processing infrastructure in the background.

A camera mounted above.

But inactive for now.

```text
                         camera
                           ◉


 ROCK    ROCK   ROCK    ROCK   ROCK
══════════════════════════════════════→
```

The belt itself moves independent of user scroll at a very low speed, while scroll advances the larger timeline.

That keeps the site feeling alive even when the visitor pauses.

---

# Then the event happens

Some maintenance activity could exist above the belt.

A loose metal object or tool drops.

Not magically appearing.

Actually show where it comes from.

For example:

```text
              🔧
              ↓
              ↓

 ROCK  ROCK        ROCK
════════════════════════════→
```

It hits the conveyor.

Small bounce.

Then starts travelling with the rock.

At first:

**nothing happens.**

This is crucial.

The visitor sees the dangerous object physically moving toward downstream equipment.

---

## Dynamic capsule: problem first

```text
┌─────────────────────────────────┐
│ ⚠ FOREIGN OBJECT ON MATERIAL  │
│   STREAM                        │
└─────────────────────────────────┘
```

Do not immediately say “computer vision.”

We first establish the situation.

---

# Scroll continues

The object moves closer to the fixed camera.

The camera rotates/activates.

Orange rays appear.

```text
                       ◉
                     .   .
                   .       .
                 .           .

 ROCK ROCK   🔧   ROCK ROCK
══════════════════════════════→
```

Then detection occurs.

A slightly imperfect orange rectangle draws itself around the foreign object.

```text
          ┌────────────┐
          │     🔧     │
          └────────────┘
          FOREIGN OBJECT
             98%
```

Nearby normal rocks remain largely untouched.

This makes the detection immediately readable.

---

# Dynamic Island-style expansion

The small capsule stretches.

Corners morph smoothly.

Content enters with slight vertical motion.

```text
┌─────────────────────────────────────────────┐
│ 👁 CONVEYOR MATERIAL VISION                │
│                                             │
│ Foreign-object & oversize detection        │
│                                             │
│ Vision identifies tools, metal, wood,      │
│ oversize rocks and abnormal material.      │
└─────────────────────────────────────────────┘
```

Notice I would probably use:

**Conveyor Material Vision**

as the small human-facing heading,

while keeping:

**Foreign-object & oversize detection**

as the technical capability underneath.

The original use-case name is accurate, but this hierarchy reads better cinematically.

---

# Don't stop at “detected”

This is where many AI demos become weak.

They draw a box around something and say:

> AI detected it.

But operations care about **what happens because it was detected.**

So continue the sequence.

The foreign object is moving toward a downstream crusher.

A little hand-drawn distance indicator could appear:

```text
FOREIGN OBJECT

      ↓

─────────────── 18 m ─────────────→ CRUSHER
```

Then:

```text
12 m
```

Then CV triggers an operational action.

Perhaps:

```text
DETECTION
    ↓
ALERT
    ↓
BELT RESPONSE / OPERATOR ACTION
```

But show it physically.

The belt slows.

Warning beacon flashes.

Operator screen gets alert.

If an automated rejection mechanism exists in the conceptual site, it can divert the item; otherwise keep it realistic and show **alert / belt-stop decision** rather than inventing automatic removal.

---

## Result capsule

```text
┌──────────────────────────────────────┐
│ ✓ HAZARD DETECTED BEFORE CRUSHER   │
│ Protect assets • reduce downtime    │
└──────────────────────────────────────┘
```

Then shrink back to:

```text
             ┌──────┐
             │ ✓ CV │
             └──────┘
```

The obstruction is removed.

The conveyor starts moving normally again.

And crucially:

### We do not leave the conveyor.

Because the next use case also belongs to this material stream.

---

# SCENE 13 — “BUT IS THE ROCK THE RIGHT SIZE?”

### Mining stage
**Conveying / process control**

### CV capability
**Online particle-size monitoring**

This is where original use case 8 belongs.

It should feel like:

> We solved the abnormal-object problem.  
> But now there is a different question: what does the normal material itself look like?

---

# First return everything to normal

Foreign-object boxes disappear.

No alert.

Only rock travelling.

```text
  ◼  ◼     ◼    ◼◼       ◼
════════════════════════════════→
```

Then the visitor begins noticing:

some rocks are large.

Some medium.

Some fine.

One noticeably oversized fragment comes through.

Our capsule doesn't immediately expand.

A small question appears:

```text
        ┌──────────────────────┐
        │ ? HOW COARSE IS IT? │
        └──────────────────────┘
```

---

# The camera starts measuring normal rock

Orange segmentation contours begin following individual particles.

This should feel different from foreign-object detection.

### Previous use case:
bounding box around anomaly.

### This use case:
contours and measurements across the material population.

That visual difference helps explain the different CV tasks.

```text
     ╭────────╮
    /          \
    ╰──────────╯
       320 mm

            ╭──────╮
           /        \
           ╰────────╯
             180 mm

                       ╭───╮
                       ╰───╯
                        75 mm
```

More and more rocks receive contours.

---

# A tiny distribution graph grows from the conveyor

Not a separate dashboard.

Imagine the conveyor itself generating the chart.

Orange dots rise from measured particles and flow toward a small curve.

```text
                     PARTICLE SIZE

                        ╭─────
                   ╭────╯
               ╭───╯
          ╭────╯
──────────┴────────────────────
```

Then labels:

```text
P20
P50
P80
```

The same concept the visitor saw after blasting reappears.

That's good.

It creates an intentional callback:

> We measured fragmentation after the blast.  
> Now we're monitoring particle size continuously during processing.

This makes the mine feel like one connected control loop.

---

## Dynamic capsule

```text
┌─────────────────────────────────────────────┐
│ 👁 ONLINE PARTICLE-SIZE MONITORING         │
│                                             │
│ Vision segments material continuously and  │
│ estimates changing size distribution.      │
└─────────────────────────────────────────────┘
```

Then:

```text
┌──────────────────────────────────────┐
│ ✓ MATERIAL FLOW UNDERSTOOD         │
│ Better stability • downstream control│
└──────────────────────────────────────┘
```

Collapse.

---

# This is also where we can create a powerful callback to the blast

For perhaps half a second during scrolling:

A faint ghosted outline of the earlier **blast fragmentation P80** appears on one side.

Current conveyor P80 on the other.

```text
BLAST                         PROCESS

P80: 210 mm        →         P80: 145 mm
```

Not presented as fake real data.

The actual production site would use either clearly illustrative values or live/project values.

Conceptually the point is:

> **Upstream fragmentation affects downstream processing.**

That's a very useful story for the website because it shows CV use cases aren't isolated products.

They are connected through the mining process.

---

# Now the material approaches a fork

Far ahead we see a different machine.

Several sensors.

Laser/optical heads.

Individual particles spreading apart.

The conveyor narrows.

Spacing between rocks increases.

The visual environment becomes cleaner and more controlled.

This tells us:

> We're leaving bulk material handling and entering material decision-making.

---

# PART II ENDING — THE HANDOFF TO PROCESSING

As the camera follows the conveyor, the rocks move beneath the first optical sensor.

A scan beam briefly crosses one particle.

That particle illuminates orange.

But we **don't explain it yet.**

The capsule just gives a tiny teaser:

```text
       ┌────────────────────┐
       │ NEXT: KEEP OR REJECT? │
       └────────────────────┘
```

Camera pulls alongside the sorter.

We can see two future material paths:

```text
                       ┌──────────→
CONVEYOR ──────────────┤
                       └──────────→
```

But we haven't told the visitor which path means what.

Then Part II concludes.

---

# The full continuity of Part II

The important thing is that visually this should feel almost like **one uninterrupted shot**:

```text
PART I MUCKPILE
     ↓
excavator enters
     ↓
worker approaches machinery
     ↓
CV sees PPE / proximity risk
     ↓
bucket digs
     ↓
CV inspects bucket teeth + boulders
     ↓
rock enters bucket
     ↓
bucket loads truck
     ↓
we follow rock into truck
     ↓
truck starts haul
     ↓
camera moves into cab
     ↓
fatigue develops
     ↓
CV detects driver risk
     ↓
camera leaves cab
     ↓
truck arrives at crusher
     ↓
truck dumps SAME MATERIAL
     ↓
camera follows rock through crushing
     ↓
rock lands on conveyor
     ↓
foreign object falls onto belt
     ↓
problem becomes visible
     ↓
CV detects foreign object
     ↓
operational response
     ↓
belt continues
     ↓
CV measures particle sizes
     ↓
material approaches optical sorter
```

That's the narrative.

Not:

```text
Use Case 6
↓
Use Case 4
↓
Use Case 5
↓
Use Case 7
↓
Use Case 8
```

The use-case numbers effectively disappear from the visitor experience.

---

# The CV ordering so far

After Part I + II, the capabilities have naturally appeared in this order:

```text
1. Drill-core analysis
        ↓
2. Ore / waste & grade mapping
        ↓
3. Blast fragmentation analysis
        ↓
4. PPE / exclusion zones / proximity
        ↓
5. Shovel bucket / tooth / boulder monitoring
        ↓
6. Driver fatigue & distraction
        ↓
7. Conveyor foreign-object & oversize detection
        ↓
8. Online particle-size monitoring
```

That numbering is now **journey order**, not your original arbitrary use-case numbering.

Internally we can still map them to their source use cases, but visitors shouldn't care that shovel monitoring originally happened to be #4 and driver fatigue #5.

---

# One major interaction principle I'd add in Part II

Because there is much more movement here, the **Dynamic Island should never obscure the physical event**.

Its position can actually adapt.

For example:

### Safety scene
Excavator and worker occupy lower-right.

Capsule expands top-left.

### Shovel inspection
Bucket occupies left.

Capsule moves toward top-right.

### Driver scene
Face is right.

Capsule expands left.

### Conveyor
Belt occupies bottom.

Capsule stays top-center.

So it's not literally fixed to one coordinate like Apple's Dynamic Island.

It behaves like a **cinematic annotation system** that knows where the visual subject is.

But every transition retains the same shape/motion language, so it feels like one persistent intelligence element.

---

# The visual rhythm of Part II

I would intentionally make its pacing roughly:

**slow tension → detection → relief → mechanical movement → intimate cab scene → heavy machinery transformation → fast conveyor intelligence.**

Something like:

```text
EXCAVATION
    ↓
    ↓ slower

SAFETY TENSION
    ↓
CV INTERVENTION
    ↓

BUCKET INSPECTION
    ↓

LOADING
━━━━━━━━━━━━ movement begins

HAULAGE
━━━━━━━━━━━━━━━━━━

CAB
    ↓ slower / intimate

FATIGUE EVENT
    ↓

ARRIVE PLANT
━━━━━━━━━━━━

CRUSHING
💥 mechanical transformation

CONVEYOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FOREIGN OBJECT
       ⚠ tension

DETECTION
       ✓

PARTICLE MONITORING
━━━━━━━━━━━━━━━━━━

SORTER AHEAD...
```

That variation is important. Otherwise 10 minutes of scroll-scrubbed animation starts feeling mechanical itself.

---

# One detail I'd particularly preserve from your reference images

Your infographics constantly mix **large mining illustrations with tiny technical doodle annotations**.

That is perfect for this project.

For example, during shovel inspection we shouldn't put a polished SaaS tooltip over the bucket.

Instead:

```text
               missing tooth
                    ↓
              ─────────────
             /
       || || X || ||
```

During particle monitoring:

```text
    180 mm
      ↕
   ╭──────╮
  /        \
  ╰────────╯
```

During proximity:

```text
👷 ---------- 3.1m ---------- 🚜
              ⚠
```

It should almost feel like an engineer is **drawing observations onto the mine as you scroll.**

That continues the exact visual personality of the six references you gave me.

---

# Where Part II finishes

The final viewport should have the optical sorter looming ahead.

Our material passes beneath the first sensor.

One rock gets illuminated.

Another doesn't.

A third receives a different classification.

Then:

```text
                       KEEP ?
                         ╱
 ROCK → SCANNER →───────<
                         ╲
                       REJECT ?
```

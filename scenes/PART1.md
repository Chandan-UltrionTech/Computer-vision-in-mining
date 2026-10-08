# PART I — READING THE ROCK & BREAKING THE BENCH

This part should establish the visual language of the entire website and teach the visitor how the experience works without giving them a tutorial.

It covers roughly the first **25–30% of the complete journey**.

The emotional progression should be:

> **Unknown rock → understand it → decide what matters → break it → measure what we created.**

---

## Before Scene 1: the recurring interaction rule

Before the individual scenes, I would establish one interaction mechanism that we reuse throughout the entire website.

Your Dynamic-Island idea is excellent, but I wouldn't use it as a simple notification.

I would make it the website's **contextual intelligence capsule**.

Initially, it is tiny:

```text
                 ┌───────────┐
                 │  ● CV     │
                 └───────────┘
```

It stays near the top center of the screen, but it is subtle enough that the mine remains dominant.

Whenever a real mining problem occurs, it smoothly morphs.

### State 1 — Something happens physically

For example, on the conveyor later:

```text
rock   rock   rock   🔩   rock
──────────────────────────────→
```

The visitor first sees the **problem**, before the website tells them the solution.

Then the capsule softly expands:

```text
        ┌──────────────────────────────┐
        │ ⚠ FOREIGN OBJECT ON BELT    │
        └──────────────────────────────┘
```

Continue scrolling.

The camera activates.

Detection lines appear.

The same capsule morphs rather than disappearing:

```text
┌───────────────────────────────────────────┐
│ 👁 COMPUTER VISION                        │
│ Conveyor foreign-object                   │
│ & oversize detection                      │
│                                           │
│ Detects abnormal material before it       │
│ reaches critical downstream equipment.   │
└───────────────────────────────────────────┘
```

Continue scrolling again.

It moves into the result:

```text
┌────────────────────────────────┐
│ ✓ OBJECT DETECTED              │
│ Operator alerted • belt action │
└────────────────────────────────┘
```

Then:

```text
        ┌───────────┐
        │ ✓ CV      │
        └───────────┘
```

And the journey continues.

That exact storytelling rhythm should be repeated throughout the site:

> **PHYSICAL EVENT → PROBLEM → CV OBSERVES → CV SOLUTION → OPERATIONAL RESULT → CONTINUE**

Not every one needs the same amount of text, but they share the same grammar.

This is what stops the website from becoming twelve animated cards.

---

# SCENE 01 — “BEFORE WE MOVE A SINGLE TONNE”

## Opening shot

We shouldn't immediately throw the visitor into an explosion.

First, establish the world.

The screen begins almost empty.

Warm-white background.

A few thin black doodle lines begin drawing themselves.

A mountain ridge.

Another ridge.

Bench lines.

Small clouds.

Then an open-pit mine slowly appears as though someone is sketching it live.

Your reference artwork already gives us exactly the style:

- imperfect black strokes
- orange machinery
- white/grey rocks
- large bold typography
- minimal accent colors
- subtle depth

But there are **no infographic cards**.

The illustration *is* the interface.

The opening camera is wide.

Something like:

```text
                  ☁
       ______________________
      /                      \
     /        MINE            \
    /__________________________\

             🚜

       👷                drill
                          │
                          │
                          ▼
```

The headline occupies the empty left portion:

# COMPUTER VISION  
# IN MINING

Then underneath:

**Follow the rock. See where vision becomes intelligence.**

Very little copy.

---

## Scroll begins

As the visitor scrolls, the heading doesn't simply fade away.

The camera physically starts moving toward the drilling operation.

The enormous title gets left behind in the landscape.

This is important.

It creates the feeling:

> “I'm entering this world.”

Rather than:

> “Section 1 disappeared and Section 2 appeared.”

---

# SCENE 02 — “WHAT'S INSIDE THE ROCK?”

### Mining stage
**Exploration / Drilling**

### CV capability
**Drill-core analysis**

---

The camera approaches a drill rig.

The rig is operating.

Its drill rotates slowly.

The vertical drill pipe moves downward as scrolling continues.

Subtle animated debris comes out.

Eventually we transition underground through a doodle cutaway.

```text
      DRILL
        │
        │
────────┼──────── ground
        │
        │
       ╱
      ╱   geological layers
─────╱────────────────
    ╱
───╱──────────────────
```

For a moment, the visitor sees the geology beneath the bench.

This is useful because we're establishing something fundamental:

> Before mining rock, we need to understand what that rock actually is.

---

## Then the core emerges

Instead of cutting to another section, the drill core itself becomes our transition object.

The cylindrical core rises.

Camera follows it.

It gets placed into a core tray.

Now we have the familiar imagery from your 2/6 slide, but interactive.

```text
╔══════════════════════════════╗
║ ███ ███ ███ ███ ███ ███    ║
║ ███ ███ ███ ███ ███ ███    ║
║ ███ ███ ███ ███ ███ ███    ║
╚══════════════════════════════╝
```

At first, it's just rock.

No CV overlay.

---

## Introduce the problem first

Some sections contain:

- fractures
- veins
- discing
- lithology differences

The visitor sees them visually but isn't immediately told what they are.

The contextual capsule wakes up.

```text
┌────────────────────────────────┐
│ ? WHAT IS INSIDE THIS CORE?    │
└────────────────────────────────┘
```

Continue scrolling.

A worker is manually inspecting trays.

Perhaps we briefly show multiple trays extending off-screen.

That communicates the underlying problem:

> enormous amounts of geological material need consistent interpretation.

Without writing an essay.

---

## CV enters

A camera/scan line moves across the trays.

Orange dotted rays appear.

This is the first time we introduce what should become the site's recurring **CV visual language**.

As the scan crosses the core:

black rock remains black/grey.

Computer-vision interpretation appears in orange.

For example:

```text
CORE

██████████╱██████│██████
           ↑      ↑

       fracture   vein

  ────────────── orange outline
```

Fractures receive orange marks.

Veins receive another doodled contour.

Discing gets annotated.

Potential lithology boundaries get dividers.

---

## Dynamic capsule transformation

The small problem capsule now stretches sideways.

Not a pop-up.

Not a modal.

A liquid-like morph.

```text
┌─────────────────────────────────────────────┐
│ 👁 DRILL-CORE ANALYSIS                      │
│                                             │
│ Vision identifies fractures, veins,         │
│ discing and geological features.            │
└─────────────────────────────────────────────┘
```

As the user scrolls another small amount, it changes internally:

```text
┌─────────────────────────────────────┐
│ CORE IMAGE → STRUCTURED GEOLOGY     │
│                                     │
│ Faster logging • scalable review   │
└─────────────────────────────────────┘
```

Then it contracts.

The core tray travels off-screen.

---

# Transition 02 → 03

This transition is important.

We should not simply fade from core tray to mountain.

Instead, take one of the geological boundaries detected in the core.

The orange line extends outward.

It grows across the screen.

As the camera pulls backward, that single line gradually becomes a geological boundary running through the actual mine face.

So:

```text
core fracture line
       ↓

────────────

       ↓

geological seam

       ↓

ENTIRE MINE FACE
```

This makes the transition meaningful:

> microscopic geological understanding becomes operational geological understanding.

---

# SCENE 03 — “ORE OR WASTE?”

### Mining stage
**Mine-face / geological control**

### CV capability
**Ore / waste & grade mapping**

---

Now we're standing in front of an enormous exposed mining face.

Excavators and trucks can exist far away, but they haven't become important yet.

The main character is the rock face.

Initially everything is the same monochrome doodle style.

```text
             ROCK FACE

     /─────────────────────\
    /                       \
   /                         \
  /___________________________\
```

A drone or fixed spectral camera enters.

Its orange dotted rays sweep across the rock face.

---

## First show the operational problem

Different material is visually almost indistinguishable.

The capsule expands:

```text
┌───────────────────────────────────┐
│ ? WHAT SHOULD WE MINE?           │
│                                   │
│ Ore and waste can exist beside   │
│ one another across the face.     │
└───────────────────────────────────┘
```

The message should be short.

The scene does most of the explaining.

---

# Scroll-controlled scan

This could be particularly satisfying.

Imagine scroll distance literally controls the scanning beam.

At 0%:

```text
|SCAN
▼
████████████████████
████████████████████
████████████████████
```

At 50%:

```text
      scan →
████░░░░░░██████████
████░░░░░░██████████
████████████████████
```

At 100% the mine face has gained temporary semantic regions.

But because we want to stay close to your doodle palette, we don't turn this into a rainbow segmentation map.

Use mostly:

- grey
- black
- pale orange
- strong orange
- sparse yellow only where absolutely necessary

For example:

```text
  ╱ ORE ╲        ╱ WASTE ╲
 /orange \      / grey    \
──────────      ────────────

          HIGHER GRADE
             ↑
```

The boundaries should look hand-sketched.

---

## Dynamic capsule morph

```text
┌──────────────────────────────────────────────┐
│ 👁 ORE / WASTE & GRADE MAPPING              │
│                                              │
│ CV + spectral imagery classify material     │
│ zones and estimate grade proxies.           │
└──────────────────────────────────────────────┘
```

Then:

```text
┌──────────────────────────────────────┐
│ ✓ BETTER SELECTIVE MINING           │
│ Reduce dilution • improve decisions │
└──────────────────────────────────────┘
```

Collapse.

---

# A subtle but important storytelling decision

I would **not** leave those colored zones permanently on the mountain.

They exist only while the CV layer is active.

Then they fade back into ordinary rock.

Why?

Because it reinforces:

> The physical mine didn't change.  
> Computer vision changed what we know about it.

That distinction is important throughout the experience.

---

# SCENE 04 — “NOW BREAK IT”

### Mining stage
**Drill & Blast**

No new use case should appear immediately.

This is important.

Not every animation should be:

> problem → AI → problem → AI → problem → AI.

We need moments where the **mining operation itself breathes**.

We know the geology.

Blast holes have been drilled.

The camera pulls backward.

Now we see several blast holes across the bench.

Wires connect them.

An illustrated detonator appears prominently in the foreground.

Something deliberately tactile.

Like:

```text
          ┌─────────┐
          │ HANDLE  │
          │    █    │
          │    █    │
          │         │
          └─────────┘

          PUSH TO BLAST
```

This is one place where I would allow an explicit user interaction.

### First visit:
The user **drags/pushes the handle downward**.

### After that:
scrolling resumes control.

The interaction should not become a barrier. On mobile, a tap or short swipe is sufficient.

---

# Detonation sequence

When triggered:

### Beat 1
Everything becomes unusually still.

### Beat 2
The camera slightly pulls back.

### Beat 3
Small orange pulses travel along blast lines.

```text
•────•────•────•────•
→    →    →    →
```

### Beat 4

**BLAST.**

But keep it in the same doodle language.

Not a photorealistic Hollywood explosion.

Use:

- expanding ink strokes
- orange starburst
- rock fragments
- tiny dust marks
- screen movement of only a few pixels
- subtle scale shift

Something visually related to the blast illustration in your reference.

---

# The most important transition in Part I

The rocks go flying upward.

For a moment the screen is almost entirely filled by fragments.

One large fragment crosses extremely close to the “camera.”

It fills the entire viewport.

```text
       _________
     /           \
    /    ROCK     \
    \             /
     \___________/
```

The camera follows it as it falls.

When it lands—

we discover that hundreds of other rocks have landed around it.

We have seamlessly moved into the fragmentation scene.

No page break.

No fade-to-white.

---

# SCENE 05 — “WAS THAT A GOOD BLAST?”

### Mining stage
**Post-blast fragmentation**

### CV capability
**Blast fragmentation analysis**

---

The dust begins settling.

Initially, the viewer simply sees a giant muckpile.

Large rocks.

Small rocks.

Irregular fragments.

Some oversized boulders.

This is the perfect moment to introduce another principle for the whole experience:

> **Never show the CV solution before the visitor has had time to notice the physical problem.**

Give them perhaps 10–15% of this scene where nothing is labelled.

Let them visually inspect the blast outcome.

Then the capsule wakes up.

```text
┌───────────────────────────────────┐
│ ? DID THE BLAST BREAK THE ROCK   │
│   THE WAY WE WANTED?             │
└───────────────────────────────────┘
```

That is much more understandable to a non-mining audience than immediately saying:

> “PSD estimation.”

---

# Scroll further

A camera appears.

Could be:

- fixed camera,
- shovel camera,
- drone,
- or just an illustrated camera position.

Orange scan lines reach the muckpile.

Then segmentation happens progressively.

This should look beautiful in the doodle visual language.

One fragment gets traced.

Then another.

Then twenty.

Then hundreds.

```text
     ╭────╮   ╭────────╮
    /      \ /          \
   ╰────────╯            ╲
             ╰────────────╯

       ╭──────╮
      /        \
      ╰────────╯
```

All contours are slightly imperfect orange strokes.

---

# Then measurements emerge

Instead of showing ten metrics at once:

First one rock:

```text
       ╭─────────╮
      /           \
     ╰─────────────╯

        184 mm
```

Then three.

Then the whole distribution.

Eventually a tiny hand-drawn chart appears:

```text
SIZE DISTRIBUTION

100% │                    ╭──
     │                ╭───╯
 80% │────────────●───╯       P80
     │
 50% │──────●                 P50
     │
 20% │──●                     P20
     └───────────────────────
             particle size
```

But keep this contextual, next to the muckpile.

Not in a dashboard card.

---

# Dynamic capsule progression

Problem:

```text
┌──────────────────────────────────┐
│ ? BLAST RESULT UNKNOWN          │
└──────────────────────────────────┘
```

Morphs into:

```text
┌─────────────────────────────────────────────┐
│ 👁 BLAST FRAGMENTATION ANALYSIS             │
│                                             │
│ Segment fragments and estimate particle    │
│ size distribution — P20, P50 and P80.      │
└─────────────────────────────────────────────┘
```

Then outcome:

```text
┌─────────────────────────────────────────┐
│ ✓ FRAGMENTATION MEASURED                │
│ Better digging • crusher feed • milling │
└─────────────────────────────────────────┘
```

Then collapse:

```text
              ┌──────┐
              │ ✓ CV │
              └──────┘
```

---

# But we don't leave the scene yet

Now something important happens.

The CV outlines disappear.

The muckpile remains.

Then, from off-screen, we hear/see the visual suggestion of an excavator entering.

First the bucket.

Then the arm.

Then the machine.

```text
                                        ╲
                                         ╲
                                          ╲__
                                         /___\

       ROCK ROCK ROCK ROCK ROCK ROCK
```

At the same time, a worker can be seen much closer to the working area.

This tells the visitor, without text:

> Now that we've blasted the rock, somebody has to move it.

Which leads us directly into **Part II**.

And Part II is where several use cases begin overlapping naturally rather than occurring one-by-one:

**PPE/proximity + shovel monitoring + haulage fatigue + conveyor foreign-object detection + crushing/particle sizing.**

---

# What Part I has accomplished

Notice that we have technically covered only three of your twelve CV capabilities:

**Drill-core analysis**  
**Ore/waste & grade mapping**  
**Blast fragmentation analysis**

Yet the visitor has experienced:

**arrival at mine → drilling → underground geology → core extraction → core inspection → geological mapping → blast preparation → physical detonation → rock fragmentation → CV measurement → excavation beginning**

That difference is exactly what I think you were asking for.

The site isn't saying:

> “Here are Use Cases 1, 2 and 3.”

It is saying:

> **“Here's how mining progresses. Watch what problems appear. Now watch Computer Vision become useful.”**

And the dynamic capsule isn't just decoration. It becomes the bridge between the **real-world event** and the **CV solution**.


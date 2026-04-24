# Station Delta Mobile Ready

Date: 2026-04-24  
Purpose: reusable mobile-hardening guide for every Station Delta sim

## Why This Exists

Cadet mobile review exposed a pattern that will likely repeat across the catalog:
- desktop assumptions survive into phone layout
- the UI may technically "fit" on mobile but still become functionally incomplete
- hidden controls and collapsed panels can remove teaching context or tool access

This document captures what we have learned so far so future mobile passes can be faster, cleaner, and more consistent.

## Core Mobile Principle

On phone, the sim must prioritize:
1. current objective
2. terminal output
3. terminal input

Everything else is secondary.

If a mobile layout protects secondary panels at the cost of the objective, output, or input, it is wrong.

## What We Learned From Cadet

### 1. "Collapsed" can still be broken

A panel can be technically collapsed and still damage the layout by:
- consuming too much vertical space
- leaving behind oversized controls
- hiding the wrong information
- making the screen feel fragmented

Cadet showed that the old mobile collapsed state still left the learner with a cramped, awkward stack.

### 2. Missing features are a mobile bug, not a nice-to-have

On Cadet mobile, these support actions disappeared from the visible top bar:
- `MAN PAGES`
- `GLOSSARY`
- `ACHIEVEMENTS`
- `RESTART`

That is not just a styling tradeoff. It is a functional regression.

Rule:
- if desktop has an action, mobile must preserve access to it somewhere intentional

### 3. The scrolling guidance strip matters

The L.O.L.A. strip is not decoration. It provides:
- ambient coaching
- reminders
- learning orientation
- emotional continuity

When it was auto-hidden on mobile, the phone build lost part of the teaching system.

Rule:
- do not auto-hide the guidance strip on mobile unless it is replaced by an equally visible teaching surface

### 4. Desktop mental models do not translate directly

Cadet still carried the desktop assumption of "teacher in the box to the right."

On phone:
- there is no meaningful "right"
- stacked panels compete for the same vertical space
- the terminal can quickly stop feeling like the primary surface

Rule:
- on mobile, think in vertical priority order, not desktop panel inheritance

### 5. Saved state can preserve old mobile mistakes

Even after layout defaults change, existing saved sessions may still carry stale UI preferences.

Cadet needed a one-time mobile UI migration so old sessions would stop loading with the strip hidden by default.

Rule:
- when mobile defaults change, consider whether saved state needs migration too

## Cadet-Specific Issues Observed

From screenshot review and code inspection:
- collapsed mobile state hid too much instructional context
- expanded state consumed too much vertical space
- current-step information felt fragmented
- right-panel collapse control looked too heavy on phone
- terminal workspace felt cramped
- scrolling strip was no longer visible
- support tools were inaccessible from the top bar

## Cadet Fixes Applied

These changes are now part of the mobile-ready baseline:

1. Preserve the scrolling L.O.L.A. strip on mobile by default.
2. Keep the right panel collapsed by default on mobile.
3. Add a mobile `TOOLS` entry point for:
- man pages
- glossary
- achievements
- restart
4. Add a one-time mobile UI migration so old saved sessions stop suppressing the strip.
5. Tighten the mobile top bar so the condensed controls fit more intentionally.

## Mobile-Ready Rules For All Sims

### A. Priority Stack

Every mobile sim should show, in this order:
1. top identity / minimal controls
2. current objective
3. terminal output
4. terminal input
5. secondary tools on demand

### B. Preserve Feature Access

If the top bar gets condensed on mobile, provide a replacement path for every hidden action.

Preferred pattern:
- one compact `TOOLS` button
- modal or drawer with hidden utility actions

### C. Keep Guidance Visible

At least one of these must remain visible on first mobile load:
- objective card
- compact L.O.L.A. strip
- equivalent inline teaching surface

Do not ship a phone layout where the learner must expand a panel just to understand what to do.

### D. Collapse Secondary Panels, Not Core Learning Surfaces

Good collapse candidates:
- unlocked commands
- telemetry
- crew panels
- deep reference surfaces

Bad collapse candidates:
- current objective
- input row
- active terminal output
- primary teaching orientation

### E. Mobile Buttons Must Be Light, Not Dominating

Controls like `Collapse` / `Expand` should not look like giant blocking cards.

Target behavior:
- compact
- clear
- reachable
- visually secondary to the objective and terminal

### F. Old Saved State Must Not Re-break New Mobile Defaults

When changing mobile defaults:
- evaluate saved preferences
- migrate stale mobile UI values if needed
- test resume behavior, not just fresh boot

## Recommended Implementation Pattern

When adapting another sim:

1. Keep the right-side support panel collapsed by default on mobile.
2. Keep the guidance strip visible unless there is a better mobile replacement.
3. Move hidden desktop controls into a mobile tools modal/drawer.
4. Shrink top-bar density before removing capability.
5. Preserve objective + terminal + input as the primary visible stack.

## Red Flags

If you see any of these on phone, the sim is not mobile-ready:
- the learner cannot see the objective without expanding something
- the terminal input is visible but the task context is not
- utility features disappear entirely
- the guidance strip is hidden by default
- a collapsed panel still occupies large vertical space
- the terminal looks secondary to support panels
- resume loads into an outdated or broken mobile state

## Fast Audit Checklist

Run this on every sim before calling mobile done:

1. Can I see the current objective immediately on phone?
2. Can I see where to type immediately on phone?
3. Is the terminal output still readable after the page loads?
4. Are `man`, glossary/help/reference surfaces still reachable?
5. Is restart still reachable?
6. Is the guidance strip visible or intentionally replaced?
7. Does the right panel collapse to something truly compact?
8. Does expand/collapse feel lightweight?
9. Does resumed state behave the same as fresh mobile boot?
10. Does any panel block the terminal or steal too much vertical space?

## Rollout Order

Use Cadet as the reference implementation, then apply the same review sequence to:
1. Engineer
2. Lieutenant
3. officer-track sims
4. Captain

## What Still Needs Follow-Up

Cadet is improved, but not fully solved yet.

Still worth a second pass:
- objective/terminal vertical balance
- right-panel visual weight on mobile
- expanded-state space consumption
- whether the objective card should remain permanently visible while L.O.L.A. becomes the collapsible surface

## One-Line Rule

A Station Delta sim is mobile-ready only when the learner can understand the task, access the tools, and type immediately without hunting through collapsed UI.

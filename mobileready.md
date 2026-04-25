# Station Delta Mobile Ready

Date: 2026-04-25  
Purpose: reusable mobile-hardening guide for every Station Delta sim

---

## Why This Exists

Cadet mobile review exposed a pattern that will likely repeat across the catalog:
- desktop assumptions survive into phone layout
- the UI may technically "fit" on mobile but still become functionally incomplete
- hidden controls and collapsed panels can remove teaching context or tool access

Two rounds of playtesting have now produced a stable, tested baseline. This document captures the full outcome so future mobile passes can be faster, cleaner, and more consistent.

---

## Core Mobile Principle

On phone, the sim must prioritize:
1. current objective
2. terminal output
3. terminal input

Everything else is secondary.

If a mobile layout protects secondary panels at the cost of the objective, output, or input, it is wrong.

---

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

Rule: if desktop has an action, mobile must preserve access to it somewhere intentional.

### 3. The scrolling guidance strip matters

The L.O.L.A. strip is not decoration. It provides:
- ambient coaching
- reminders
- learning orientation
- emotional continuity

When it was auto-hidden on mobile, the phone build lost part of the teaching system.

Rule: do not auto-hide the guidance strip on mobile unless it is replaced by an equally visible teaching surface.

### 4. Desktop mental models do not translate directly

Cadet still carried the desktop assumption of "teacher in the box to the right."

On phone:
- there is no meaningful "right"
- stacked panels compete for the same vertical space
- the terminal can quickly stop feeling like the primary surface

Rule: on mobile, think in vertical priority order, not desktop panel inheritance.

### 5. Saved state can preserve old mobile mistakes

Even after layout defaults change, existing saved sessions may still carry stale UI preferences.

Cadet needed a one-time mobile UI migration so old sessions would stop loading with the strip hidden by default.

Rule: when mobile defaults change, consider whether saved state needs migration too.

### 6. Toggle controls must survive the thing they toggle (second playtest finding)

A hide/dismiss button placed inside its own target element creates a deadlock: once the element is hidden, the button disappears with it and there is no recovery path. This was found on Cadet when the "Hide" button inside the L.O.L.A. strip hid the strip — and itself — permanently until a page reload.

Rule: any control that can hide or collapse a surface must live outside that surface, in a location that is always visible regardless of that surface's state.

### 7. Compound state produces unhandled grid layouts (second playtest finding)

When multiple UI states are toggled independently — such as strip hidden and right panel collapsed — their CSS classes combine on the shell element. If only single-state overrides are defined in the stylesheet, compound states resolve to unpredictable cascades. On Cadet, having both `strip-hidden` and `right-collapsed` active simultaneously caused the `1fr` terminal row to compress incorrectly because no rule covered that combination.

Rule: define explicit CSS rules for every meaningful combination of layout state classes on the shell element.

### 8. Step context (`ctx`) is invisible in the expanded mobile panel (second playtest finding)

The step context text lives in the objective card in the top panel. On mobile the top panel is already crowded with phase label, objective title, command row, and meta — the context is often pushed below the visible fold or overlooked entirely. When a learner expands the bottom panel looking for more information, there is nothing there to orient them.

Rule: mirror the current step's objective title and context text into the expanded bottom panel as a named "Current Objective" section. Keep it read-only and always in sync with the objective card.

---

## Cadet Fixes Applied (Full Baseline — Both Rounds)

These changes are now the mobile-ready baseline. Every subsequent sim should ship with all of these in place.

**Round 1**

1. Preserve the scrolling L.O.L.A. strip on mobile by default.
2. Keep the right panel collapsed by default on mobile.
3. Add a mobile `TOOLS` entry point (modal or drawer) covering: man pages, glossary, achievements, restart.
4. Add a one-time mobile UI migration so old saved sessions stop suppressing the strip.
5. Tighten the mobile top bar so the condensed controls fit more intentionally.

**Round 2**

6. Add a persistent strip toggle button to the top bar — outside the strip — so the strip can always be recovered after being hidden. Style it to reflect current strip state (active color when strip is on, muted when off).
7. Define explicit CSS grid-row rules for all compound shell state combinations:
   - default
   - strip hidden only
   - right panel collapsed only
   - both hidden and collapsed
8. Add a "Current Objective" section to the top of the expanded bottom panel. It mirrors `step.obj` and `step.ctx` from the objective card and updates in sync via `syncObjCard()`. Hidden on desktop. Hidden inside the 52px collapsed strip where there is no room.

---

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

Preferred pattern: one compact `TOOLS` button that opens a modal or drawer containing all hidden utility actions.

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

Target behavior: compact, clear, reachable, and visually secondary to the objective and terminal.

### F. Old Saved State Must Not Re-break New Mobile Defaults

When changing mobile defaults:
- evaluate saved preferences
- migrate stale mobile UI values if needed
- test resume behavior, not just fresh boot

### G. Every Toggle Control Must Live Outside Its Target

If a button hides, collapses, or dismisses a surface, that button must be placed somewhere that remains visible after the action is taken. Do not place the only recovery path inside the thing being hidden.

### H. Define All Compound Layout States

When the shell element carries multiple state classes, define CSS for every combination that can realistically occur. Do not rely on cascade resolution for compound states — it produces inconsistent and fragile results across phones and orientations.

### I. Mirror Step Context Into the Expanded Panel

The bottom panel is where mobile learners go for more information. If it contains only unlocked commands and telemetry, it teaches nothing. Always include a read-only "Current Objective" block at the top of the expanded panel showing at minimum:
- the step objective title
- the step context (`ctx`) text

---

## Recommended Implementation Pattern

When adapting another sim, apply these in order:

1. Keep the right-side support panel collapsed by default on mobile.
2. Keep the guidance strip visible unless there is a better mobile replacement.
3. Move hidden desktop controls into a mobile tools modal/drawer.
4. Shrink top-bar density before removing capability.
5. Preserve objective + terminal + input as the primary visible stack.
6. Add a persistent strip toggle to the top bar that lives outside the strip.
7. Define all four compound CSS grid states on the shell element.
8. Add a "Current Objective" mirror section to the top of the expanded bottom panel, wired to `syncObjCard()` or its equivalent.

---

## CSS Reference: Shell Grid States (Mobile)

Copy and adapt this block for each sim. Replace `48px 28px` with the sim's actual topbar and strip heights.

```css
@media (max-width: 820px) {
  /* Default mobile: topbar | strip | terminal | bottom panel */
  #shell { grid-template-rows: 48px 28px 1fr 170px; }

  /* Strip hidden: reclaim the strip row */
  #shell.strip-hidden { grid-template-rows: 48px 0px 1fr 170px; }

  /* Right panel collapsed */
  #shell.right-collapsed { grid-template-rows: 48px 28px 1fr 52px; }

  /* Both hidden and collapsed */
  #shell.right-collapsed.strip-hidden { grid-template-rows: 48px 0px 1fr 52px; }
}
```

---

## HTML Reference: Persistent Strip Toggle Button

Place this in the top bar, after the TOOLS button. The `applyUIPreferences()` function (or its equivalent) must update `textContent`, `title`, `aria-label`, and the `strip-is-hidden` class to reflect current state.

```html
<button
  id="mobile-strip-toggle-btn"
  aria-label="Toggle L.O.L.A. guidance strip"
  onclick="toggleStripDismiss()"
  title="Show/hide L.O.L.A. strip">
  ⬡
</button>
```

```css
#mobile-strip-toggle-btn {
  display: none; /* shown only at mobile breakpoint */
  width: 30px; height: 30px;
  background: var(--green-bg);
  border: 1px solid var(--green-d);
  color: var(--green);
  border-radius: var(--r4);
  font-size: 14px;
  cursor: pointer;
}
#mobile-strip-toggle-btn.strip-is-hidden {
  background: var(--s2);
  border-color: var(--b2);
  color: var(--muted2);
}
@media (max-width: 820px) {
  #mobile-strip-toggle-btn { display: inline-flex; }
}
```

---

## HTML Reference: Expanded Panel Objective Mirror

Place this as the first child inside the right panel, after the header row and before the unlocked commands section. Hidden on desktop via `display:none`, revealed on mobile.

```html
<div id="mobile-ctx-section">
  <div id="mobile-ctx-label">📍 Current Objective</div>
  <div id="mobile-ctx-title"></div>
  <div id="mobile-ctx-body"></div>
</div>
```

```css
#mobile-ctx-section {
  display: none; /* desktop: hidden */
  flex-shrink: 0;
  padding: 10px 13px 12px;
  border-bottom: 1px solid var(--border);
  background: var(--blue-bg);
  border-left: 2px solid var(--blue-d);
}
#mobile-ctx-label {
  font-size: 9px; text-transform: uppercase; letter-spacing: .12em;
  color: var(--blue); margin-bottom: 5px; font-weight: 700;
}
#mobile-ctx-title {
  font-size: 12px; font-weight: 600; color: var(--text);
  margin-bottom: 5px; line-height: 1.4;
}
#mobile-ctx-body {
  font-size: 11px; color: var(--muted2); line-height: 1.7;
}
@media (max-width: 820px) {
  #mobile-ctx-section { display: block; }
}
```

Wire it into the objective sync function:

```js
function syncObjCard() {
  const mCtxTitle = document.getElementById('mobile-ctx-title');
  const mCtxBody  = document.getElementById('mobile-ctx-body');
  // ... existing obj-card sync ...
  if (mCtxTitle) mCtxTitle.textContent = s.obj || '';
  if (mCtxBody)  mCtxBody.innerHTML    = s.ctx || '';
}
```

---

## JS Reference: applyUIPreferences — Strip Toggle Sync

Add this block inside `applyUIPreferences()` to keep the topbar strip toggle in sync:

```js
const mobileStripBtn = document.getElementById('mobile-strip-toggle-btn');
if (mobileStripBtn) {
  mobileStripBtn.title = G.stripHidden
    ? 'Show L.O.L.A. strip'
    : 'Hide L.O.L.A. strip';
  mobileStripBtn.setAttribute('aria-label', G.stripHidden
    ? 'Show L.O.L.A. guidance strip'
    : 'Hide L.O.L.A. guidance strip');
  mobileStripBtn.classList.toggle('strip-is-hidden', !!G.stripHidden);
}
```

---

## Red Flags

If you see any of these on phone, the sim is not mobile-ready:
- the learner cannot see the objective without expanding something
- the terminal input is visible but the task context is not
- utility features disappear entirely
- the guidance strip is hidden by default
- a collapsed panel still occupies large vertical space
- the terminal looks secondary to support panels
- resume loads into an outdated or broken mobile state
- hitting "Hide" on the strip leaves no way to get it back
- toggling two layout states simultaneously causes the terminal to compress
- the expanded bottom panel contains nothing that orients the learner

---

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
11. If I hide the strip, can I get it back without reloading?
12. If I hide the strip AND collapse the panel, does the terminal remain full-height?
13. Does the expanded bottom panel show the current step's objective and context?

---

## Rollout Order

Use Cadet as the reference implementation, then apply the same review sequence to:
1. Engineer
2. Lieutenant
3. officer-track sims
4. Captain

For each sim, complete the full Round 1 + Round 2 baseline before playtesting. Items 6, 7, and 8 of the implementation pattern are now part of the baseline, not optional follow-up.

---

## What Still Needs Follow-Up

Cadet is significantly improved after two rounds, but not fully resolved.

Still worth a second pass on Cadet before treating it as complete:
- objective/terminal vertical balance — the action-rail can still crowd the terminal on shorter phones
- right-panel visual weight on mobile — the Expand/Collapse button is functional but heavier than ideal
- expanded-state space consumption — 170px for the bottom panel may be too much on small phones (375px height)
- whether the objective card should be permanently pinned while L.O.L.A. becomes the collapsible surface instead

---

## One-Line Rule

A Station Delta sim is mobile-ready only when the learner can understand the task, access the tools, and type immediately — without hunting through collapsed UI, and without any toggle leaving them stranded with no way back.

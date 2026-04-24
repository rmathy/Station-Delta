# Class in Session Protocol
### Version 2.0 — Updated with Accessibility Pass and Automated QA Integration

Human-in-the-loop release protocol for every Station Delta course before marking it "live".

---

## Purpose

Prevent pedagogy drift, false-pass command logic, and narrative inconsistency by requiring a repeatable instructor QA pass.

---

## Required Inputs

- Current course HTML file (`vibe-<coursename>.html`)
- Pedagogy matrix
- Master prompt
- 9.5 gate rubric (v2.0+)
- Course cheat sheet (Answer + Provenance)
- `station-delta.spec.ts` Playwright suite

---

## Pass Structure

### 1. Pass A — Pedagogy Contract
- Verify each step has objective, context, hint, and explicit or scenario-derivable answer path.
- Verify vocabulary is defined before first use (command/argument/flag/subcommand/etc.).
- Verify phase checkpoint behavior exists and resume is stable.
- Verify LOLA/J.A.N.E.T. role separation remains intact.
- Verify spaced repetition callbacks are present in phases 3+ — prior concepts surface under new pressure.
- Verify difficulty slope is consistent within and across phases; flag any unexplained spikes.

---

### 2. Pass B — Command Acceptance Robustness
For each step/challenge/boss item, run:
- True positive test (exact expected answer).
- Near-variation test (valid realistic variation).
- False-positive test (incorrect but plausible command).
- Tighten `acceptFn` where false positives pass.
- Confirm minimum **3 DIAGNOSE patterns** are documented per step.
- Confirm no step ships with only generic "try again" feedback — every wrong-answer response must be directional.
- Manually verify all `acceptFn` logic — check for unclosed strings, regex edge cases, and overly permissive matchers.

---

### 3. Pass B.5 — Friction & Clarity
- Validate wrong-answer coaching quality (warmth + direction, not generic error spam).
- Validate hint behavior (discoverable, non-spammy, counted once per step).
- Validate no duplicated JIT/bridge cards or missing real-world connection cards.
- Validate running text / ticker animations have a visible pause or dismiss control.
- Validate side panels have a minimize or collapse control.
- Validate terminal zone expands dynamically to fill available viewport.

---

### 4. Pass C — Narrative & UI Consistency
- Confirm course identity (color/emoji/boot style) remains unique.
- Confirm glossary/manual/career impact/achievements reflect this course content (not copied leftovers).
- Confirm no stale cross-course terms (`manifest.txt`, wrong server names, wrong callsigns, wrong ship names, etc.).
- Confirm easter eggs are present, discoverable, and thematically coherent with the Station Delta universe.
- Confirm boss fight (J.A.N.E.T. final assessment) has emotional weight and narrative payoff — not just a scoring screen.

---

### 5. Pass D — Accessibility & Cross-Device *(new)*
- Confirm terminal output div has `aria-live="polite"` and `role="log"`.
- Confirm all interactive elements are keyboard navigable — no mouse-only interactions.
- Confirm color is never the sole indicator of state — errors, success states, and warnings all have text or icon accompaniment.
- Confirm font size and contrast meet WCAG 2.1 AA minimum standards on primary UI elements.
- Confirm no content flashes more than 3 times per second.
- **Physical device mobile test required** — emulator alone does not satisfy this pass.
  - No floating or overlapping UI elements blocking the terminal.
  - Input fields receive correct focus without requiring a manual tap after page interaction.
  - Touch targets are minimum 44x44px.
  - Scroll behavior is natural — no scroll trapping or clipped inputs.
- Confirm focus management is stable after modal open/close cycles.

> **Critical fail condition:** Terminal output has no `aria-live` attribute, OR mobile layout produces floating elements that block the terminal. Either condition = automatic hold until resolved.

---

### 6. Pass E — Analytics & Deployment Verification *(new)*
- Open DevTools → Network tab. Run a full guided playthrough.
- Confirm POST requests are firing to the webhook endpoint.
- Confirm at least one real session row appears in the Station Delta Analytics sheet within 60 seconds of playthrough completion.
- Confirm all Vercel environment variables are set correctly in the production deployment — not just local dev.
- Confirm no console errors during full playthrough on production URL (not localhost).

---

## Automated QA — Playwright Suite
Run `station-delta.spec.ts` against the production URL before merge.

**Primary flow test must pass:**
- Navigation to landing page
- CTA click and callsign entry
- Terminal input and response confirmation

**Advanced QA checks must pass:**
- aria-live attribute present on `#output`
- UI overflow / stress test — long input does not break layout
- State persistence documented (note: expected behavior is return to landing on refresh until cloud saves are live)

> If any Playwright assertion fails, document the failure with a screenshot and resolve before proceeding to gate scoring.

---

## Scoring Gate (9.5)

- Score all rubric categories per 9.5 Gate Rubric v2.0.
- Any category `< 9.0` is automatic hold.
- Weighted total must be `>= 9.5` to mark live.
- If hold: document top 3 deltas and apply targeted close patch.

---

## Mandatory Artifacts Per Course

- `Course-Cheat-Sheet.md` (answers + provenance labels)
- `QA-Sweep-Report.md` (findings, deltas, fixes)
- `Playwright-Run-Log.md` (suite output, pass/fail per assertion)
- `Accessibility-Check-Log.md` (aria-live confirmed, keyboard nav verified, mobile device tested)
- `Analytics-Confirmation.md` (screenshot or export of first real session row in analytics sheet)
- Updated timeline note if scope/cost/schedule changed

---

## Suggested Provenance Labels

- `Explicit`: taught directly before use
- `Reinforced`: taught earlier in course and recalled
- `Scenario`: derivable from output/context shown at point of need
- `Common`: assumed baseline at this rank (must be minimal)

---

## Release Checklist

- [ ] Pass A complete — pedagogy contract verified
- [ ] Pass B complete — command acceptance robustness verified
- [ ] Pass B.5 complete — friction and clarity verified
- [ ] Pass C complete — narrative and UI consistency verified
- [ ] Pass D complete — accessibility and cross-device verified (physical device tested)
- [ ] Pass E complete — analytics and deployment verified
- [ ] Playwright suite green (`station-delta.spec.ts` — all assertions pass or failures documented)
- [ ] 9.5 gate passed (weighted total >= 9.5, no category below 9.0)
- [ ] Cheat sheet updated
- [ ] QA sweep report written
- [ ] Playwright run log saved
- [ ] Accessibility check log saved
- [ ] Analytics confirmation saved
- [ ] Commit + push tagged for milestone

---

## FETC / External Presentation Reference

> *This protocol is cited in the FETC 2027 session "Stop Consuming AI. Start Producing With It." as the human-in-the-loop release standard applied to every Station Delta simulation. Five structured passes — pedagogy contract, command robustness, friction and clarity, narrative consistency, accessibility, and deployment verification — are required before any simulation is marked live.*
>
> *The protocol enforces the principle that rigorous quality standards and solo development are not mutually exclusive. Every simulation visible at station-delta-one.vercel.app has cleared all five passes and scored 9.5 or higher on the weighted gate rubric.*
>
> *For BAE Systems and enterprise procurement contexts: this document represents Station Delta's human-in-the-loop quality management process. Available upon request as part of due diligence review.*

---

*Station Delta — Operational Readiness Training | station-delta-one.vercel.app*
*Protocol v2.0 — Updated April 2026*

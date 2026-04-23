# Vibe Lieutenant Alignment Outline

Date: 2026-04-23  
Target file: `vibe-lieutenant.html`  
Goal: Bring Lieutenant into full compliance with Pedagogy Matrix + Master Prompt + 9.5 gate while keeping Lieutenant color/emoji identity unchanged.

## Quick Playthrough Verdict
- **Universe fit:** strong base. LOLA/JANET dynamic, command rhythm, challenge/break-it flow, and right-lane support surfaces already feel like Station Delta.
- **Biggest gap:** Lieutenant is missing the newer system contracts already expected across Cadet/Engineer (phase checkpoints, analytics contract, step-level guidance routing).
- **Risk to July 1 beta:** medium-high if unaddressed, because these are structural consistency requirements, not copy polish.

## Priority Findings (mapped to docs)

### P0 — Must Fix Before Lieutenant Expansion
1. **No phase checkpoint modal / safe stop boundary**
- Current behavior auto-starts next phase (`completePhase` increments and triggers `startPhase` immediately).
- Evidence: `completePhase` auto-transition in `vibe-lieutenant.html` around `G.phase++; ... setTimeout(startPhase,900)`.
- Contract conflict: Master Prompt requires explicit `START NEXT PHASE` / `TAKE A BREAK` + pending resume state.

2. **Analytics contract not implemented**
- Current telemetry is visual log only (`telem(...)`), no `G.analytics`, no required event schema, no `window.vibeAnalytics.*` API.
- Evidence: simple `telem()` and `save/load` localStorage only.
- Contract conflict: Master Prompt analytics/backend requirement.

3. **Step guidance routing is still ctx-echo based**
- L.O.L.A panel is set with raw `ctx` (`setLola(next.ctx)`), no step-specific computed coaching layer.
- Evidence: in `handleCorrect` and `continuePhaseStart`.
- Contract conflict: `lolaMessageForStep`-style rule and distinct guidance surfaces.

### P1 — High Impact Pedagogy/UX Consistency
4. **LOLA strip taxonomy not aligned to approved tags**
- Uses tags like `WELCOME`, `REMEMBER`, `PHASE 1`, `LOLA`.
- Contract expects taxonomy: `tip`, `concept`, `new!`, `warning`, `habit`, `syntax`, `shortcut`, `command`.

5. **Duplicate JIT behavior creates repetition**
- First step JIT/bridge shown at phase start and then shown again on correct handling.
- Evidence: `continuePhaseStart` and `handleCorrect` both call `showJIT` for same step.

6. **Some accept functions over-accept partial answers**
- Example: `p9s2` accepts `git add` or `git commit` alone, despite objective requiring staged commit flow.
- Contract conflict: multi-step tasks must not pass on partial completion.

7. **Boss/challenge checks too permissive in places**
- Some boss/challenge accepts pass on broad keywords (e.g., generic `review`, `git add`, etc.).
- 9.5 risk: false positives reduce assessment credibility.

### P2 — Tier Tuning (Engineer -> Lieutenant progression)
8. **Phase 1 still feels too tutorial for post-Engineer learners**
- Good content, but should be compressed into recall-under-load instead of full beginner-style pacing.
- Align with Engineer->Lieutenant move map: less syntax re-teach, more prioritization decisions.

9. **No explicit “recall vs new depth” signaling**
- Matrix expects clear transition language showing what is review and what is new operational depth.

## Implementation Plan (3 passes)

## Pass A — Structural Contract (P0)
1. Add checkpoint modal and state:
- Add `G.pendingPhaseStart`.
- At phase completion, stop auto-start; open checkpoint modal with:
  - `START NEXT PHASE`
  - `TAKE A BREAK`
- Persist and restore pending phase state on reload.

2. Add analytics engine scaffold:
- Add `COURSE_ID` and `G.analytics`.
- Fire events: `phase_started`, `phase_completed`, `step_started`, `step_attempt`, `step_completed`, `command_entered`.
- Add `window.vibeAnalytics` methods:
  - `getRaw`, `getTTRReport`, `getHeatmapReport`, `getGanttReport`, `getSnapshot`, `exportJSON`.

3. Add step-specific LOLA guidance function:
- Implement `lolaMessageForStep(step, phase, attemptState)`.
- Replace direct `setLola(step.ctx)` routing with computed guidance.

## Pass B — Pedagogy Quality (P1)
4. Normalize LOLA strip tags to approved taxonomy while keeping Lieutenant tone.
5. Fix JIT duplication:
- Add `jitPreOnly` / `jitAfter` routing or equivalent guard so first-step context appears once intentionally.
6. Harden multi-step acceptance:
- Convert compound objectives (notably P9 and boss flow) to ordered multi-step checks.
7. Tighten challenge/boss `acceptFn` patterns to reduce keyword-only passes.

## Pass C — Progression & Flavor (P2)
8. Rework Lieutenant Phase 1 to “Engineer recall under pressure”:
- Keep command set.
- Increase decision framing.
- Reduce answer-forward copy.
9. Add “Review / New Depth / Leadership Signal” markers in each phase intro/strip.
10. Keep current Lieutenant accent palette and emoji unchanged (explicit non-goal: no visual re-theme).

## Concrete Ticket List
- `LT-01` Checkpoint modal + pending resume.
- `LT-02` Analytics schema + browser API.
- `LT-03` Step-level LOLA guidance router.
- `LT-04` Strip tag taxonomy normalization.
- `LT-05` JIT duplication fix.
- `LT-06` Multi-step acceptance hardening for P9 + boss.
- `LT-07` Challenge/break-it false-positive cleanup.
- `LT-08` Phase 1 compression to recall-under-load.
- `LT-09` Phase intros add review/new-depth markers.

## Exit Criteria (Lieutenant Ready)
- Checkpoint modal works between every phase and survives reload.
- Analytics methods return valid reports without errors.
- No compound objective passes on partial command.
- No duplicated first-step teaching cards.
- LOLA strip tags use approved taxonomy.
- Lieutenant playthrough feels like a clear progression from Engineer, not a repeat.

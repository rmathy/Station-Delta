# Class in Session Protocol

Human-in-the-loop release protocol for every Station Delta course before marking it "live".

## Purpose

Prevent pedagogy drift, false-pass command logic, and narrative inconsistency by requiring a repeatable instructor QA pass.

## Required Inputs

- Current course HTML file (`vibe-<coursename>.html`)
- Pedagogy matrix
- Master prompt
- 9.5 gate rubric
- Course cheat sheet (Answer + Provenance)

## Pass Structure

1. **Pass A — Pedagogy Contract**
- Verify each step has objective, context, hint, and explicit or scenario-derivable answer path.
- Verify vocabulary is defined before first use (command/argument/flag/subcommand/etc.).
- Verify phase checkpoint behavior exists and resume is stable.
- Verify LOLA/J.A.N.E.T. role separation remains intact.

2. **Pass B — Command Acceptance Robustness**
- For each step/challenge/boss item, run:
- True positive test (exact expected answer).
- Near-variation test (valid realistic variation).
- False-positive test (incorrect but plausible command).
- Tighten `acceptFn` where false positives pass.

3. **Pass B.5 — Friction & Clarity**
- Validate wrong-answer coaching quality (warmth + direction, not generic error spam).
- Validate hint behavior (discoverable, non-spammy, counted once per step).
- Validate no duplicated JIT/bridge cards or missing real-world connection cards.

4. **Pass C — Narrative & UI Consistency**
- Confirm course identity (color/emoji/boot style) remains unique.
- Confirm glossary/manual/career impact/achievements reflect this course content (not copied leftovers).
- Confirm no stale cross-course terms (`manifest.txt`, wrong server names, etc.).

## Scoring Gate (9.5)

- Score all rubric categories.
- Any category `< 9.0` is automatic hold.
- Weighted total must be `>= 9.5` to mark live.
- If hold: document top 3 deltas and apply targeted close patch.

## Mandatory Artifacts Per Course

- `Course-Cheat-Sheet.md` (answers + provenance labels)
- `QA-Sweep-Report.md` (findings, deltas, fixes)
- Updated timeline note if scope/cost/schedule changed

## Suggested Provenance Labels

- `Explicit`: taught directly before use
- `Reinforced`: taught earlier in course and recalled
- `Scenario`: derivable from output/context shown at point of need
- `Common`: assumed baseline at this rank (must be minimal)

## Release Checklist

- [ ] Pass A complete
- [ ] Pass B complete
- [ ] Pass B.5 complete
- [ ] Pass C complete
- [ ] 9.5 gate passed
- [ ] Cheat sheet updated
- [ ] QA report written
- [ ] Commit + push tagged for milestone

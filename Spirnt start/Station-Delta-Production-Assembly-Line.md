# Station Delta Production Assembly Line

Date: 2026-04-24  
Role: Production manager operating guide for all Station Delta sim work  
Scope: Cadet, Engineer, Lieutenant now; reusable for the full 13-course catalog

## Purpose

This document turns the current Station Delta standards into one airtight operating line so work does not drift between "idea", "build", "QA", "evidence", and "release".

Use this as the single source of truth for:
- what gets worked on next
- what counts as done
- what evidence must exist before a sim is treated as release-ready
- what can be done on a restricted network versus a home/open network

## Non-Negotiables

1. No sim is "live" without clearing the Class-in-Session protocol.
2. No sim passes the gate unless weighted score is `>= 9.5` and no category is `< 9.0`.
3. No critical item on the release checklist may remain `HOLD` if the decision is `GO`.
4. No feature slice is considered complete until its evidence artifacts are updated.
5. Restricted-network blockers are documented, not hand-waved.
6. Unrelated local edits are never reverted as part of production flow.

## The Assembly Line

### Station 0: Intake and Triage

- classify the work: `Curriculum`, `UX / Hardening`, `Acceptance / Logic`, `Analytics / Evidence`, or `Release / Verification`
- define the one-sentence problem
- name the exact files in scope
- declare whether the task is restricted-safe or home-network dependent

### Station 1: Spec Before Build

- define learner outcome
- define scope in and scope out
- define testable acceptance criteria
- define evidence required after implementation

If acceptance criteria are not testable, the slice is not ready to build.

### Station 2: Build the Smallest Shippable Slice

- keep changes scoped by feature slice
- protect terminal-first workflow
- preserve Station Delta patterns
- if pedagogy changes become stricter, acceptance logic must tighten too

### Station 3: Static Self-Check

Before QA, verify:
- no stale cross-course references
- no untaught assessed concepts
- no missing transfer language for sim-only commands
- no phase promise exceeds what `acceptFn` enforces

For Lieutenant-specific work:
- do not reteach Engineer
- do not drift into Captain territory

### Station 4: Pass A Through C

Run:
- `Pass A`: pedagogy contract
- `Pass B`: command acceptance robustness
- `Pass B.5`: friction and clarity
- `Pass C`: narrative and UI consistency

Patch before moving on if any critical drift appears.

### Station 5: Accessibility and Mobile Hardening

Restricted-network preflight:
- `cd Playtesting && npm run qa:static`

This must verify:
- `aria-live="polite"`
- `role="log"`
- analytics client wiring
- analytics event contract
- checkpoint/resume markers
- mobile hardening markers

Physical-device validation still required later:
- no floating overlays
- reliable focus
- 44x44 minimum touch targets
- natural scroll
- focus restore after modal close

Cadet is the hardening template. Engineer and Lieutenant should inherit proven Cadet patterns.

### Station 6: Analytics and Evidence Integrity

Restricted-network checks:
- confirm `window.vibeAnalytics` exists
- inspect `getRaw()` and derived reports
- verify client wiring is present

Home-network checks:
- verify POSTs to `/api/analytics-ingest`
- verify production env vars
- verify sheet row appears

If the sheet is unclear but production POSTs are visible, capture network evidence before declaring analytics broken.

### Station 7: Release Verification

The five critical items are:
1. Playtesting suite green
2. Console hygiene clean
3. Checkpoint/resume stress stable
4. Analytics pipeline reliable
5. Mobile physical-device run clean

If any item is not `PASS`, final decision is `NO-GO`.

### Station 8: Artifact Lock

Mandatory artifacts per course:
- cheat sheet
- QA sweep report
- Playwright run log
- accessibility check log
- analytics confirmation
- rubric score table

If code changed and evidence docs did not, the slice is incomplete.

### Station 9: Commit, Push, and State Capture

Before commit:
- report what files are staged
- confirm why each staged file belongs
- avoid unrelated files

After push:
- record current status
- record blockers
- record next actions

## Restricted-Network Mode

Do here:
- curriculum revision
- acceptance tightening
- mobile hardening
- offline evidence preflight
- artifact drafting

Do not fake-complete:
- production Playwright
- production console checks
- webhook/sheet confirmation
- physical-device pass

## Home-Network Mode

Use the window for verification only:
1. open production URL
2. run Playwright
3. run guided and expert playthroughs
4. run 10 reload/resume cycles
5. test on a real phone
6. confirm analytics POSTs
7. confirm analytics rows
8. save artifacts
9. rescore the rubric

## Current Priority Order

1. Engineer mobile-hardening parity
2. Lieutenant mobile-hardening parity
3. Evidence docs updated in lockstep
4. Home-network verification weekend

## One-Line Operating Rule

Build small, verify honestly, document everything, and never let a sim outrun its evidence.

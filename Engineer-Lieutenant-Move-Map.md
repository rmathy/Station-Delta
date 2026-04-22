# Engineer ↔ Lieutenant Move Map (Curriculum Scope)

Date: 2026-04-22
Owner: Station Delta curriculum

## Decision Rule
- Keep in **Engineer** if the learner must personally execute/debug/fix with terminal workflow.
- Move to **Lieutenant** if the learner must prioritize, delegate, coordinate, or make risk/cost/release decisions under pressure.

## Move Map
### Engineer Owns (execution depth)
- Codebase orientation under time pressure (`ls -la`, manifest reading, pathing).
- Diff interpretation and commit-level diagnosis.
- Stack trace reading and null-guard fixes.
- TypeScript compiler error triage and corrective patterns.
- API diagnostics (`curl`, status codes, JSON traversal, jq shaping).
- Testing fundamentals (read tests, run tests, interpret failures).
- Runtime incident actions (logs, rollback mechanics, verification commands).
- AI code review mechanics (hallucinated API detection, secure fix patching).
- Git recovery primitives (stash/fetch/rebase/bisect/cherry-pick).
- Process and secret hygiene (`ps`, `kill`, `.env`, `.gitignore`, key rotation).

### Lieutenant Owns (operational leadership depth)
- Incident command and communication structure (roles, timeline ownership, escalation).
- Risk-based release decisions (rollback vs patch-forward under business constraints).
- Team workflow policy (approval gates, merge criteria, release governance).
- Postmortem quality and learning loops (blameless root-cause + prevention ownership).
- Capacity/budget tradeoffs (velocity vs reliability vs cost).
- Cross-team coordination and prioritization under competing objectives.

### Borderline Split (shared but tiered)
- AI review:
  - Engineer: technical bug/safety detection in diff.
  - Lieutenant: policy for acceptable AI risk and merge gates.
- Incident response:
  - Engineer: command execution loop.
  - Lieutenant: stakeholder comms, severity protocol, go/no-go calls.

## Engineer Polish Plan (to reach Cadet parity)
### Implemented in this pass
- Added true multi-step progression on key rescue flows:
  - `p9s2` build → push sequence now supports explicit staged completion.
  - `p9s4` stage → commit sequence now supports explicit staged completion.
- Added step-specific L.O.L.A. retry coaching lanes for high-friction steps:
  - `p2s2`, `p3s5`, `p5s2`, `p9s2`, `p9s4`.
- Added shared multi-step state model in runtime (`G.multiState`) with “Yes, now what?” progression prompts.

### Next polish tranche (recommended before Lieutenant expansion)
- Tighten remaining acceptFn patterns that still over-accept broad phrasing.
- Add phase-specific pressure overlays (time/risk constraints) with fairness guards.
- Expand challenge variability (2 scenario variants per phase where feasible).
- Add one alternate boss failure-recovery branch to increase assessment realism.
- Add explicit transfer card for every sim-only command surface.

## Promotion Gate to Lieutenant Expansion
Engineer is considered “Cadet-parity or better” when all are true:
- Multi-step flows present in all compound command objectives.
- Wrong-answer coaching is step-specific in top friction steps.
- Challenge pass requires taught concepts in correct order (no shortcut pass-through).
- QA playthrough completes without progression ambiguity.
- Analytics snapshots show stable attempt curves (no repeated confusion spikes on same step).

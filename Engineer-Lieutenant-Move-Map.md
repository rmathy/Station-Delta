# Engineer -> Lieutenant Move Map (Execution to Leadership Lift)

Date: 2026-04-23  
Owner: Station Delta curriculum

## Purpose
Define exactly how learners progress from **Engineer** (do the work correctly) to **Lieutenant** (lead technical work safely under pressure) without repeating core Cadet/Engineer content.

## Decision Rule
- Keep in **Engineer** if success is command correctness, debugging accuracy, or technical execution speed.
- Move to **Lieutenant** if success requires tradeoff judgment, prioritization, team coordination, release risk decisions, or stakeholder communication.

## Promotion Contract (what must change)
- Lieutenant Phase 1 must be a **compressed recall drill**, not a re-teach of `pwd/ls/cd`.
- LOLA in Lieutenant shifts from answer-forward coaching to **constraint + context coaching**.
- JANET in Lieutenant scores not just correctness, but **decision quality under ambiguity**.
- Every Lieutenant phase must include at least one **decision gate** (go/no-go, rollback/patch, escalate/contain).

## Scope Split
### Engineer owns (execution depth)
- Shell and file navigation fluency under pressure.
- Code diagnosis (diff, trace, compiler, test failure).
- API and data inspection (`curl`, status codes, payload shape, `jq`).
- Operational command loops (logs, process checks, restart/verify).
- Git and recovery mechanics (`fetch`, `rebase`, `stash`, `bisect`, `cherry-pick`).
- Secure implementation hygiene (.env, secret handling, least privilege, key rotation).

### Lieutenant owns (operational leadership depth)
- Incident command structure (roles, comms cadence, escalation thresholds).
- Risk-based release management (rollback vs patch-forward with business impact).
- Team workflow policy (review gates, definition of done, release controls).
- Postmortem quality (root cause, guardrail ownership, prevention timeline).
- Cross-team negotiation (product, security, SRE, data priorities).
- Capacity/cost/reliability tradeoffs with explicit rationale.

### Shared, but tiered
- AI review:
  - Engineer: detect technical issues in AI output.
  - Lieutenant: define merge policy for AI-assisted changes and exceptions.
- Incident response:
  - Engineer: execute commands correctly.
  - Lieutenant: coordinate response quality and stakeholder outcomes.

## Phase-by-Phase Move Map
1. **Orientation**
- Engineer baseline: terminal orientation and context gathering.
- Lieutenant lift: 90-second triage warm-up ("what matters first"), including confidence declaration.
- Move: keep command recall, add priority ordering.

2. **Debugging**
- Engineer baseline: find and fix local defects.
- Lieutenant lift: choose fix strategy under time and blast-radius constraints.
- Move: keep defect diagnosis, add rollback criteria and owner assignment.

3. **Code Review / AI Review**
- Engineer baseline: identify hallucinations and unsafe diffs.
- Lieutenant lift: set approval gate policy and risk labels per change type.
- Move: keep bug detection, add governance decisioning.

4. **API / Data Flow**
- Engineer baseline: inspect requests and payloads.
- Lieutenant lift: decide whether to degrade, fail closed, or continue service based on downstream impact.
- Move: keep technical inspection, add service-level decision gate.

5. **Tests / Validation**
- Engineer baseline: run tests and interpret failures.
- Lieutenant lift: pick minimum safe test scope for hotfix vs full release.
- Move: keep test reading, add release confidence threshold.

6. **Runtime Operations**
- Engineer baseline: process/container command execution.
- Lieutenant lift: incident severity classification + on-call handoff quality.
- Move: keep runtime checks, add incident command protocol.

7. **Security / Secrets**
- Engineer baseline: fix exposed secret flow.
- Lieutenant lift: decide containment plan and customer communication timing.
- Move: keep remediation mechanics, add risk communication policy.

8. **Deploy / Rollback**
- Engineer baseline: deploy and verify.
- Lieutenant lift: explicit go/no-go call with quantified risk statement.
- Move: keep deployment flow, add accountability checkpoint.

9. **Team Workflow / Boss**
- Engineer baseline: individual execution under pressure.
- Lieutenant lift: multi-party coordination under adversarial JANET conditions.
- Move: keep command rigor, add leadership signal (clarity, sequencing, composure).

## Content Moves (explicit)
### Stay in Engineer
- First-principles command teaching and command syntax breakdown.
- Heavy answer scaffolding in early steps.
- Single-thread "you fix it" loops with minimal cross-team dependencies.

### Move into Lieutenant
- Role delegation prompts and ownership handoffs.
- Decision memos ("why this call, now") attached to technical actions.
- Stakeholder communication artifacts (incident update, risk summary, postmortem draft).

### Remove from Lieutenant
- Copy-paste mission command handholding.
- Repeated beginner glossary reinforcement unless concept is newly introduced.
- Redundant Cadet/Engineer-style JITs that reteach basics already mastered.

## Implementation Plan (Engineer -> Lieutenant build)
1. Build Lieutenant Phase 1 as "Recall Under Load" (3-4 compact multi-step objectives).
2. Replace direct mission-command reveals with progressive hints (`concept -> directional hint -> syntax nudge`).
3. Add one decision gate per phase (tracked event `decision_gate_taken`).
4. Add JANET scoring lane for judgment quality (`risk_low`, `risk_medium`, `risk_high` rationale checks).
5. Add transfer cards that tie each lieutenant decision to real team artifacts (runbook, incident timeline, release note).

## Analytics Hooks for Promotion Readiness
- `step_started`, `step_completed`, `retry_count`, `hint_used`.
- `decision_gate_taken` with choice metadata.
- `checkpoint_pause` and resume rate between phases.
- `ttr_phase` and `false_negative_reported`.
- `janet_judgment_score` (separate from command correctness).

## Gate to Start Officer Expansion
Lieutenant is "ready to branch to Officer tracks" when:
- Phase 1 completion time is below Engineer median without confusion spike.
- Decision-gate responses show consistent rationale quality (not random guessing).
- Challenge pass rate is strong without command reveal dependency.
- QA playthrough confirms no repetitive Cadet/Engineer redundancy.
- 9.5 rubric score passes on pedagogy + realism + command acceptance robustness.

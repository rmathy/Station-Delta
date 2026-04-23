# Vibe Lieutenant Cheat Sheet (Answer + Provenance)

Use this as the instructor key during QA and live demos.

Legend:
- `Explicit`: directly taught on-screen in objective/hint/JIT/teach/bridge before or at use.
- `Reinforced`: taught earlier in-course and recalled later.
- `Common`: reasonable baseline prior knowledge for Lieutenant tier.
- `Scenario`: answer is derivable from scenario text/output shown to learner.

## Core Mission Steps

| Step | A) Expected Answer | B) Why learner would know this |
|---|---|---|
| P1S1 | `ls -la` | `Explicit` via objective, hint, and command shape in `cmd`. |
| P1S2 | `cat package.json` | `Explicit` via objective/hint and visible manifest framing. |
| P1S3 | `find . -name "*.ts"` | `Explicit` via hint + find/grep JIT explanation. |
| P2S1 | `git diff HEAD~1` | `Explicit` via objective/hint/JIT on diff anatomy. |
| P2S2 | `git show HEAD` (or `git show`) | `Explicit` via objective/hint/JIT on commit forensics. |
| P3S1 | `trace` | `Explicit` via objective/hint and stack trace instruction. |
| P3S2 | `read src/middleware/auth.ts` (or `cat ...`) | `Scenario` + `Explicit` from stack trace output naming file. |
| P4S1 | `tsc --noEmit` (accepted: `bun run tsc`, `npx tsc`) | `Explicit` via hint/JIT; `Common` alt runner variants accepted. |
| P4S2 | `read src/routes/pods.ts` (or `cat ...`) | `Scenario` from compiler error line reference + explicit hint. |
| P5S1 | `curl /api/health` | `Explicit` via objective/hint/JIT on status codes. |
| P5S2 | `curl /api/pods` (optionally piped to `jq`) | `Explicit` via objective/hint + JSON shape JIT. |
| P6S1 | `read tests/auth.test.ts` (or `cat ...`) | `Explicit` via objective/hint/test anatomy JIT. |
| P6S2 | `bun run test` (or `bun test`) | `Explicit` via objective/hint + CI framing. |
| P7S1 | `cat logs/error.log` (or `tail logs/error.log`) | `Explicit` via objective/hint and incident log framing. |
| P7S2 | `fix rollback` or `git revert HEAD` | `Explicit` in cmd/hint + rollback JIT. |
| P8S1 | `review diff` (or `git diff`) | `Explicit` via objective/hint and AI review checklist. |
| P8S2 | `fix findUnique` (or fix command naming hallucination/null guard) | `Explicit` via objective/hint and shown diff issue. |
| P9S1 | `git checkout -b fix/escape-pod-timeout` (or `git switch -c ...`) | `Explicit` via objective/hint + branching teach card. |
| P9S2 | `git add ... && git commit -m "..."` | `Explicit` via hint and conventional commit JIT. |
| P9S3 | `git push origin fix/escape-pod-timeout` | `Explicit` via objective/hint + PR lifecycle JIT. |

## Constructed Challenges (Instructor Intent)

| Challenge | A) High-quality Answer | B) Why learner would know this |
|---|---|---|
| C1 Codebase Orientation | Mention both `cat README.md` and `cat package.json` (optionally `ls -la`) | `Reinforced` from P1 skills + scenario asks purpose/stack/run. |
| C2 Diff Review | Identify timeout changed to 1 minute (regression) | `Reinforced` from P2 diff reading + `Scenario` math in prompt. |
| C3 Stack Trace | Bug in `src/utils/user.ts` line 34; undefined/null user path | `Reinforced` P3 pattern: first relevant src frame and null checks. |
| C5 API Integration | `response.data.users[0].name` access-path reasoning | `Reinforced` P5 JSON traversal JIT. |
| C7 Incident Response | Logs/check first, rollback/mitigate, then investigate | `Reinforced` P7 response loop and rollback sequencing. |

## Boss Fight (Assessment Authority: J.A.N.E.T.)

| Boss Step | A) Expected Action | B) Why learner would know this |
|---|---|---|
| B1 | `read src/index.ts` or `cat src/index.ts` | `Reinforced` from P1/P3 file-inspection flow + prompt. |
| B2 | `read src/db/client.ts` or `cat ...` | `Scenario` stack trace points to `client.ts`. |
| B3 | Rollback command (`git revert` / rollback) | `Reinforced` from P7 incident mitigation doctrine. |
| B4 | Identify hardcoded `DATABASE_URL` + localhost/secrets anti-pattern | `Reinforced` from P8 AI-hallucination/security framing + scenario text. |
| B5 | `git push ...` to open PR and close loop | `Reinforced` from P9 workflow and deployment gates. |

## QA Sweep Notes (Current)

- Strength: Almost every required answer is either explicitly taught on-screen or derivable from immediate scenario output.
- Strength: Provenance chain is clear from P1 → P9, then re-tested in boss fight.
- Watch item: Some accepts are intentionally broad to reduce false negatives (good for novice flow), but this can mildly increase false positives in assessment contexts.
- Recommendation: Keep current explorer leniency, and add stricter `expert_mode_accept` patterns later for high-stakes scoring tiers.

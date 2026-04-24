# Station Delta Jumpstart Protocol

Use this at the start of a new chat to resume work immediately with minimal context.

## Paste This Into New Chat
```
JUMPSTART: Station Delta

Workspace root:
/Users/rmathy/Documents/Codex/2026-04-22-files-mentioned-by-the-user-station

Primary sim files:
- /Users/rmathy/Documents/Codex/2026-04-22-files-mentioned-by-the-user-station/base/vibe-cadet.html
- /Users/rmathy/Documents/Codex/2026-04-22-files-mentioned-by-the-user-station/base/vibe-engineer.html
- /Users/rmathy/Documents/Codex/2026-04-22-files-mentioned-by-the-user-station/base/vibe-lieutenant.html

Core standards:
- /Users/rmathy/Documents/Codex/2026-04-22-files-mentioned-by-the-user-station/QA/9.5-Gate-Rubric.md
- /Users/rmathy/Documents/Codex/2026-04-22-files-mentioned-by-the-user-station/QA/Pedagogy-Matrix.md
- /Users/rmathy/Documents/Codex/2026-04-22-files-mentioned-by-the-user-station/Class-in-Session-Protocol.md

Production manager docs:
- /Users/rmathy/Documents/Codex/2026-04-24/files-mentioned-by-the-user-jumpstart/Station-Delta-Production-Assembly-Line.md
- /Users/rmathy/Documents/Codex/2026-04-24/files-mentioned-by-the-user-jumpstart/Current-Production-Board.md

Current deployment:
- https://station-delta-one.vercel.app/

Required startup actions:
1) Run `git status --short` and summarize uncommitted files.
2) Read the three core standards above.
3) Read the two production-manager docs above.
4) Identify last 3 commits with `git log --oneline -n 3`.
5) Confirm current state of the five critical release items in `Release-Go-No-Go-Checklist.md`.
6) Propose the next 3 highest-leverage actions for the current sprint.
7) Wait for my go-ahead, then execute.
```

## Current Known State (as of 2026-04-24)
- Cadet mobile hardening was completed and pushed in commit `cbe9662`.
- Lieutenant curriculum and gate tightening were committed in `454df8f`.
- Playtesting now has a firewall-safe offline preflight path in `Playtesting/README.md`.
- Current release decision is still `NO-GO` because all five critical release-board items remain `HOLD` until home-network verification is completed.
- Engineer and Lieutenant still need mobile-hardening parity with Cadet.
- Analytics wiring and event contract are present, but live webhook/sheet confirmation is still pending.

## Working Rules
- Keep changes scoped; commit by feature slice.
- Prioritize learner flow, command robustness, accessibility, and analytics integrity.
- Treat restricted-network sessions as build/preflight time.
- Treat home-network sessions as verification time.
- Do not revert unrelated local edits.
- Before each commit, report what files are staged and why.

## Definition Of Done
- Meets 9.5 gate minimums.
- No category below 9.0 and no critical fails.
- Required QA evidence artifacts are updated.
- Release-board status is updated honestly.
- Commit and push complete, or blocker is explicitly documented.

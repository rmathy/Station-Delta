# Vibe Engineer Cheat Sheet (Answer + Provenance)

Legend:
- `Explicit`: taught on-screen in objective/hint/JIT/teach.
- `Reinforced`: prior skill recalled in a higher-pressure context.
- `Scenario`: derivable from mission output.
- `Common`: assumed baseline at Engineer level.

## Engineer Overlay Mission Steps

| Phase | A) Core Answers | B) Why learner should know this |
|---|---|---|
| P1 (Review + Twist) | `pwd`, `ls -la`, `cat distress.log \| grep ...`, `git log --oneline` | `Reinforced` from Cadet + `Explicit` new signal-extraction objective. |
| P2 (Shell Automation) | `touch rescue.sh`, shebang append, var append, guard append, `chmod +x`, `./rescue.sh` | `Explicit` script-building sequence with hints per line. |
| P3 (SSH Ops) | `ssh-keygen ...`, `ssh-copy-id ...`, `ssh ...`, `ls -la && pwd`, `scp ...` | `Explicit` end-to-end remote access workflow. |
| P4 (HTTP + API) | `curl health`, `curl -X POST ... -d ...`, `curl -H "Authorization..." ...`, `curl ... \| jq .battery`, Anthropics messages call | `Explicit` API syntax scaffolding + `Scenario` service outputs. |
| P5 (Structured Pipelines) | `cat events.log \| grep ERROR`, `jq select`, `jq object reshape`, `curl stream \| tee \| jq` | `Explicit` grep→jq progression and tee split-stream concept. |
| P6 (Containers) | `docker ps`, `docker logs ...`, write Dockerfile, `docker build`, `docker run`, `docker exec -it ...` | `Explicit` container lifecycle path. |
| P7 (Git Recovery) | `git status`, `git stash`, `git fetch origin`, `git rebase origin/main`, `git bisect ...`, `git cherry-pick ...` | `Explicit` incident-safe source control recovery sequence. |
| P8 (Processes + Secrets) | `ps aux`, `kill -9 4242`, `.env` creation, `.gitignore` protection, `export API_KEY=$(curl ... \| jq -r ...)` | `Explicit` with security context and incident-response framing. |
| P9 (Final Rescue Flow) | remote log via `ssh ... 'cat ... \| tail -5'`, build+push image, `curl ... \| jq {battery,status}`, commit with `rescue:` prefix, execute `ssh ... 'bash ~/rescue.sh'` | `Reinforced` cross-phase synthesis + `Scenario` final mission constraints. |

## Boss Assessment (Engineer)

| Boss Step | A) Expected Action | B) Provenance |
|---|---|---|
| B1 | `docker logs pod-monitor --tail 20` | `Reinforced` from P6 logs command. |
| B2 | `kill -9 4242` (or `-15`) | `Reinforced` from P8 process control. |
| B3 | `ssh engineer@192.168.1.42 'bash ~/rescue.sh'` | `Reinforced` from P9 remote execution. |
| B4 | `curl -s .../status \| jq '{battery: .battery, status: .status}'` | `Reinforced` from P4/P5/P9 jq shaping. |
| B5 | `git add -A && git commit -m "rescue: ..."` | `Reinforced` from P7/P9 commit hygiene. |

## Instructional Integrity Notes
- Engineer largely satisfies “answer known before typing” through strong hint + LOLA guidance.
- Any retained broad accepts should be documented as flow-friendly Explorer behavior, with stricter alternatives for assessment mode.

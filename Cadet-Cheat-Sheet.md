# Vibe Cadet Cheat Sheet (Answer + Provenance)

Legend:
- `Explicit`: directly taught on-screen (objective/hint/JIT) before or at use.
- `Reinforced`: taught earlier, recalled later.
- `Scenario`: answer is derivable from output shown.
- `Common`: assumed baseline, minimal use.

## Phase-by-Phase Answers

| Step | A) Answer | B) Why learner should know this |
|---|---|---|
| P1S1 | `pwd` | `Explicit` objective/hint + first-command intro. |
| P1S2 | `ls` | `Explicit` objective/hint and term definition. |
| P1S3 | `cd game_v1` | `Explicit` command + argument framing. |
| P2S1 | `touch manifest.txt` | `Explicit` objective/hint. |
| P2S2 | `echo "Mission: Escape Pod" > manifest.txt` | `Explicit` with string + redirect teaching. |
| P2S3 | `cat manifest.txt` | `Explicit` read/verify loop. |
| P3S1 | `git init` | `Explicit` command/subcommand intro. |
| P3S2 | `git status` | `Explicit` in git basics. |
| P3S3 | `git add manifest.txt` | `Explicit` staging concept. |
| P3S4 | `git commit -m "Add mission manifest"` | `Explicit` flag/message instruction. |
| P3S5 | read conflict markers / resolve | `Scenario` from conflict output + guided objective. |
| P3S6 | rewrite + commit resolution | `Reinforced` from earlier file + git steps. |
| P4S1 | `bun init` (or accepted variant) | `Explicit` phase objective. |
| P4S2 | `bun add hono` | `Explicit` dependency install step. |
| P4S3 | `bun run dev` | `Explicit` script execution step. |
| P5S1 | `cat logs.txt` | `Explicit` logs-reading objective. |
| P5S2 | `cat logs.txt \| grep CRITICAL` | `Explicit` pipe + grep instruction. |
| P5S3 | `cat logs.txt \| grep CRITICAL \| wc -l` | `Explicit` pipeline extension step. |
| P6S1 | `vibe status` | `Explicit` with command-family framing (`vibe` as tool family). |
| P6S2 | `vibe create --role manager --name Captain` | `Explicit` objective/hint. |
| P6S3 | `vibe create --role specialist --name Engineer` | `Explicit` objective/hint. |
| P7S1 | `vibe mcp init` | `Explicit` runtime initialization objective. |
| P7S2 | `vibe mcp connect filesystem --agent Captain` (or accepted form) | `Explicit` MCP connection guidance. |
| P7S3 | `vibe auth --agent Engineer --tool npm` | `Explicit` least-privilege auth step. |
| P8S1 | `prompt Captain ...` | `Explicit` basic prompting step. |
| P8S2 | structured `prompt` with format constraints | `Explicit` prompt quality instruction. |
| P8S3 | prompt chain using pipe | `Explicit` pipeline prompt objective. |
| P9S1 | build command (`bun run build`) | `Explicit` production build step. |
| P9S2 | `export API_KEY=...` | `Explicit` env var step. |
| P9S3 | env recall (`echo $API_KEY`/`printenv`) | `Explicit` verification step. |
| P9S4 | deploy command (`vibe deploy`/accepted deploy variant) | `Explicit` final objective. |

## Challenge/Boss Note
- Most challenge prompts are `Scenario + Reinforced`: learners should combine commands previously taught, not invent new syntax.
- For strict scoring, prefer requiring command sequence completeness instead of keyword-only intent.

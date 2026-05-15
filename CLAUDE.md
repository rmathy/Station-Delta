# CLAUDE.md — Station Delta
### Master context file. Claude Code reads this at the start of every session.
### Last updated: May 2026

---

## WHO YOU ARE AND WHAT THIS IS

You are working on **Station Delta** — a corporate AI training platform built as
interactive terminal simulations. Live at stationdelta.dev (Vercel). Repo owner: rmathy.

The owner is not a developer by background. He built this solo. Be direct, be specific,
explain your reasoning, and never assume he knows what a git flag does without explaining it.

---

## REPO STRUCTURE

```
/Users/rmathy/Station-Delta/
  base/                    ← 3 free sims (always match Cadet standard)
    vibe-cadet.html        ← GOLD STANDARD (9.72) — reference for all UX/mobile/pedagogy
    vibe-engineer.html     ← Tier 2 bridge
    vibe-lieutenant.html   ← GOLD STANDARD (9.81) — reference for Officer-tier teaching
  officer-track/           ← 10 paid sims
    vibe-agent-architect.html
    vibe-captain.html
    vibe-chaos-officer.html
    vibe-comms-officer.html
    vibe-data-officer.html
    vibe-deployment-officer.html
    vibe-finops-officer.html
    vibe-performance-officer.html
    vibe-security-officer.html
    vibe-systems-integrity.html
```

Codex docs live at: `/Users/rmathy/Documents/Codex/`
Production board, assembly line, and QA docs are there.

---

## STARTUP RITUAL — RUN THIS EVERY SESSION

```bash
cd /Users/rmathy/Station-Delta
git status
git log --oneline -5
ls base/ officer-track/
```

Report: uncommitted files, last 5 commits, confirm folder contents match above.
Then ask what we're working on today before touching anything.

---

## THE NON-NEGOTIABLES (read these before every sim edit)

### 1. Gate rule
No sim ships without scoring **9.5+ weighted** across all 6 rubric categories.
No category below **9.0**. Any critical accessibility fail = automatic hold.

Full rubric: `/Users/rmathy/Documents/Codex/QA/9.5-Gate-Rubric.md`

### 2. Gold standards
- **Cadet** = reference for UX, mobile layout, accessibility, beginner pedagogy
- **Lieutenant** = reference for Officer-tier teaching calibration, JANET voice, boss fight quality
- Before inventing any new pattern, check if Cadet or Lieutenant already solved it

### 3. This is a teaching tool, not a testing tool
The most important rule in the entire project:

**Every new command, subcommand, flag, or syntax the learner types for the first
time must be introduced and explained in `#lola-sec` (the `ctx` field) BEFORE
they type it — not after.**

The `ctx` field is the primary teaching surface. Minimum 150 characters.
Every ctx must answer:
1. What is this command/tool? (one plain-English sentence)
2. Why does it exist / what problem does it solve?
3. What is the real-world analog or actual CLI syntax?
4. What should the learner expect to see when it works?

**If a learner can complete a step without understanding what they typed, the
step has failed its pedagogical purpose regardless of gate score.**

### 4. Look and feel consistency
Every sim must match Cadet/Lieutenant on these elements — in the same order,
same font, same behavior — while keeping its own identity:

| Element | Standard |
|---|---|
| `#output` div | `role="log" aria-live="polite" aria-atomic="false"` |
| `#cmd` input | `aria-label="Terminal command input" autocapitalize="off" autocorrect="off" enterkeyhint="send"` |
| `#lola-strip` | present, with Pause button (aria-labeled), between topbar and term-panel |
| Right panel sections | lola-sec, crew-sec (if applicable), playbook-sec, telem-sec — in that order |
| Top bar buttons | MAN PAGES, GLOSSARY, ACHIEVEMENTS, RESTART — same order, same labels |
| Mobile breakpoint | `@media(max-width:820px)` — never position:fixed on #right |
| Phase checkpoint | explicit modal with "continue" and "take a break" options |
| Boss fight | L.O.L.A. goes offline, JANET takes over, 5-step assessment, emotional payoff |
| Easter eggs | kill lola / kill janet — present in every sim |

Each sim keeps its own: color scheme, domain copy, boss fight scenario, What-If
scenarios, Deep Dive content, career log data, and JANET personality lines.

---

## PEDAGOGY RULES (from Pedagogy-Matrix.md)

Full doc: `/Users/rmathy/Documents/Codex/QA/Pedagogy-Matrix.md`

### Course tiers
- **Tier 1 (Cadet):** Define everything. High scaffolding. Warmth first.
- **Tier 2 (Engineer, Lieutenant):** Connect. Transfer framing. Less definition.
- **Tier 3 (Officer, Captain):** Operationalize. Stakes and decisions. No re-teaching basics.

### L.O.L.A. voice rules
- Warm, precise, confidence-building, genuinely on the learner's side
- Pattern: 1) Name what this is. 2) Explain why it matters. 3) Point to what to do now.
- Wrong-answer coaching: acknowledge effort → name the likely mistake → give one directional hint
- Never: verbose, documentation-like, infantilizing, generic motivational filler

### JANET voice rules
- Dry, precise, detached, bureaucratic, emotionally withholding
- GLaDOS-calibre but never cruel, never chaotic, never personal
- "I am simply executing my function." / "That was technically correct."
- Never: cartoonishly mean, redundant with LOLA, profane, theatrical

### Strip message tags (use intentionally)
`tip` `concept` `new!` `warning` `habit` `syntax` `shortcut` `command`

### Real-world transfer (mandatory for every sim-specific command)
Every custom or sim-specific command must include in its ctx or teach card:
- What the real-world equivalent tool or pattern is
- Why a working developer would use it
- What it looks like in a real codebase or terminal session

---

## BEEF UP PLAN RULES (from Beef_up_Plan_for_Station_Delta.md)

Full doc: `/Users/rmathy/Documents/Codex/Beef_up_Plan_for_Station_Delta.md`

### The core problem this plan solves
Many Officer sims were built with skeleton content — ctx bodies averaging 43-90
characters instead of the 150-300 character standard. The architecture is sound.
The content underneath it is thin.

### The fix
Two things in parallel:
1. Expand existing thin ctx/jit/bridge/teach cards to the 150-300 char standard
2. Add the 2-3 missing steps per phase that bring sims to 25-30 steps total depth

### Real command replacements
The beef up plan specifies real CLI commands to replace sim wrapper commands.
**Never introduce a sim-specific command without also explaining the real tool.**

Key replacements already prescribed (see full doc for complete tables):
- Agent Architect: `python agent.py --mode react`, `redis-cli SET`, `pytest evals/ -k regression`, `cohere rerank`, `presidio-analyzer analyze`
- FinOps: `aws ce get-cost-and-usage`, `aws resourcegroupstaggingapi tag-resources`
- Systems Integrity: `kubectl logs | jq 'select(.confidence < 0.7)'`, `garak --probe hallucination`
- Captain: `cat ARCHITECTURE.md && fd -e yaml . k8s/`, `kubectl top pods`, `sloth generate -i slo.yaml`

### Missing steps to add (priority order for BAE demo)
1. Agent Architect p1s3: `python agent.py --schema response_schema.json` (schema enforcement)
2. Captain p1s3: `arch risk register` (risk register artifact)
3. Captain p4s3: `scale runbook cache` (operational runbook)
4. Agent Architect p2s3: `redis-cli SET agent:shared:context` (shared memory)
5. Agent Architect p3s1b: `diff evals/results/baseline.json evals/results/new.json` (eval diff)

---

## MOBILE READY RULES (from mobileready.md)

Full doc: `/Users/rmathy/Documents/Codex/mobileready.md`

### The mobile priority stack (always in this order)
1. Top identity / minimal controls
2. Current objective
3. Terminal output
4. Terminal input
5. Secondary tools on demand (TOOLS modal)

### CSS grid states — define all four combinations
```css
@media(max-width:820px){
  #shell{grid-template-rows:48px 28px 1fr 170px}
  #shell.strip-hidden{grid-template-rows:48px 0px 1fr 170px}
  #shell.right-collapsed{grid-template-rows:48px 28px 1fr 52px}
  #shell.right-collapsed.strip-hidden{grid-template-rows:48px 0px 1fr 52px}
}
```
(Adjust row heights to match sim's topbar/strip heights)

### Critical mobile rules
- Never `position:fixed` on `#right` — use bottom-strip pattern instead
- Every hidden desktop control needs a mobile TOOLS modal equivalent
- Strip toggle button must live OUTSIDE the strip (not inside it)
- `#mobile-ctx-section` mirrors current step obj/ctx into expanded panel
- Right panel collapsed by default on mobile
- Touch targets minimum 44x44px
- Physical device test required — emulator alone does not pass gate

---

## STYLE TRANSFER PLAYBOOK (from sim-style-transfer-playbook_stage.md)

Full doc: `/Users/rmathy/Documents/Codex/sim-style-transfer-playbook_stage.md`

### When adapting a sim to current baseline
1. Run `rg -n ":root|#shell|#topbar|#lola-strip|modal|doRestart|playbook|whatif|deep" <file>` first
2. Preserve: color scheme, domain copy, Deep Dive, Playbook, What-If, unique mechanics
3. Transfer: interaction fixes, strip controls, mobile expansion model, modal behavior, restart flow
4. Anti-collapse guards required on all rich terminal cards:
   ```css
   #output > *{flex-shrink:0;width:100%}
   .jit,.bridge,.hint-wrap,.teach,.challenge,.breakit,.janet-arrival{flex-shrink:0!important}
   ```
5. Verify terminal command engine exists — check `$cmd.addEventListener('keydown',...)`
6. Boot screen mode cards must stack vertically on mobile

---

## QA PASS CHECKLIST (from Class-in-Session-Protocol.md)

Full doc: `/Users/rmathy/Documents/Codex/Class-in-Session-Protocol.md`

Before scoring any sim:
- **Pass A:** Pedagogy contract — every step taught before assessed, spaced rep in phases 3+
- **Pass B:** Command acceptance — 3+ DIAGNOSE patterns per step, no generic "try again"
- **Pass B.5:** Friction/clarity — wrong-answer warmth, hint discoverability, strip controls
- **Pass C:** Narrative/UI — no stale cross-course artifacts, JANET emotional weight, easter eggs
- **Pass D:** Accessibility — aria-live, keyboard nav, physical mobile device test
- **Pass E:** Analytics — POST fires, session row appears in analytics sheet

---

## CURRENT GATE SCORES

| Sim | Score | Status | Notes |
|---|---|---|---|
| Cadet | 9.72 | ✅ PASS (Gold) | Reference implementation |
| Engineer | 9.56 | ✅ PASS | cmd aria-label missing — fix before announce |
| Lieutenant | 9.81 | ✅ PASS (Gold) | Reference implementation |
| Agent Architect | 9.41 | ⚠️ HOLD | Accessibility batch fix needed |
| Systems Integrity | 9.52 | ✅ PASS | right-collapse-btn aria-pressed micro-fix |
| FinOps Officer | 9.57* | ✅ PASS* | Fixes applied May 15 — verify after push |
| Captain | 9.63 | ✅ PASS | Strongest Officer sim |
| Chaos Officer | Not gated | — | Not yet scored |
| Comms Officer | Not gated | — | Not yet scored |
| Data Officer | Not gated | — | Not yet scored |
| Deployment Officer | Not gated | — | Not yet scored |
| Performance Officer | Not gated | — | Not yet scored |
| Security Officer | Not gated | — | Not yet scored |

---

## SPRINT STATE (as of May 15, 2026)

- **BAE Industry Day:** May 20 — display table, not a pitch
- **Goal:** All 7 built sims gate-ready before Tuesday
- **Stripe:** Still in test mode — switch to live needs business checking account first
- **Vercel:** Live at stationdelta.dev
- **Analytics:** Pipeline wired, live confirmation pending home network

### Immediate priorities
1. Resolve FinOps merge conflict and push
2. Apply Agent Architect accessibility patches (BAE-Accessibility-Patches.md)
3. Verify all 7 sims on a real device before Tuesday
4. Create CLAUDE.md in repo root (this file)

---

## WHAT NOT TO DO

- Do not modify `base/` files without explicit instruction
- Do not push directly to main without showing diff first
- Do not invent new HTML/CSS patterns — check Cadet first
- Do not add a command to a step without explaining it in ctx first
- Do not mark a sim PASS without running all 5 passes
- Do not mix curriculum work and release verification in the same session
- Do not use `position:fixed` on mobile panels
- Do not place hide/collapse buttons inside the thing they hide
- Do not ship thin ctx bodies (under 150 chars) — expand them
- Do not test using only sim-specific commands — every command needs a real-world analog

---

## AGENT TEAM PATTERN (for complex multi-step work)

For large sim builds or rewrites, use this division of labor:

**Spec Writer** — defines problem, learner outcome, scope, acceptance criteria
**Implementer** — changes only named files, one slice at a time
**QA Agent** — runs passes A-E, scores rubric, flags issues
**Feedback Synthesizer** — only runs after real playtest notes exist

Never mix these roles in one unfocused pass.
One lane. One slice. Commit. Then next.

---

## COMMIT MESSAGE FORMAT

```
type(scope): short description

- bullet of what changed and why
- projected gate impact if relevant
```

Types: `fix` `feat` `docs` `qa` `refactor`
Scopes: `cadet` `engineer` `lieutenant` `finops` `agent-architect` `captain` `systems-integrity` etc.

Example:
```
fix(finops): accessibility gate fixes + lolaIntro upgrades

- Add role=log aria-live=polite to #output (critical gate fix)
- Add #lola-strip with Pause/Focus buttons
- Upgrade all 9 lolaIntro strings to 150+ char standard
- Projected: 9.21 HOLD → 9.57 PASS
```

---

## KEY EXTERNAL DOCS (Codex paths)

| Doc | Path | When to read |
|---|---|---|
| Gate Rubric | `/Users/rmathy/Documents/Codex/QA/9.5-Gate-Rubric.md` | Before scoring any sim |
| Pedagogy Matrix | `/Users/rmathy/Documents/Codex/QA/Pedagogy-Matrix.md` | Before curriculum work |
| Class-in-Session Protocol | `/Users/rmathy/Documents/Codex/Class-in-Session-Protocol.md` | Before QA pass |
| Mobile Ready Guide | `/Users/rmathy/Documents/Codex/mobileready.md` | Before mobile work |
| Style Transfer Playbook | `/Users/rmathy/Documents/Codex/sim-style-transfer-playbook_stage.md` | Before porting a sim |
| Beef Up Plan | `/Users/rmathy/Documents/Codex/Beef_up_Plan_for_Station_Delta.md` | Before adding steps |
| Production Assembly Line | `/Users/rmathy/Documents/Codex/Station-Delta-Production-Assembly-Line.md` | Session planning |
| Jumpstart Protocol | `/Users/rmathy/Documents/Codex/Jumpstart-Protocol.md` | New session startup |
| Release Go/No-Go | `/Users/rmathy/Documents/Codex/Release-Go-No-Go-Checklist.md` | Before any push |
| Spec Writer Mind Map | `/Users/rmathy/Documents/Codex/Spec-Writer-13-Course-Mind-Map.md` | New sim planning |

---

*Station Delta LLC · UEI: Q6HHZBDYZT54 · stationdelta.dev*
*CLAUDE.md — single source of truth for every Claude Code session*

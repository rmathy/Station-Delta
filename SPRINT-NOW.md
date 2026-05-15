# Sprint Now — Auto Pilot Queue
Last updated: May 15, 2026

## IMMEDIATE (before BAE May 20)
1. [ ] Agent Architect — apply remaining mobile CSS fix (breakpoint 768→820px already done, verify)
2. [ ] Verify FinOps push resolved cleanly — open in browser, confirm lola-strip visible
3. [ ] Physical device test all 7 built sims — confirm terminal visible on phone
4. [ ] Switch Stripe to live mode (needs First Source bank account first)

## SIM QUALITY QUEUE (post-BAE, in order)
5. [ ] Chaos Officer — gate score, beef up plan fixes, real command replacements
6. [ ] Comms Officer — gate score, beef up plan fixes
7. [ ] Data Officer — gate score, beef up plan fixes (50 char avg — biggest content lift)
8. [ ] Deployment Officer — gate score, beef up plan fixes
9. [ ] Performance Officer — gate score, beef up plan fixes
10. [ ] Security Officer — gate score (already strongest at 645 char avg)
11. [ ] All 10 Officer sims — add missing steps from beef up plan

## AUTO PILOT INSTRUCTIONS FOR CLAUDE CODE
When working autonomously on any sim in this queue:
1. Read CLAUDE.md first — always
2. Read the sim file
3. Run gate score against 9.5-Gate-Rubric.md
4. Apply beef up plan fixes for that sim
5. Expand thin ctx bodies to 150-300 char standard
6. Add missing steps per beef up plan
7. Apply style transfer playbook for any structural gaps
8. Commit with proper message format
9. Update this file — check the box, add gate score

## STRIPE PAYMENT PATH
See: /Users/rmathy/Documents/Codex/payment_attack_plan.md
Blocker: First Source business checking account
Once open: switch Stripe test→live, run one real purchase, verify webhook

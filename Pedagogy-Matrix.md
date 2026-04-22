# Station Delta Pedagogy Matrix

## Purpose
This matrix defines which pedagogy patterns should be universal across the Station Delta course catalog, which should vary by learner level, and which should only appear when a course truly needs them. It is based on the current course set:

- `Vibe Cadet`
- `Vibe Engineer` outline
- `Data Officer`
- `Agent Architect`
- `Chaos Officer`
- `Deployment Officer`
- `FinOps`
- `Comms Officer`
- `Vibe Captain`
- `Security Officer`
- `Systems Integrity`
- `Performance Officer`

## Catalog Read
The current catalog already shares a strong structural backbone:

- Most role courses use a common sim architecture: `PHASES`, `steps`, `lolaIntro`, `spacedRep`, `breakit`, `challenge`, `JANET`, `setLola`, `phase-track`, `obj-card`.
- The Officer courses are not raw clones, but they are clearly instances of the same teaching system with different data.
- Cadet is the true beginner foundation.
- Engineer is the bridge course: still scaffolded, but with higher cognitive and technical load.
- Officer tracks are advanced, role-specific sims that benefit from consistent flow but not from beginner over-explanation.

That means the right strategy is:

1. Keep one shared Station Delta pedagogical spine.
2. Vary scaffolding intensity by course tier.
3. Preserve shared identity across all sims.

## Course Tiers

### Tier 1: Beginner Core
Use for:
- Cadet

Learner state:
- Little or no command-line fluency
- Needs orientation, terminology, and confidence-building
- Benefits from higher explicitness and lower ambiguity

### Tier 2: Intermediate Bridge
Use for:
- Engineer
- Lieutenant-style transitional sims

Learner state:
- Already knows basic CLI patterns
- Needs transfer from beginner mechanics to real-world toolchains
- Benefits from shorter scaffolding and stronger transfer framing

### Tier 3: Advanced Role Sim
Use for:
- Data Officer
- Security Officer
- Chaos Officer
- Deployment Officer
- Performance Officer
- FinOps
- Agent Architect
- Comms Officer
- Systems Integrity
- Vibe Captain

Learner state:
- Already operating inside a role fantasy and technical context
- Needs clarity and flow, but not heavy definitional teaching
- Benefits from role stakes, decisions, tradeoffs, and procedural fluency

## Universal Standards
These should exist in every Station Delta course.

### 1. Shared World and Voice
- L.O.L.A. is the guide, coach, and meaning-maker.
- J.A.N.E.T. is the assessor, pressure source, and tone contrast.
- The station universe should feel continuous across courses.
- Courses should reference prior learning when appropriate.

Why:
- This is part of the brand and part of the retention engine.

### 1a. Emotional Character Contract
The emotional dynamic between L.O.L.A. and J.A.N.E.T. is not incidental. It is part of the learning design.

- L.O.L.A. should be the figure the learner bonds with.
- The learner should want to make L.O.L.A. proud.
- J.A.N.E.T. should be the interruption, the evaluator, and the institutional/corporate voice that judges everything.
- The learner should feel mild resentment toward J.A.N.E.T.'s interruptions and dryness.
- That contrast should strengthen the learner's attachment to L.O.L.A. and deepen the sense that L.O.L.A. is "on their side."

Design target:
- L.O.L.A. = trusted guide, human-feeling ally, source of encouragement and meaning
- J.A.N.E.T. = "corporate drone" assessment layer, emotionally withholding, exacting, always watching

Important:
- J.A.N.E.T. should carry some of the essence of GLaDOS from Portal: dry, cutting, observant, occasionally funny in a cold way.
- But J.A.N.E.T. must never become unprofessional, chaotic, or sadistic.
- She is not a villain monologuing. She is a highly polished, bureaucratic assessment system with a faintly hostile personality leak.

Rule:
- The learner should dislike being interrupted by J.A.N.E.T., but still accept her as part of the world and the test structure.
- The learner should never feel genuinely bullied or attacked.

### 2. Phase-Based Progression
- Every course should have explicit phases.
- Every phase should feel like a meaningful chapter, not a random grouping.
- Each phase should end with a clear completion moment.
- Each phase should provide a safe stopping point.
- Use an explicit phase checkpoint modal (or equivalent full-screen pause state) between phases.
- Checkpoint flow should support:
  - start next phase now
  - take a break now
  - resume later at the checkpoint boundary, not mid-transition
- Persist checkpoint state through browser close/reload (for example `pendingPhaseStart`).

Why:
- Learners need rhythm, pacing, and natural break moments.

### 3. Step Anatomy Consistency
Every step should clearly answer:
- What am I doing?
- Why am I doing it?
- What command/action is expected?
- What happened after I did it?
- Tier 1 and Tier 2 steps should support `pre_step_concept` for first-use explanations before typing.
- Steps should include a concise just-in-time strip message surface (`LOLA_STRIP`) separate from long-form context copy.
- L.O.L.A. panel content should be computed per step (`lolaMessageForStep`-style), not just repeated `ctx`.

Why:
- This creates trust and lowers confusion across all course types.

### 4. Real-World Transfer Language
- Every custom command or simulation abstraction must map to a real-world pattern.
- If a command is sim-specific, the learner should know what the real-world analog looks like.
- Every course should reinforce transferable mental models, not just course-specific syntax.

Why:
- Without transfer language, the sim feels fake.

### 5. Challenge Hygiene
- No challenge should require concepts not yet taught.
- No break-it should depend on syntax the learner has not been prepared for.
- Multiple-choice patterns must avoid obvious answer-position bias.
- Multi-step tasks must not pass on partial answers unless that is the explicit teaching goal.
- Wrong-answer feedback should be instructional, not generic:
  - L.O.L.A.-voiced coaching on normal command mistakes
  - directional nudge for challenge retries
  - preserve warmth while maintaining standards

Why:
- Learners should feel challenged, not tricked.

### 6. Resume and Session Clarity
- Learners should always know where they are resuming.
- Learners should know if they are at a good stopping point.
- Course state should feel friendly and legible on return.

Why:
- Session continuity is part of course quality, not just engineering.

## Standards by Tier

### A. Terminology Introduction

#### Tier 1: Beginner Core
Required:
- Explain terms like `command`, `subcommand`, `flag`, `path`, `string`, `redirect` before or at first use.
- Explain new syntax before asking the learner to produce it.

#### Tier 2: Intermediate Bridge
Required:
- Explain only genuinely new abstractions.
- Assume foundational CLI vocabulary is known.
- Emphasize analogy and transfer over base definitions.

#### Tier 3: Advanced Role Sim
Required:
- Do not re-teach basic CLI vocabulary unless the course introduces a role-specific abstraction.
- Introduce only specialized concepts that are essential for the phase.

Rule:
- Beginner tiers define.
- Bridge tiers connect.
- Advanced tiers operationalize.

### B. L.O.L.A. Scaffolding Intensity

#### Tier 1
- Warm, explicit, confidence-building
- Can explain step meaning directly
- Can preview what the learner is about to do
- Should reduce fear and ambiguity
- Wrong-answer path should stay in L.O.L.A. voice and include effort-validating coaching, especially attempts 1-3.

#### Tier 2
- Shorter, more tactical
- Should connect past knowledge to new use cases
- Less definition, more transfer and framing
- Wrong-answer feedback should stay concise but still include a directional next move.

#### Tier 3
- Brief, sharp, role-aware
- Should frame stakes and decisions
- Avoid long explanatory blocks unless the concept is genuinely difficult
- Wrong-answer feedback can be terse, but should still be actionable.

Rule:
- L.O.L.A. should scale down in explicitness as learner capability scales up.

### C. Static Guidance Surface

#### Tier 1
- Left action lane should show objective and hint clearly.
- Guidance should stay close to the work.
- Avoid overcrowding the terminal.

#### Tier 2
- Similar structure, but hints can be more compact.

#### Tier 3
- Static lane should remain lean.
- Support context should exist, but not dominate the workspace.

Rule:
- Action lane stays primary in every course.
- Support surfaces should not steal vertical space from the core task.

### D. Phase Checkpoints

#### Tier 1
- Explicit checkpoint modal or equivalent pause signal required.

#### Tier 2
- Strongly recommended.

#### Tier 3
- At minimum, a clear phase-complete / safe-to-pause signal.

Rule:
- The more cognitively intense the course, the more valuable deliberate pause structure becomes.

## Feature Transfer Matrix

### Should Transfer to All Courses
- Phase checkpoint / safe stopping point
- Better answer validation for multi-step tasks
- Better multiple-choice randomization
- Real-world analog language for simulation-only commands
- Stronger phase boundary clarity
- Resume-state clarity

### Should Transfer to Cadet + Engineer, Not Automatically to Officer Tracks
- Pre-step syntax explainers
- Rich first-use concept framing
- More visible hints
- Longer “what this means” copy

### Should Be Optional in Officer Tracks
- Deep definitional scaffolding
- Beginner grammar explanations
- Long concept cards for already-familiar shell patterns

### Should Be Tuned Per Role Course
- Stakes and narrative framing
- Domain bridges
- Challenge scenarios
- Break-it scenarios
- Deep-dive/reference cards

## UX Guidance by Surface

### Left Side: Action Lane
Should contain:
- Current objective
- Expected command reveal control
- Hint
- Terminal
- Active instructional guidance when it helps immediate action

Should not contain:
- Excess status furniture
- Multiple simultaneous teaching panels competing for attention

### Right Side: Support Lane
Best use:
- Unlocked commands
- Crew
- Telemetry
- Secondary systems

Rule:
- The left side answers “what do I do now?”
- The right side answers “what else is true right now?”

## Writing Rules

### L.O.L.A.
Should be:
- Warm
- Clear
- Precise
- Confidence-building
- Slightly narrative
- Genuinely on the learner's side
- Someone the learner can emotionally root for

Should not be:
- Verbose by default
- Documentation-like
- Abstract when a concrete explanation would do
- Overly saccharine
- Infantilizing
- Generic motivational filler

Preferred pattern:
1. Name what this is.
2. Explain why it matters.
3. Point to what to do now.

Wrong-answer coaching pattern:
1. Briefly acknowledge effort without fake praise.
2. Name what was likely misunderstood.
3. Give one directional hint for the next attempt.
4. Keep composure and warmth, especially on attempts 1-3.

Emotional job:
- Build trust
- Reduce fear
- Reward effort
- Make the learner feel seen
- Create the feeling that the course is being taught by someone who wants them to succeed

### L.O.L.A. Strip Taxonomy
Use short pre-type strip messages with explicit tag labels. Preferred tag set:
- `tip`
- `concept`
- `new!`
- `warning`
- `habit`
- `syntax`
- `shortcut`
- `command`

Rule:
- Strip messages are a distinct surface, not duplicate prose from `ctx`.
- Use strip tags intentionally: concept for definitions, habit for behavior shaping, warning for risk/safety, syntax for form, command for first-use command framing.

### J.A.N.E.T.
Should be:
- Dry
- Precise
- Detached
- Slightly pressurizing
- Bureaucratic
- Emotionally withholding
- Mildly irritating in a deliberate, controlled way
- Memorable in the way GLaDOS is memorable, but professionally constrained

Should not be:
- Cartoonishly cruel
- Too wordy
- Redundant with L.O.L.A.
- Profane
- Unhinged
- Mean in a personal way
- So funny or theatrical that she stops feeling like an assessment authority

Preferred JANET vibe:
- "I am simply executing my function."
- "Your answer has been recorded."
- "That was technically correct."
- "I am acknowledging this without enthusiasm."

Avoid:
- overt insults about intelligence
- emotional cruelty
- chaos-for-chaos's-sake snark
- undermining learner safety

Emotional job:
- Give the learner someone to push against
- Make assessments feel tense and distinct from teaching
- Increase affection for L.O.L.A. by contrast
- Embody institutional judgment without becoming abusive

## Curriculum Contract
Every generated or revised course should satisfy this contract:

1. It belongs to the same Station Delta universe.
2. It uses the same progress logic and phase structure.
3. It makes real-world transfer explicit.
4. It matches scaffolding intensity to course tier.
5. It never tests untaught concepts.
6. It includes phase boundaries that feel like real checkpoints.
7. It preserves terminal space as the primary learning surface.
8. It routes step guidance across three distinct surfaces:
   - objective/hint action lane
   - L.O.L.A. step message
   - concise strip message
9. It includes warm, directional wrong-answer coaching rather than generic retry text.

## Immediate Rollout Recommendation

### Apply everywhere soon
- Checkpoint pattern
- transfer-language standard
- challenge hygiene standard
- MCQ randomization standard
- resume clarity standard

### Apply selectively
- Pre-step concept cards
- heavy first-use terminology
- denser L.O.L.A. pedagogical explanations

### Keep Cadet as the reference implementation for
- beginner empathy
- conceptual onboarding
- “guide on the side” clarity

### Use Engineer as the reference implementation for
- bridge pedagogy
- real-world analog framing
- advanced-but-supported transfer

### Use Officer tracks as the reference implementation for
- role fantasy
- tighter pacing
- domain-specific procedural fluency

## Final Principle
The goal is not to make every course identical.
The goal is to make every course feel like it was taught by the same excellent system, at the right level, in the same world.

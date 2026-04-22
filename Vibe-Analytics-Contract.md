# Vibe Analytics Contract (v1)

This contract keeps analytics consistent across all 13 courses.

## Event Model
- `command_entered`: every terminal command, including sandbox and challenge modes.
- `phase_started`: first time learner enters a phase.
- `phase_completed`: phase completion with total duration.
- `step_started`: first time learner lands on a step.
- `step_attempt`: every assessed attempt with `correct=true|false`.
- `step_completed`: first correct completion with computed TTR.

## Core Storage Shape
- `analytics.version`
- `analytics.courseId`
- `analytics.sessionId`
- `analytics.sessionStartedAt`
- `analytics.lastEventAt`
- `analytics.events[]`
- `analytics.phases{ pN -> {phase,title,startedAt,completedAt,durationMs} }`
- `analytics.steps{ stepId -> {phase,objective,attempts,wrongAttempts,ttrMs,...} }`

## Derived Reports
- `TTR report`: per-step attempts + wrong attempts + `ttrSeconds`.
- `Heatmap report`: per-step `masteryScore` and `intensity`.
- `Gantt report`: phase and step start/end times for timeline charting.

## Browser API Standard
Each course should expose:
- `window.vibeAnalytics.getRaw()`
- `window.vibeAnalytics.getTTRReport()`
- `window.vibeAnalytics.getHeatmapReport()`
- `window.vibeAnalytics.getGanttReport()`
- `window.vibeAnalytics.getSnapshot()`
- `window.vibeAnalytics.exportJSON()`

## Course Build Rule
Every new course must:
1. Set a unique `COURSE_ID`.
2. Set a unique local save key.
3. Keep the analytics event names unchanged.
4. Keep step ids stable (`pXsY` or explicit ids) for trend continuity.
5. Emit the same report interfaces so backend ingestion is plug-and-play.

# BAE Slide — Technical Architecture (Single Slide Copy)

## Title
**Station Delta Technical Architecture: Secure Training + Measurable Readiness**

## Left Column — Runtime Flow
1. Learner launches sim (Cadet/Engineer track).  
2. Objective engine validates command behavior and sequence logic.  
3. Guidance/assessment loop (LOLA coaching + JANET evaluation).  
4. Event telemetry emitted for each meaningful interaction.  
5. Dashboard layer summarizes readiness and friction trends.

## Right Column — Security and Deployment Posture
- API keys are server-side only (never exposed in client runtime).
- Analytics ingestion through controlled webhook/API endpoint.
- Role-based future path for org-level dashboards.
- Supports progression toward controlled-network and constrained-runtime deployment patterns.

## Bottom Bar — Data Captured
- Step start and completion
- Retry count
- Hint usage
- Phase time-to-resolution (TTR)
- Checkpoint pause/resume events

## Speaker Notes (30–45 seconds)
"This architecture is intentionally practical: scenario delivery on top, objective validation in the middle, and measurable readiness signals underneath. We can run this as a lightweight web deployment now and harden deployment modes for restricted environments as pilot constraints require."


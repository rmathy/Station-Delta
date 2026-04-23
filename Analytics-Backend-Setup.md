# Station Delta Analytics Backend Setup

## What is now live in code

- Client auto-sync script: [analytics-client.js](/Users/rmathy/Documents/Codex/2026-04-22-files-mentioned-by-the-user-station/analytics-client.js)
- Ingest endpoint: [api/analytics-ingest.js](/Users/rmathy/Documents/Codex/2026-04-22-files-mentioned-by-the-user-station/api/analytics-ingest.js)
- Recent-events endpoint: [api/analytics-recent.js](/Users/rmathy/Documents/Codex/2026-04-22-files-mentioned-by-the-user-station/api/analytics-recent.js)
- Wired into sims:
  - [vibe-cadet.html](/Users/rmathy/Documents/Codex/2026-04-22-files-mentioned-by-the-user-station/vibe-cadet.html)
  - [vibe-engineer.html](/Users/rmathy/Documents/Codex/2026-04-22-files-mentioned-by-the-user-station/vibe-engineer.html)
  - [vibe-lieutenant.html](/Users/rmathy/Documents/Codex/2026-04-22-files-mentioned-by-the-user-station/vibe-lieutenant.html)

## How it works

- Every 15s (and on tab hide/unload), sims send new analytics events to `/api/analytics-ingest`.
- Endpoint accepts payload and stores a rolling in-memory buffer + `/tmp` log.
- If `ANALYTICS_WEBHOOK_URL` is configured, endpoint forwards every packet to that webhook for durable storage.

## Recommended production configuration

Set these in Vercel Project Environment Variables:

- `ANALYTICS_WEBHOOK_URL` = your durable sink endpoint (recommended)
- `ANALYTICS_DASHBOARD_KEY` = a random secret used to protect `/api/analytics-recent`

## View incoming data

- Quick recent stream:
  - `GET /api/analytics-recent?limit=100&key=YOUR_ANALYTICS_DASHBOARD_KEY`
- Example:
  - `https://station-delta-one.vercel.app/api/analytics-recent?limit=100&key=...`

## Durable sink options (no big rebuild needed)

1. Google Apps Script webhook -> Google Sheet (easiest)
2. Airtable webhook
3. Supabase Edge Function / insert endpoint
4. Zapier / Make webhook (for notifications + routing)

## Alerting

- Trigger alert when new packet arrives at your webhook sink:
  - Email to `hello@stationdelta.dev`
  - CC/BCC to `richard@fccbrewery.com`
  - Optional Slack/Discord notification


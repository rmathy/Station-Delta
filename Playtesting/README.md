# Station Delta Playtesting

This folder supports two QA modes:

1. `npm run qa:static`
Runs a dependency-free offline evidence check against the local HTML files. Use this behind a firewall or anytime the production site is unreachable.

2. `npm run qa:playwright`
Runs the full browser suite against `https://station-delta-one.vercel.app` once network access is available.

## First-time setup

```bash
cd Playtesting
npm install
```

If you are behind a restrictive firewall, the install step may fail because it needs `registry.npmjs.org`.

## Recommended run order

### Firewall-safe preflight

```bash
cd Playtesting
npm run qa:static
```

This verifies:
- terminal live-region attributes
- analytics client wiring
- analytics event contract presence
- checkpoint/resume markers
- mobile hardening markers

### Full production run

```bash
cd Playtesting
npm run qa:playwright
```

Optional stricter analytics assertion:

```bash
cd Playtesting
REQUIRE_ANALYTICS_POST=1 npm run qa:playwright
```

That mode hard-fails if no analytics POST is seen.

## Firewall note

If the school firewall blocks either:
- `registry.npmjs.org`
- `station-delta-one.vercel.app`

then treat `qa:static` as the preflight artifact and defer the full Playwright evidence run until you are on a less restrictive network.

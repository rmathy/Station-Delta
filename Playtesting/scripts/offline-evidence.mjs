import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const sims = [
  { name: 'Cadet', file: path.join(root, 'base', 'vibe-cadet.html'), courseId: 'vibe-cadet-gold' },
  { name: 'Engineer', file: path.join(root, 'base', 'vibe-engineer.html'), courseId: 'vibe-engineer' },
  { name: 'Lieutenant', file: path.join(root, 'base', 'vibe-lieutenant.html'), courseId: 'vibe-lieutenant' },
];

const analyticsClientPath = path.join(root, 'analytics-client.js');
const analyticsClient = fs.readFileSync(analyticsClientPath, 'utf8');

function has(pattern, text) {
  return pattern.test(text);
}

function result(ok, label, detail) {
  return { ok, label, detail };
}

function inspectSim(sim) {
  const html = fs.readFileSync(sim.file, 'utf8');
  const checks = [];

  checks.push(result(
    has(/id="output-static"[^>]*role="log"[^>]*aria-live="polite"/, html) &&
      has(/id="output"[^>]*role="log"[^>]*aria-live="polite"/, html),
    'terminal live regions',
    'Both output zones expose role="log" and aria-live="polite".'
  ));

  checks.push(result(
    has(/window\.vibeAnalytics\s*=\s*\{/, html) &&
      has(/getRaw:\(\)=>JSON\.parse\(JSON\.stringify\(G\.analytics\|\|\{\}\)\)/, html),
    'analytics object export',
    'Page exposes window.vibeAnalytics with raw export access.'
  ));

  checks.push(result(
    has(/analyticsEvent\('phase_started'/, html) &&
      has(/analyticsEvent\('step_attempt'/, html) &&
      has(/analyticsEvent\('step_completed'/, html) &&
      has(/analyticsEvent\('command_entered'/, html),
    'analytics event contract',
    'Core phase/step/command events are instrumented.'
  ));

  checks.push(result(
    has(/pendingPhaseStart\s*:\s*false/, html) &&
      (has(/phase_checkpoint_opened/, html) || has(/openPhaseCheckpoint/, html)) &&
      has(/session_resumed|resumeSession/, html),
    'checkpoint and resume hooks',
    'Checkpoint state and resume flow markers are present.'
  ));

  checks.push(result(
    has(/@media\(max-width:820px\)/, html) &&
      has(/#cmd\{font-size:16px/, html) &&
      has(/min-height:36px;min-width:44px/, html),
    'mobile hardening markers',
    'Mobile breakpoint increases input sizing and touch target minimums.'
  ));

  checks.push(result(
    has(/<script src="analytics-client\.js"><\/script>/, html),
    'analytics client include',
    'Page loads analytics-client.js.'
  ));

  return checks;
}

const analyticsChecks = [
  result(
    has(/const ENDPOINT = "\/api\/analytics-ingest";/, analyticsClient),
    'analytics endpoint',
    'Client posts to /api/analytics-ingest.'
  ),
  result(
    has(/setInterval\(\(\) => flush\("interval", false\), FLUSH_INTERVAL_MS\);/, analyticsClient) &&
      has(/visibilitychange/, analyticsClient) &&
      has(/beforeunload/, analyticsClient),
    'analytics flush triggers',
    'Client flushes on interval, hidden, and beforeunload.'
  ),
  result(
    has(/fetch\(ENDPOINT,\s*\{/, analyticsClient) &&
      has(/method:\s*"POST"/, analyticsClient),
    'analytics POST transport',
    'Client uses fetch POST delivery for analytics.'
  ),
];

let failures = 0;

console.log('Station Delta Offline Evidence Check');
console.log(`Repo root: ${root}`);
console.log('');

for (const sim of sims) {
  console.log(`${sim.name}`);
  const checks = inspectSim(sim);
  for (const check of checks) {
    if (!check.ok) failures += 1;
    console.log(`- ${check.ok ? 'PASS' : 'FAIL'}: ${check.label} — ${check.detail}`);
  }
  console.log('');
}

console.log('Shared analytics client');
for (const check of analyticsChecks) {
  if (!check.ok) failures += 1;
  console.log(`- ${check.ok ? 'PASS' : 'FAIL'}: ${check.label} — ${check.detail}`);
}

console.log('');
if (failures > 0) {
  console.error(`Offline evidence check failed with ${failures} issue(s).`);
  process.exitCode = 1;
} else {
  console.log('Offline evidence check passed.');
}

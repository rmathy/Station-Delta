(function () {
  const ENDPOINT = "/api/analytics-ingest";
  const MAX_EVENTS_PER_FLUSH = 200;
  const FLUSH_INTERVAL_MS = 15000;
  const HEARTBEAT_INTERVAL_MS = 60000;
  const ALLOW_BEACON = false; // Keep strict delivery semantics (ack-driven cursor advancement).

  let inFlight = false;
  let lastHeartbeat = 0;

  function getVA() {
    return window.vibeAnalytics && typeof window.vibeAnalytics.getRaw === "function" ? window.vibeAnalytics : null;
  }

  function getRaw() {
    const va = getVA();
    if (!va) return null;
    try {
      return va.getRaw();
    } catch {
      return null;
    }
  }

  function cursorKey(raw) {
    const c = raw && raw.courseId ? raw.courseId : "unknown";
    const s = raw && raw.sessionId ? raw.sessionId : "unknown";
    return `sd_analytics_cursor:${c}:${s}`;
  }

  function getCursor(raw) {
    const n = Number(sessionStorage.getItem(cursorKey(raw)) || "0");
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }

  function setCursor(raw, n) {
    sessionStorage.setItem(cursorKey(raw), String(Math.max(0, n)));
  }

  function buildPayload(raw, cursor, reason) {
    const events = Array.isArray(raw.events) ? raw.events : [];
    const chunk = events.slice(cursor, cursor + MAX_EVENTS_PER_FLUSH);
    const va = getVA();
    const snapshot = va && typeof va.getSnapshot === "function" ? va.getSnapshot() : null;
    return {
      courseId: raw.courseId || "unknown",
      sessionId: raw.sessionId || "unknown",
      sessionStartedAt: raw.sessionStartedAt || null,
      lastEventAt: raw.lastEventAt || null,
      eventCursorStart: cursor,
      eventCursorEnd: cursor + chunk.length,
      reason,
      page: location.pathname,
      events: chunk,
      snapshot,
      meta: {
        userAgent: navigator.userAgent,
        viewport: { w: window.innerWidth, h: window.innerHeight },
      },
    };
  }

  function sendWithBeacon(payload) {
    try {
      if (!navigator.sendBeacon) return false;
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      return navigator.sendBeacon(ENDPOINT, blob);
    } catch {
      return false;
    }
  }

  async function sendWithFetch(payload) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    let body = null;
    try { body = await res.json(); } catch {}
    if (!res.ok) {
      const reason = body && body.webhookError ? ` (${body.webhookError})` : "";
      throw new Error(`Analytics ingest failed: ${res.status}${reason}`);
    }
    return true;
  }

  async function flush(reason, preferBeacon) {
    if (inFlight) return;
    const raw = getRaw();
    if (!raw) return;

    const cursor = getCursor(raw);
    const events = Array.isArray(raw.events) ? raw.events : [];
    const hasNewEvents = events.length > cursor;
    const now = Date.now();
    const shouldHeartbeat = now - lastHeartbeat >= HEARTBEAT_INTERVAL_MS;

    if (!hasNewEvents && !shouldHeartbeat) return;

    const payload = buildPayload(raw, cursor, hasNewEvents ? reason : "heartbeat");
    if (!payload.events.length && payload.reason !== "heartbeat") return;

    inFlight = true;
    try {
      let ok = false;
      if (preferBeacon && ALLOW_BEACON) ok = sendWithBeacon(payload);
      if (!ok) ok = await sendWithFetch(payload);
      if (ok) {
        setCursor(raw, payload.eventCursorEnd);
        if (payload.reason === "heartbeat") lastHeartbeat = now;
      }
    } catch {
      // best-effort telemetry only
    } finally {
      inFlight = false;
    }
  }

  function boot() {
    // Initial best-effort startup flush.
    flush("boot", false);
    setInterval(() => flush("interval", false), FLUSH_INTERVAL_MS);

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush("hidden", true);
    });

    window.addEventListener("beforeunload", () => {
      flush("beforeunload", true);
    });
  }

  // Wait for vibeAnalytics to exist before wiring.
  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    if (getVA()) {
      clearInterval(timer);
      boot();
    } else if (attempts > 60) {
      clearInterval(timer);
    }
  }, 500);
})();

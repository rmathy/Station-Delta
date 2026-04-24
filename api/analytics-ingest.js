const fs = require("fs/promises");

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function asArray(v) {
  return Array.isArray(v) ? v : [];
}

function truncateString(v, max = 800) {
  const s = typeof v === "string" ? v : String(v ?? "");
  return s.length > max ? s.slice(0, max) + "…(truncated)" : s;
}

function normalizeBody(body) {
  const b = body && typeof body === "object" ? body : {};
  const events = asArray(b.events)
    .filter((e) => e && typeof e === "object")
    .map((e) => ({
      type: String(e.type || "unknown"),
      at: e.at || null,
      phase: e.phase ?? null,
      step: e.step ?? null,
      ...e,
    }));

  return {
    courseId: String(b.courseId || "unknown"),
    sessionId: String(b.sessionId || "unknown"),
    sessionStartedAt: b.sessionStartedAt || null,
    lastEventAt: b.lastEventAt || null,
    eventCursorStart: Number.isFinite(b.eventCursorStart) ? b.eventCursorStart : null,
    eventCursorEnd: Number.isFinite(b.eventCursorEnd) ? b.eventCursorEnd : null,
    reason: String(b.reason || "interval"),
    page: String(b.page || ""),
    events,
    snapshot: b.snapshot && typeof b.snapshot === "object" ? b.snapshot : null,
    meta: b.meta && typeof b.meta === "object" ? b.meta : null,
  };
}

function compactForWebhook(packet) {
  const events = asArray(packet.events).slice(0, 120).map((e) => {
    const out = {};
    for (const [k, v] of Object.entries(e || {})) {
      if (v == null) out[k] = v;
      else if (typeof v === "string") out[k] = truncateString(v, 600);
      else if (typeof v === "number" || typeof v === "boolean") out[k] = v;
      else out[k] = truncateString(JSON.stringify(v), 600);
    }
    return out;
  });

  const snapshot = packet.snapshot
    ? {
        courseId: packet.snapshot.courseId || packet.courseId,
        sessionId: packet.snapshot.sessionId || packet.sessionId,
        totals: packet.snapshot.totals || null,
        phases: asArray(packet.snapshot.phases).slice(0, 30),
        steps: asArray(packet.snapshot.steps).slice(0, 250),
      }
    : null;

  return {
    ...packet,
    events,
    eventOverflow: Math.max(0, asArray(packet.events).length - events.length),
    snapshot,
  };
}

async function postJson(url, payload) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort("Webhook timeout"), 10000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    const text = await res.text().catch(() => "");
    return { ok: res.ok, status: res.status, body: truncateString(text, 500) };
  } finally {
    clearTimeout(t);
  }
}

async function postForm(url, payload) {
  const form = new URLSearchParams();
  form.set("payload", JSON.stringify(payload));
  form.set("courseId", String(payload.courseId || "unknown"));
  form.set("sessionId", String(payload.sessionId || "unknown"));
  form.set("receivedAt", String(payload.receivedAt || ""));
  form.set("eventCount", String(asArray(payload.events).length));

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort("Webhook timeout"), 10000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: form.toString(),
      signal: ctrl.signal,
    });
    const text = await res.text().catch(() => "");
    return { ok: res.ok, status: res.status, body: truncateString(text, 500) };
  } finally {
    clearTimeout(t);
  }
}

async function forwardToWebhook(packet) {
  const webhookUrl = process.env.ANALYTICS_WEBHOOK_URL;
  if (!webhookUrl) return { used: false, ok: false };

  const compact = compactForWebhook(packet);
  const isGoogleScript = /script\.google(?:usercontent)?\.com/i.test(webhookUrl);

  try {
    if (isGoogleScript) {
      // Apps Script webhooks are sometimes configured to read either JSON body
      // or e.parameter payload; support both by trying JSON then form fallback.
      const first = await postJson(webhookUrl, compact);
      if (first.ok) return { used: true, ok: true, status: first.status, mode: "json" };

      const second = await postForm(webhookUrl, compact);
      return {
        used: true,
        ok: second.ok,
        status: second.status,
        mode: "form-fallback",
        firstStatus: first.status,
        firstBody: first.body,
        secondBody: second.body,
      };
    }

    const res = await postJson(webhookUrl, compact);
    return { used: true, ok: res.ok, status: res.status, mode: "json", body: res.body };
  } catch (err) {
    return { used: true, ok: false, error: String(err?.message || err) };
  }
}

async function appendTmpLog(packet) {
  try {
    await fs.appendFile("/tmp/station-delta-analytics.ndjson", JSON.stringify(packet) + "\n", "utf8");
    return true;
  } catch {
    return false;
  }
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const normalized = normalizeBody(req.body);
  const packet = {
    receivedAt: new Date().toISOString(),
    ...normalized,
  };

  // In-memory rolling buffer for quick inspection/debug in warm instances.
  globalThis.__sdAnalyticsBuffer = globalThis.__sdAnalyticsBuffer || [];
  globalThis.__sdAnalyticsBuffer.push(packet);
  if (globalThis.__sdAnalyticsBuffer.length > 500) {
    globalThis.__sdAnalyticsBuffer = globalThis.__sdAnalyticsBuffer.slice(-500);
  }

  const webhook = await forwardToWebhook(packet);
  const tmpLogged = await appendTmpLog(packet);

  const webhookRequired = Boolean(process.env.ANALYTICS_WEBHOOK_URL);
  const deliveryOk = !webhookRequired || webhook.ok;
  const statusCode = deliveryOk ? 200 : 502;

  return res.status(statusCode).json({
    ok: deliveryOk,
    acceptedEvents: packet.events.length,
    sink: webhook.used ? "webhook" : "local-buffer",
    webhookOk: webhook.used ? webhook.ok : null,
    webhookStatus: webhook.status || null,
    webhookMode: webhook.mode || null,
    webhookError: webhook.error || null,
    webhookFirstStatus: webhook.firstStatus || null,
    tmpLogged,
  });
};

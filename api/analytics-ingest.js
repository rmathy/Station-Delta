const fs = require("fs/promises");

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function asArray(v) {
  return Array.isArray(v) ? v : [];
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

async function forwardToWebhook(packet) {
  const webhookUrl = process.env.ANALYTICS_WEBHOOK_URL;
  if (!webhookUrl) return { used: false, ok: false };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(packet),
    });
    return { used: true, ok: res.ok, status: res.status };
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

  return res.status(200).json({
    ok: true,
    acceptedEvents: packet.events.length,
    sink: webhook.used ? "webhook" : "local-buffer",
    webhookOk: webhook.used ? webhook.ok : null,
    tmpLogged,
  });
};


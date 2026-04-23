const fs = require("fs/promises");

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function readTmp(limit) {
  try {
    const raw = await fs.readFile("/tmp/station-delta-analytics.ndjson", "utf8");
    const rows = raw
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));
    return rows.slice(-limit);
  } catch {
    return [];
  }
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const key = process.env.ANALYTICS_DASHBOARD_KEY;
  const given = req.headers["x-analytics-key"] || req.query.key;
  if (key && given !== key) return res.status(401).json({ ok: false, error: "Unauthorized" });

  const limit = Math.min(500, Math.max(1, Number(req.query.limit || 100)));
  const inMemory = Array.isArray(globalThis.__sdAnalyticsBuffer) ? globalThis.__sdAnalyticsBuffer.slice(-limit) : [];
  const fromTmp = await readTmp(limit);
  const events = (inMemory.length ? inMemory : fromTmp).slice(-limit);

  return res.status(200).json({
    ok: true,
    count: events.length,
    events,
  });
};


const crypto = require("crypto");

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizePlan(plan) {
  return String(plan || "").toLowerCase().trim();
}

function getPlanCatalog() {
  return {
    ai_systems_pass: {
      plan: "ai_systems_pass",
      priceEnv: "STRIPE_PRICE_AI_SYSTEMS_PASS",
      tier: "ai_systems_pass",
      label: "Station Delta: AI Systems Track",
    },
    fleet: {
      plan: "fleet",
      priceEnv: "STRIPE_PRICE_FLEET",
      tier: "fleet",
      label: "Station Delta: AI Systems Fleet",
    },
  };
}

function getPlanConfig(plan) {
  const key = normalizePlan(plan);
  const catalog = getPlanCatalog();
  const config = catalog[key];
  if (!config) {
    throw new Error(`Unsupported billing plan: ${plan}`);
  }
  return {
    ...config,
    priceId: requireEnv(config.priceEnv),
  };
}

function tierFromPriceId(priceId) {
  const id = String(priceId || "");
  if (!id) return null;
  const catalog = Object.values(getPlanCatalog());
  for (const entry of catalog) {
    const envValue = process.env[entry.priceEnv];
    if (envValue && envValue === id) {
      return entry.tier;
    }
  }
  return null;
}

function isActiveSubscriptionStatus(status) {
  return ["trialing", "active"].includes(String(status || "").toLowerCase());
}

async function stripeApi(path, options = {}) {
  const secretKey = requireEnv("STRIPE_SECRET_KEY");
  const method = options.method || "GET";
  const headers = {
    Authorization: `Bearer ${secretKey}`,
    ...options.headers,
  };

  let body;
  if (options.form instanceof URLSearchParams) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = options.form.toString();
  } else if (typeof options.body === "string" || options.body instanceof Buffer) {
    body = options.body;
  }

  const res = await fetch(`https://api.stripe.com${path}`, {
    method,
    headers,
    body,
  });

  const text = await res.text();
  let parsed = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }

  if (!res.ok) {
    const message =
      parsed?.error?.message ||
      parsed?.message ||
      text ||
      `Stripe API error (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = parsed;
    throw err;
  }

  return parsed;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === "object") {
      resolve(req.body);
      return;
    }

    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function verifyStripeSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader) {
    throw new Error("Missing Stripe signature header");
  }

  const entries = Object.fromEntries(
    String(signatureHeader)
      .split(",")
      .map((part) => {
        const [k, ...rest] = part.split("=");
        return [k, rest.join("=")];
      })
  );

  const timestamp = entries.t;
  const signature = entries.v1;
  if (!timestamp || !signature) {
    throw new Error("Malformed Stripe signature header");
  }

  const payload = `${timestamp}.${rawBody.toString("utf8")}`;
  const expected = crypto.createHmac("sha256", secret).update(payload, "utf8").digest("hex");
  const provided = Buffer.from(signature, "hex");
  const actual = Buffer.from(expected, "hex");

  if (provided.length !== actual.length || !crypto.timingSafeEqual(provided, actual)) {
    throw new Error("Invalid Stripe signature");
  }

  return JSON.parse(rawBody.toString("utf8"));
}

function getSupabaseHeaders() {
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

function supabaseRestUrl(path) {
  const base = requireEnv("SUPABASE_URL").replace(/\/+$/, "");
  return `${base}/rest/v1/${path}`;
}

async function updateProfileByUserId(userId, patch) {
  if (!userId) throw new Error("updateProfileByUserId requires userId");
  const url = `${supabaseRestUrl("profiles")}?id=eq.${encodeURIComponent(userId)}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: getSupabaseHeaders(),
    body: JSON.stringify(patch),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Supabase profile update failed (${res.status}): ${text}`);
  }
  try {
    return text ? JSON.parse(text) : [];
  } catch {
    return [];
  }
}

async function findProfileByStripeCustomerId(customerId) {
  if (!customerId) return null;
  const url = `${supabaseRestUrl("profiles")}?stripe_customer_id=eq.${encodeURIComponent(
    customerId
  )}&select=id,email,subscription_tier,stripe_customer_id,stripe_subscription_id&limit=1`;
  const res = await fetch(url, {
    method: "GET",
    headers: getSupabaseHeaders(),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Supabase profile lookup failed (${res.status}): ${text}`);
  }
  const rows = text ? JSON.parse(text) : [];
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function findProfileByEmail(email) {
  if (!email) return null;
  const url = `${supabaseRestUrl("profiles")}?email=eq.${encodeURIComponent(
    email
  )}&select=id,email,subscription_tier,stripe_customer_id,stripe_subscription_id&limit=1`;
  const res = await fetch(url, {
    method: "GET",
    headers: getSupabaseHeaders(),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Supabase profile lookup by email failed (${res.status}): ${text}`);
  }
  const rows = text ? JSON.parse(text) : [];
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

function deriveTierFromSubscription(subscription) {
  const priceId = subscription?.items?.data?.[0]?.price?.id || "";
  const metadataTier =
    normalizePlan(subscription?.metadata?.access_tier) ||
    normalizePlan(subscription?.metadata?.plan);

  if (tierFromPriceId(priceId)) return tierFromPriceId(priceId);
  if (metadataTier && getPlanCatalog()[metadataTier]) return getPlanCatalog()[metadataTier].tier;
  return "free";
}

async function syncProfileFromSubscription(subscription, fallbackUserId = null) {
  const customerId = subscription?.customer || null;
  const subscriptionId = subscription?.id || null;
  const active = isActiveSubscriptionStatus(subscription?.status);
  const nextTier = active ? deriveTierFromSubscription(subscription) : "free";
  const metadataUserId = subscription?.metadata?.user_id || null;
  const userId = metadataUserId || fallbackUserId || (await findProfileByStripeCustomerId(customerId))?.id;

  if (!userId) {
    return {
      ok: false,
      reason: "missing_user_id",
      customerId,
      subscriptionId,
      nextTier,
    };
  }

  await updateProfileByUserId(userId, {
    subscription_tier: nextTier,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
  });

  return {
    ok: true,
    userId,
    customerId,
    subscriptionId,
    nextTier,
  };
}

function getBaseUrl(req) {
  const envUrl = process.env.PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  if (envUrl) return envUrl.replace(/\/+$/, "");
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

module.exports = {
  json,
  setCors,
  readJsonBody,
  readRawBody,
  verifyStripeSignature,
  stripeApi,
  getPlanConfig,
  getPlanCatalog,
  getBaseUrl,
  updateProfileByUserId,
  findProfileByStripeCustomerId,
  findProfileByEmail,
  syncProfileFromSubscription,
  deriveTierFromSubscription,
  isActiveSubscriptionStatus,
  requireEnv,
};

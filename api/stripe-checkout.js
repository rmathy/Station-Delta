const {
  json,
  setCors,
  readJsonBody,
  stripeApi,
  getPlanConfig,
  getBaseUrl,
  findProfileByEmail,
} = require("./_stripe-billing");

function getBodyFromRequest(req) {
  if (req.method === "GET") {
    const url = new URL(req.url, "https://stationdelta.dev");
    return {
      plan: url.searchParams.get("plan") || "",
      userId: url.searchParams.get("userId") || "",
      email: url.searchParams.get("email") || "",
      successUrl: url.searchParams.get("successUrl") || "",
      cancelUrl: url.searchParams.get("cancelUrl") || "",
      redirect: url.searchParams.get("redirect") === "1",
    };
  }
  return readJsonBody(req);
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!["GET", "POST"].includes(req.method)) {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body = await getBodyFromRequest(req);
    const plan = getPlanConfig(body.plan);
    const requestedUserId = String(body.userId || "").trim();
    const email = String(body.email || "").trim();
    const origin = getBaseUrl(req);
    const profile = !requestedUserId && email ? await findProfileByEmail(email) : null;
    const userId = requestedUserId || profile?.id || "";

    if (!userId) {
      return json(res, 400, {
        ok: false,
        error: "Missing required field: userId. You can also provide a known profile email."
      });
    }

    const successUrl =
      body.successUrl ||
      `${origin}/auth.html?billing=success&plan=${encodeURIComponent(plan.plan)}`;
    const cancelUrl =
      body.cancelUrl ||
      `${origin}/auth.html?billing=cancelled&plan=${encodeURIComponent(plan.plan)}`;

    const form = new URLSearchParams();
    form.set("mode", "subscription");
    form.set("success_url", successUrl);
    form.set("cancel_url", cancelUrl);
    form.set("allow_promotion_codes", "true");
    form.set("billing_address_collection", "auto");
    form.set("client_reference_id", userId);
    form.set("line_items[0][price]", plan.priceId);
    form.set("line_items[0][quantity]", "1");
    form.set("metadata[user_id]", userId);
    form.set("metadata[plan]", plan.plan);
    form.set("metadata[access_tier]", plan.tier);
    form.set("subscription_data[metadata][user_id]", userId);
    form.set("subscription_data[metadata][plan]", plan.plan);
    form.set("subscription_data[metadata][access_tier]", plan.tier);

    if (email) {
      form.set("customer_email", email);
    }

    const session = await stripeApi("/v1/checkout/sessions", {
      method: "POST",
      form,
    });

    if (req.method === "GET" || body.redirect) {
      res.statusCode = 302;
      res.setHeader("Location", session.url);
      res.end();
      return;
    }

    return json(res, 200, {
      ok: true,
      sessionId: session.id,
      url: session.url,
      plan: plan.plan,
      tier: plan.tier,
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: String(err?.message || err),
    });
  }
};

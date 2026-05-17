const {
  json,
  readRawBody,
  verifyStripeSignature,
  stripeApi,
  syncProfileFromSubscription,
  updateProfileByUserId,
  findProfileByStripeCustomerId,
  findProfileByEmail,
  requireEnv,
} = require("./_stripe-billing");

async function handleCheckoutCompleted(session) {
  // One-time payment (bundle purchase)
  if (session.mode === "payment") {
    const tier = session.metadata?.access_tier;
    if (!tier) return { ok: true, ignored: true, reason: "payment_missing_tier" };

    const userId = session.client_reference_id || session.metadata?.user_id || null;
    const email = session.customer_details?.email || null;
    const profile = !userId && email ? await findProfileByEmail(email) : null;
    const resolvedId = userId || profile?.id || null;

    if (!resolvedId) return { ok: false, reason: "missing_user_id_for_bundle" };

    await updateProfileByUserId(resolvedId, {
      subscription_tier: tier,
      stripe_customer_id: session.customer || null,
    });

    return { ok: true, userId: resolvedId, nextTier: tier };
  }

  // Subscription checkout
  if (session.mode !== "subscription" || !session.subscription) {
    return { ok: true, ignored: true, reason: "not_subscription_checkout" };
  }

  const subscription = await stripeApi(`/v1/subscriptions/${session.subscription}`);
  const result = await syncProfileFromSubscription(
    subscription,
    session.client_reference_id || session.metadata?.user_id || null
  );

  if (result.ok && session.customer && result.userId) {
    await updateProfileByUserId(result.userId, {
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      subscription_tier: result.nextTier,
    });
  }

  return result;
}

async function handleSubscriptionChanged(subscription) {
  return syncProfileFromSubscription(subscription, subscription?.metadata?.user_id || null);
}

async function handleInvoiceEvent(invoice) {
  if (!invoice.subscription) {
    return { ok: true, ignored: true, reason: "invoice_without_subscription" };
  }
  const subscription = await stripeApi(`/v1/subscriptions/${invoice.subscription}`);
  return syncProfileFromSubscription(subscription, subscription?.metadata?.user_id || null);
}

async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription?.customer || null;
  const metadataUserId = subscription?.metadata?.user_id || null;
  const profile = !metadataUserId && customerId ? await findProfileByStripeCustomerId(customerId) : null;
  const userId = metadataUserId || profile?.id || null;

  if (!userId) {
    return { ok: false, reason: "missing_user_id", customerId, subscriptionId: subscription?.id || null };
  }

  await updateProfileByUserId(userId, {
    subscription_tier: "free",
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription?.id || null,
  });

  return {
    ok: true,
    userId,
    customerId,
    subscriptionId: subscription?.id || null,
    nextTier: "free",
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const rawBody = await readRawBody(req);
    const signature = req.headers["stripe-signature"];
    const secret = requireEnv("STRIPE_WEBHOOK_SECRET");
    const event = verifyStripeSignature(rawBody, signature, secret);

    let result = { ok: true, ignored: true, reason: "unhandled_event" };

    switch (event.type) {
      case "checkout.session.completed":
        result = await handleCheckoutCompleted(event.data.object);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        result = await handleSubscriptionChanged(event.data.object);
        break;
      case "customer.subscription.deleted":
        result = await handleSubscriptionDeleted(event.data.object);
        break;
      case "invoice.paid":
      case "invoice.payment_failed":
        result = await handleInvoiceEvent(event.data.object);
        break;
      default:
        break;
    }

    return json(res, 200, {
      ok: true,
      received: true,
      eventType: event.type,
      result,
    });
  } catch (err) {
    return json(res, 400, {
      ok: false,
      error: String(err?.message || err),
    });
  }
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};

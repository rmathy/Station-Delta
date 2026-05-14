-- Station Delta billing setup
-- Run in Supabase SQL Editor before enabling Stripe webhooks.

alter table public.profiles
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

create index if not exists profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id);

create index if not exists profiles_stripe_subscription_id_idx
  on public.profiles (stripe_subscription_id);

comment on column public.profiles.subscription_tier is
'Canonical launch values: free, ai_systems_pass, fleet, all_access. Compatibility aliases may still appear temporarily.';

comment on column public.profiles.stripe_customer_id is
'Stripe customer id used to reconcile webhook events back to a Supabase profile.';

comment on column public.profiles.stripe_subscription_id is
'Stripe subscription id for the currently active or most recent subscription.';

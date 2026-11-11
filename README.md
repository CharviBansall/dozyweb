# Dozy

Official marketing site + web subscription for Dozy — Next.js on Vercel.

## Stripe billing (web)

Same plan as iOS: **$19/month** with a **3-day free trial**, then subscribe to use the product.

| Route / API | Purpose |
| --- | --- |
| `POST /api/checkout` | Create Checkout Session (`mode: subscription`, `trial_period_days: 3`) |
| `POST /api/checkout/complete` | Success-page session sync + cookie (webhook remains authoritative) |
| `POST /api/webhooks/stripe` | Fulfill entitlement on Checkout + subscription lifecycle events |
| `POST /api/portal` | Stripe Customer Portal (manage / cancel) |
| `GET /api/entitlement` | Current entitlement for the signed session |
| `/subscribe` | Paywall |
| `/success`, `/cancel` | Checkout return URLs |
| `/app` | Gated product shell (requires `active` or `trialing`) |

### Env vars

Copy `.env.example` → `.env.local` and set:

- `STRIPE_SECRET_KEY` — prefer a [restricted API key](https://docs.stripe.com/keys#manage-your-api-keys) (`rk_`)
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_ID` — Price for $19/month
- `NEXT_PUBLIC_APP_URL`
- `SESSION_SECRET`
- `JUNCTION_API_KEY` / `JUNCTION_ENVIRONMENT` — optional; cloud sleep sources (Oura / Garmin / Whoop via Junction)

## Junction sleep sources (cloud)

Apple Health stays on-device in the iOS app. For Oura / Garmin / Whoop cloud connect:

| Route | Purpose |
| --- | --- |
| `POST /api/junction/user` | Create/map Junction user |
| `POST /api/junction/link-token` | Open Junction Link widget |
| `GET /api/junction/sleep` | Normalized sleep summaries |
| `POST /api/webhooks/junction` | Sleep created/updated webhooks |
| `/junction/connected` | Link redirect landing |

Whoop on Junction requires **bring-your-own Whoop OAuth app**. See Project store `docs/junction-setup.md`.

### Dashboard / CLI setup

1. Create Product **Dozy Pro**.
2. Add a recurring Price: **$19 USD / month**. Copy the `price_…` id into `STRIPE_PRICE_ID`.
3. Trial is applied in Checkout via `subscription_data.trial_period_days: 3` (no need to hard-code trial on the Price).
4. Enable the Customer Portal (Settings → Billing → Customer portal): allow cancel + payment method update.
5. Add webhook endpoint `https://<your-domain>/api/webhooks/stripe` for at least:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - (recommended) `charge.refunded`, `charge.dispute.created`, `radar.early_fraud_warning.created`
6. Locally: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Entitlement model

Webhook handlers upsert subscription status into a durable local store (`.data/entitlements.json` when the filesystem is writable) and the app sets a signed `dozy_entitlement` cookie after Checkout. Protected `/app` routes require status `active` or `trialing`. Lookups reconcile from the Stripe Subscriptions API when the local cache is cold (e.g. serverless).

If you charge US/EU customers, consider enabling [Stripe Tax](https://docs.stripe.com/billing/taxes/collect-taxes) and active tax registrations before turning on `automatic_tax`.

## Scripts

```bash
npm install
npm run dev
npm run build
```

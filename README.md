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
| `POST /api/auth/apple` | Exchange an Apple identity token for an app session |
| `POST /api/junction/user` | Create/map Junction user |
| `POST /api/junction/link-token` | Open Junction Link widget |
| `POST /api/junction/demo-connect` | Sandbox synthetic provider (no wearable account) |
| `GET /api/junction/sleep` | Normalized sleep summaries |
| `POST /api/webhooks/junction` | Sleep created/updated webhooks |
| `/junction/connected` | Link redirect landing |

### Who may call the Junction routes

The iOS app signs in once with `POST /api/auth/apple` (`{ "identityToken": "<Sign in with Apple identity token>" }`). The server checks Apple's signature, issuer, audience (`APPLE_BUNDLE_ID`, default `charvibansall.dozy`) and expiry, then returns `{ userId, sessionToken, expiresAt }`. The session lasts 90 days and is signed with `SESSION_SECRET`.

The app sends `Authorization: Bearer <sessionToken>` on `/api/junction/user`, `/link-token`, `/sleep` and `/demo-connect`. A session only works for the `clientUserId` it was issued for (401 without a valid session, 403 for someone else's id).

- `JUNCTION_ENVIRONMENT=production`: a session is always required.
- Sandbox: requests without a session are still accepted, so app builds that do not send one yet keep working. Set `JUNCTION_REQUIRE_AUTH=true` to require it there too.

Run the checks with `npm test`.

Sandbox demo providers: `oura`, `whoop_v2`, `apple_health_kit`, `freestyle_libre`. **Garmin has no demo** — needs a real Garmin Connect login via Link. Whoop production also needs **bring-your-own Whoop OAuth**. See Project store `docs/junction-setup.md`.

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

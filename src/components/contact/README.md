# /contact — production notes

## Environment

Copy `.env.example` values into `.env.local` (never commit secrets):

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | yes (to send) | Resend API key |
| `CONTACT_FROM_EMAIL` | yes (to send) | Verified From address, e.g. `contact@ashvi.tech` |
| `CONTACT_TO_EMAIL` | optional | Defaults to `hello@ashvi.tech` |
| `UPSTASH_REDIS_REST_URL` | for prod rate limits | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | for prod rate limits | Upstash Redis REST token |

Without Resend credentials the API returns `503` and the form shows an error — it never claims success.

Without Upstash credentials, shared rate limiting is **unavailable** (reported as `mode: 'unavailable'`). Honeypot + schema validation still apply.

## Resend domain setup (manual)

1. Add `ashvi.tech` (or a subdomain) in Resend.
2. Add the DNS records Resend provides in Cloudflare (SPF / DKIM / optionally DMARC).
3. Wait for verification.
4. Set `CONTACT_FROM_EMAIL` to an address on that verified domain.
5. Set `CONTACT_TO_EMAIL=hello@ashvi.tech`.

## Endpoint

`POST /api/contact` — JSON body `{ name, email, interest, message, company_website? }`

Interest values: `build` | `transform` | `research` | `other`

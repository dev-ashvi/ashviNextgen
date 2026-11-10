import { NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/contact/email'
import { checkContactRateLimit } from '@/lib/contact/rate-limit'
import { validateContactInput } from '@/lib/contact/schema'

export const runtime = 'nodejs'

const MAX_BODY_BYTES = 12_000

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: 'Request too large.' }, { status: 413 })
  }

  let raw: string
  try {
    raw = await request.text()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: 'Request too large.' }, { status: 413 })
  }

  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: bots that fill hidden fields are accepted without delivery.
  if (json && typeof json === 'object' && 'company_website' in json) {
    const hp = (json as { company_website?: unknown }).company_website
    if (typeof hp === 'string' && hp.trim().length > 0) {
      return NextResponse.json({ ok: true })
    }
  }

  const rate = await checkContactRateLimit(clientIp(request))
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again later or email hello@ashvi.tech.' },
      { status: 429 },
    )
  }

  const parsed = validateContactInput(json)
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 })
  }

  const result = await sendContactEmail(parsed.data)
  if (!result.ok) {
    const status = result.code === 'misconfigured' ? 503 : 502
    // Avoid logging personal details or message contents.
    console.error('[contact] delivery failed', { code: result.code })
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't send your message right now. Please try again or email hello@ashvi.tech.",
      },
      { status },
    )
  }

  return NextResponse.json({ ok: true })
}

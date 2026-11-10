/**
 * Shared contact rate limiting.
 *
 * Production requires Upstash Redis credentials. Without them, rate limiting is
 * explicitly unavailable — we do not pretend an in-memory limiter protects Vercel.
 */

export type RateLimitResult = {
  allowed: boolean
  mode: 'upstash' | 'unavailable'
  remaining?: number
}

const WINDOW = '15 m'
const MAX = 5

export async function checkContactRateLimit(identifier: string): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return { allowed: true, mode: 'unavailable' }
  }

  const { Ratelimit } = await import('@upstash/ratelimit')
  const { Redis } = await import('@upstash/redis')

  const ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(MAX, WINDOW),
    analytics: false,
    prefix: 'ashvi:contact',
  })

  const result = await ratelimit.limit(identifier || 'unknown')
  return {
    allowed: result.success,
    mode: 'upstash',
    remaining: result.remaining,
  }
}

export function isRateLimitConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

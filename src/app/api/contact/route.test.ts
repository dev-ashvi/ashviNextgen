import { beforeEach, describe, expect, it, vi } from 'vitest'

const sendContactEmail = vi.fn()
const checkContactRateLimit = vi.fn()

vi.mock('@/lib/contact/email', () => ({
  sendContactEmail: (...args: unknown[]) => sendContactEmail(...args),
}))

vi.mock('@/lib/contact/rate-limit', () => ({
  checkContactRateLimit: (...args: unknown[]) => checkContactRateLimit(...args),
}))

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.resetModules()
    sendContactEmail.mockReset()
    checkContactRateLimit.mockReset()
    checkContactRateLimit.mockResolvedValue({ allowed: true, mode: 'upstash' })
  })

  async function post(body: unknown, init?: RequestInit) {
    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(init?.headers || {}),
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })
    return POST(request)
  }

  const valid = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    interest: 'build',
    message: 'Exploring an AI-native venture in financial operations.',
    company_website: '',
  }

  it('sends a valid Build inquiry', async () => {
    sendContactEmail.mockResolvedValue({ ok: true, id: 'msg_1' })
    const res = await post(valid)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(sendContactEmail).toHaveBeenCalledWith({
      name: valid.name,
      email: valid.email,
      interest: 'build',
      message: valid.message,
    })
  })

  it('sends Transform and Research inquiries', async () => {
    sendContactEmail.mockResolvedValue({ ok: true })
    for (const interest of ['transform', 'research']) {
      const res = await post({ ...valid, interest })
      expect(res.status).toBe(200)
      expect((await res.json()).ok).toBe(true)
    }
  })

  it('rejects invalid email and missing fields', async () => {
    const res = await post({ name: '', email: 'bad', interest: '', message: '' })
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.ok).toBe(false)
    expect(data.errors.email).toBeTruthy()
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('rejects invalid inquiry category', async () => {
    const res = await post({ ...valid, interest: 'partnership' })
    expect(res.status).toBe(400)
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('rejects oversized message', async () => {
    const res = await post({ ...valid, message: 'm'.repeat(5001) })
    expect(res.status).toBe(400)
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('silently accepts honeypot submissions without sending mail', async () => {
    const res = await post({ ...valid, company_website: 'https://spam.example' })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('handles rate limiting', async () => {
    checkContactRateLimit.mockResolvedValue({ allowed: false, mode: 'upstash' })
    const res = await post(valid)
    expect(res.status).toBe(429)
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('returns an error when the email provider fails', async () => {
    sendContactEmail.mockResolvedValue({ ok: false, error: 'boom', code: 'provider' })
    const res = await post(valid)
    expect(res.status).toBe(502)
    const data = await res.json()
    expect(data.ok).toBe(false)
    expect(data.error).toMatch(/couldn.t send/i)
  })

  it('returns success only when the provider accepts the message', async () => {
    sendContactEmail.mockResolvedValue({ ok: true, id: 'msg_ok' })
    const res = await post(valid)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('rejects oversized request bodies', async () => {
    const res = await post(valid, { headers: { 'content-length': '20000' } })
    expect(res.status).toBe(413)
    expect(sendContactEmail).not.toHaveBeenCalled()
  })
})

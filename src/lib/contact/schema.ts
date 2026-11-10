export const CONTACT_EMAIL = 'hello@ashvi.tech'

export const INTERESTS = [
  { value: 'build', label: 'Build an AI-native venture', learn: { href: '/build', text: 'Build' } },
  { value: 'transform', label: 'Transform my business with AI', learn: { href: '/transform', text: 'Transform' } },
  { value: 'research', label: 'Research collaboration', learn: { href: '/research', text: 'Research' } },
  { value: 'other', label: 'Something else', learn: null },
] as const

export type Interest = (typeof INTERESTS)[number]['value']

export type ContactPayload = {
  name: string
  email: string
  interest: Interest
  message: string
}

export type ContactFieldErrors = Partial<Record<'name' | 'email' | 'interest' | 'message' | 'form', string>>

export const INTEREST_VALUES = INTERESTS.map((i) => i.value) as readonly Interest[]

export const isInterest = (v: string | null | undefined): v is Interest =>
  INTEREST_VALUES.includes(v as Interest)

export const INTEREST_SUBJECT: Record<Interest, string> = {
  build: '[AshviTech] New Build inquiry',
  transform: '[AshviTech] New Transform inquiry',
  research: '[AshviTech] New Research inquiry',
  other: '[AshviTech] New Other inquiry',
}

export const INTEREST_LABEL: Record<Interest, string> = Object.fromEntries(
  INTERESTS.map((i) => [i.value, i.label]),
) as Record<Interest, string>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactInput(input: unknown): {
  ok: true
  data: ContactPayload
} | {
  ok: false
  errors: ContactFieldErrors
} {
  if (!input || typeof input !== 'object') {
    return { ok: false, errors: { form: 'Invalid request.' } }
  }

  const body = input as Record<string, unknown>
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const interestRaw = typeof body.interest === 'string' ? body.interest.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  const errors: ContactFieldErrors = {}

  if (name.length < 2 || name.length > 120) {
    errors.name = name.length < 2 ? 'Please add your name.' : 'Please use a shorter name.'
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    errors.email = 'Please add a valid email address.'
  }
  if (!isInterest(interestRaw)) {
    errors.interest = 'Please choose what you’d like to discuss.'
  }
  if (!message) {
    errors.message = 'Please tell us a little about your idea or challenge.'
  } else if (message.length < 10) {
    errors.message = 'Please tell us a little more — a sentence or two is enough.'
  } else if (message.length > 5000) {
    errors.message = 'Please keep your message under 5,000 characters.'
  }

  if (Object.keys(errors).length) return { ok: false, errors }

  return {
    ok: true,
    data: {
      name,
      email,
      interest: interestRaw as Interest,
      message,
    },
  }
}

/** Escape untrusted strings for HTML email bodies. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

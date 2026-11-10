import { describe, expect, it } from 'vitest'
import {
  INTERESTS,
  INTEREST_SUBJECT,
  escapeHtml,
  isInterest,
  validateContactInput,
} from './schema'

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  interest: 'build',
  message: 'Exploring an AI-native venture in financial operations.',
}

describe('interest labels and preselection helpers', () => {
  it('exposes the approved public labels', () => {
    expect(INTERESTS.map((i) => i.label)).toEqual([
      'Build an AI-native venture',
      'Transform my business with AI',
      'Research collaboration',
      'Something else',
    ])
  })

  it('accepts only approved interest values', () => {
    expect(isInterest('build')).toBe(true)
    expect(isInterest('transform')).toBe(true)
    expect(isInterest('research')).toBe(true)
    expect(isInterest('other')).toBe(true)
    expect(isInterest('nope')).toBe(false)
    expect(isInterest(undefined)).toBe(false)
  })

  it('maps category subjects', () => {
    expect(INTEREST_SUBJECT.build).toBe('[AshviTech] New Build inquiry')
    expect(INTEREST_SUBJECT.transform).toBe('[AshviTech] New Transform inquiry')
    expect(INTEREST_SUBJECT.research).toBe('[AshviTech] New Research inquiry')
    expect(INTEREST_SUBJECT.other).toBe('[AshviTech] New Other inquiry')
  })
})

describe('validateContactInput', () => {
  it('accepts valid Build, Transform and Research inquiries', () => {
    for (const interest of ['build', 'transform', 'research'] as const) {
      const result = validateContactInput({ ...valid, interest })
      expect(result.ok).toBe(true)
      if (result.ok) expect(result.data.interest).toBe(interest)
    }
  })

  it('rejects invalid email', () => {
    const result = validateContactInput({ ...valid, email: 'not-an-email' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors.email).toBeTruthy()
  })

  it('rejects missing required fields', () => {
    const result = validateContactInput({ name: '', email: '', interest: '', message: '' })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.name).toBeTruthy()
      expect(result.errors.email).toBeTruthy()
      expect(result.errors.interest).toBeTruthy()
      expect(result.errors.message).toBeTruthy()
    }
  })

  it('rejects invalid inquiry category', () => {
    const result = validateContactInput({ ...valid, interest: 'sales' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors.interest).toBeTruthy()
  })

  it('rejects oversized message', () => {
    const result = validateContactInput({ ...valid, message: 'x'.repeat(5001) })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors.message).toMatch(/5,000/)
  })

  it('rejects short name and short message', () => {
    const result = validateContactInput({ ...valid, name: 'A', message: 'Too short' })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.name).toBeTruthy()
      expect(result.errors.message).toBeTruthy()
    }
  })
})

describe('escapeHtml', () => {
  it('escapes untrusted content', () => {
    expect(escapeHtml(`<script>alert("x")</script>&'`)).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;&amp;&#39;',
    )
  })
})

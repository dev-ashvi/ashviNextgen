import { Resend } from 'resend'
import {
  CONTACT_EMAIL,
  INTEREST_LABEL,
  INTEREST_SUBJECT,
  escapeHtml,
  type ContactPayload,
} from './schema'

export type SendContactEmailResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; code?: 'misconfigured' | 'provider' }

export type SendContactEmail = (payload: ContactPayload) => Promise<SendContactEmailResult>

function buildBodies(payload: ContactPayload, submittedAt: string) {
  const category = INTEREST_LABEL[payload.interest]
  const plain = [
    'New AshviTech contact inquiry',
    '',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Inquiry: ${category} (${payload.interest})`,
    `Submitted: ${submittedAt}`,
    '',
    'Message:',
    payload.message,
  ].join('\n')

  const html = `
    <div style="font-family:Georgia,serif;line-height:1.5;color:#021336">
      <p style="margin:0 0 16px">New AshviTech contact inquiry</p>
      <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <p style="margin:0 0 8px"><strong>Inquiry:</strong> ${escapeHtml(category)} (${escapeHtml(payload.interest)})</p>
      <p style="margin:0 0 16px"><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
      <p style="margin:0 0 8px"><strong>Message:</strong></p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(payload.message)}</p>
    </div>
  `.trim()

  return { plain, html, subject: INTEREST_SUBJECT[payload.interest] }
}

export const sendContactEmail: SendContactEmail = async (payload) => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL
  const to = process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL

  if (!apiKey || !from) {
    return { ok: false, error: 'Email delivery is not configured.', code: 'misconfigured' }
  }

  const submittedAt = new Date().toISOString()
  const { plain, html, subject } = buildBodies(payload, submittedAt)

  try {
    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send({
      from: `AshviTech Contact <${from}>`,
      to: [to],
      replyTo: payload.email,
      subject,
      text: plain,
      html,
    })

    if (error) {
      return { ok: false, error: error.message || 'Provider rejected the message.', code: 'provider' }
    }

    return { ok: true, id: data?.id }
  } catch {
    return { ok: false, error: 'Provider request failed.', code: 'provider' }
  }
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL)
}

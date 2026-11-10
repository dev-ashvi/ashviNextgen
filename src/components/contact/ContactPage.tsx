'use client'

import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react'
import {
  CONTACT_EMAIL,
  INTERESTS,
  isInterest,
  type ContactFieldErrors,
  type Interest,
} from '@/lib/contact/schema'

/**
 * /contact — "Let's explore what's possible."
 * Inquiry preselection via ?interest=build|transform|research|other.
 * Submissions POST to /api/contact; success only when the server confirms provider acceptance.
 */

export type ContactValues = { name: string; email: string; interest: Interest | ''; message: string }

export function ContactPage({ initialInterest }: { initialInterest?: string }) {
  return (
    <section aria-labelledby="contact-title" className="relative isolate overflow-hidden bg-[#F8F9FD] text-[#021336]">
      <Linework />
      <div className="mx-auto grid w-full max-w-[1240px] gap-12 px-6 pb-20 pt-[116px] sm:px-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-12 lg:pb-24 lg:pt-[140px]">
        <Introduction />
        <ContactForm initialInterest={initialInterest} />
        <CollabLine className="-mt-4 lg:hidden" />
      </div>
    </section>
  )
}

function Introduction() {
  return (
    <div className="lg:pt-6">
      <p className="flex items-center gap-3.5 font-mono text-[11.5px] uppercase tracking-[0.22em] text-[#021336]/70 sm:text-[12px]">
        <span className="h-px w-7 bg-[#00A896]" aria-hidden="true" />
        AshviTech / Contact
      </p>
      <h1 id="contact-title" className="mt-6 font-serif text-[clamp(2.6rem,5vw,4.4rem)] font-normal leading-[1.03] tracking-[-0.02em]">
        Let’s explore
        <br />
        what’s possible.
      </h1>
      <p className="mt-6 max-w-[30rem] text-[17px] leading-[1.65] text-[#021336]/78 sm:text-[18px]">
        Have a venture idea, a business challenge or a technical question worth exploring? We’d like to hear from you.
      </p>

      <div className="mt-10 max-w-[30rem] border-t border-[#021336]/[0.12] pt-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#021336]/60">Direct email</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-2 inline-block rounded-sm text-[clamp(1.5rem,2.3vw,1.85rem)] font-medium tracking-[-0.01em] text-[#021336] underline decoration-[#00CDB8]/0 decoration-2 underline-offset-[6px] outline-none transition-colors hover:decoration-[#00CDB8] focus-visible:ring-2 focus-visible:ring-[#00CDB8] focus-visible:ring-offset-4"
        >
          {CONTACT_EMAIL}
        </a>
        <p className="mt-4 font-serif text-[18px] italic leading-[1.5] text-[#021336]/70">A good conversation is where things begin.</p>
      </div>

      <CollabLine className="mt-10 hidden lg:block" />
    </div>
  )
}

function CollabLine({ className = '' }: { className?: string }) {
  return (
    <p className={`max-w-[30rem] text-balance text-[14.5px] leading-[1.7] text-[#021336]/62 ${className}`}>
      Not ready to write yet? Read about how we{' '}
      {INTERESTS.filter((i) => i.learn).map((i, k, a) => (
        <span key={i.value}>
          <a
            href={i.learn!.href}
            className="rounded-sm font-medium text-[#007A6E] underline decoration-[#00A896]/40 underline-offset-4 outline-none hover:decoration-[#00A896] focus-visible:ring-2 focus-visible:ring-[#00CDB8]"
          >
            {i.learn!.text.toLowerCase()}
          </a>
          {k < a.length - 2 ? ', ' : k === a.length - 2 ? ' and ' : ''}
        </span>
      ))}
      .
    </p>
  )
}

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string }

function ContactForm({ initialInterest }: { initialInterest?: string }) {
  const uid = useId()
  const [values, setValues] = useState<ContactValues>({
    name: '',
    email: '',
    interest: isInterest(initialInterest) ? initialInterest : '',
    message: '',
  })
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<ContactFieldErrors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  useEffect(() => {
    if (!isInterest(initialInterest)) return
    setValues((v) => (v.interest === initialInterest ? v : { ...v, interest: initialInterest }))
  }, [initialInterest])

  const set = <K extends keyof ContactValues>(k: K, v: ContactValues[K]) => {
    setValues((s) => ({ ...s, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
    if (status.kind === 'sent' || status.kind === 'error') setStatus({ kind: 'idle' })
  }

  const validate = (): ContactFieldErrors => {
    const e: ContactFieldErrors = {}
    if (values.name.trim().length < 2) e.name = 'Please add your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) e.email = 'Please add a valid email address.'
    if (!values.interest) e.interest = 'Please choose what you’d like to discuss.'
    if (!values.message.trim()) e.message = 'Please tell us a little about your idea or challenge.'
    else if (values.message.trim().length < 10) e.message = 'Please tell us a little more — a sentence or two is enough.'
    return e
  }

  const submit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    if (status.kind === 'sending') return

    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      const first = (['name', 'email', 'interest', 'message'] as const).find((k) => e[k])
      if (first === 'interest') document.getElementById(`${uid}-interest`)?.focus()
      else if (first) document.getElementById(`${uid}-${first}`)?.focus()
      return
    }

    setStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          interest: values.interest,
          message: values.message.trim(),
          company_website: honeypot,
        }),
      })

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; errors?: ContactFieldErrors; error?: string }
        | null

      if (res.ok && data?.ok) {
        setStatus({ kind: 'sent' })
        return
      }

      if (res.status === 400 && data?.errors) {
        setErrors(data.errors)
        setStatus({ kind: 'idle' })
        const first = (['name', 'email', 'interest', 'message'] as const).find((k) => data.errors?.[k])
        if (first === 'interest') document.getElementById(`${uid}-interest`)?.focus()
        else if (first) document.getElementById(`${uid}-${first}`)?.focus()
        return
      }

      setStatus({
        kind: 'error',
        message:
          data?.error ||
          "We couldn't send your message right now. Please try again or email hello@ashvi.tech.",
      })
    } catch {
      setStatus({
        kind: 'error',
        message: "We couldn't send your message right now. Please try again or email hello@ashvi.tech.",
      })
    }
  }

  const input =
    'mt-2 block w-full rounded-[10px] border border-white/[0.16] bg-white/[0.04] px-4 py-3 text-[16px] text-white placeholder:text-white/40 outline-none transition-[border-color,box-shadow] duration-200 hover:border-white/30 focus:border-[#00CDB8] focus:shadow-[0_0_0_3px_rgba(0,205,184,0.18)] aria-[invalid=true]:border-[#FF9E8A]'

  return (
    <div className="relative">
      <form
        onSubmit={submit}
        noValidate
        aria-labelledby={`${uid}-heading`}
        className="relative overflow-hidden rounded-[22px] bg-[#021336] px-6 py-8 text-white shadow-[0_30px_70px_-40px_rgba(2,19,54,0.55)] sm:px-10 sm:py-10"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_100%_100%,rgba(0,56,118,0.55)_0%,transparent_70%)]" />
        <div className="relative">
          <p id={`${uid}-heading`} className="flex items-center gap-3.5 font-mono text-[11.5px] uppercase tracking-[0.24em] text-white/85">
            <span className="h-px w-7 bg-[#00CDB8]" aria-hidden="true" />
            Start a conversation
          </p>

          {/* Honeypot — hidden from people, filled by some bots */}
          <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor={`${uid}-company`}>Company website</label>
            <input
              id={`${uid}-company`}
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <Field id={`${uid}-name`} label="Your name" error={errors.name}>
              <input
                id={`${uid}-name`}
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={(e) => set('name', e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                required
                placeholder="Your name"
                className={input}
              />
            </Field>
            <Field id={`${uid}-email`} label="Email address" error={errors.email}>
              <input
                id={`${uid}-email`}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${uid}-email-err` : undefined}
                required
                placeholder="you@company.com"
                className={input}
              />
            </Field>
          </div>

          <fieldset className="mt-7" aria-describedby={errors.interest ? `${uid}-interest-err` : undefined}>
            <legend className="text-[15px] font-medium text-white">
              What would you like to discuss? <span aria-hidden="true" className="text-[#00CDB8]">*</span>
            </legend>
            <div id={`${uid}-interest`} tabIndex={-1} className="mt-3 grid gap-2 sm:grid-cols-2">
              {INTERESTS.map((o) => (
                <label
                  key={o.value}
                  className="group flex min-h-[48px] cursor-pointer items-center gap-3 rounded-[10px] border border-white/[0.14] px-4 py-2.5 text-[15px] text-white/85 transition-colors hover:border-white/30 has-[:checked]:border-[#00CDB8]/70 has-[:checked]:bg-[#00CDB8]/[0.08] has-[:checked]:text-white has-[:focus-visible]:shadow-[0_0_0_3px_rgba(0,205,184,0.25)]"
                >
                  <input
                    type="radio"
                    name="interest"
                    value={o.value}
                    checked={values.interest === o.value}
                    onChange={() => set('interest', o.value)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full ring-[1.5px] ring-white/50 peer-checked:ring-[#00CDB8] [&>span]:scale-0 peer-checked:[&>span]:scale-100"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#00CDB8] transition-transform duration-200 motion-reduce:transition-none" />
                  </span>
                  {o.label}
                </label>
              ))}
            </div>
            {errors.interest && (
              <p id={`${uid}-interest-err`} className="mt-2 text-[13.5px] text-[#FFB8A8]">
                {errors.interest}
              </p>
            )}
          </fieldset>

          <Field id={`${uid}-message`} label="Tell us a little about your idea or challenge." error={errors.message} className="mt-7">
            <textarea
              id={`${uid}-message`}
              name="message"
              rows={5}
              value={values.message}
              onChange={(e) => set('message', e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? `${uid}-message-err` : undefined}
              required
              placeholder="What are you exploring, and how might we help?"
              className={`${input} min-h-[132px] resize-y leading-[1.55]`}
            />
          </Field>

          <div className="mt-8">
            <button
              type="submit"
              disabled={status.kind === 'sending'}
              className="group inline-flex min-h-[52px] w-full items-center justify-center gap-3 whitespace-nowrap rounded-full bg-[#F8F9FD] px-8 text-[16px] font-medium text-[#021336] outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-[#00CDB8] focus-visible:ring-offset-4 focus-visible:ring-offset-[#021336] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
            >
              {status.kind === 'sending' ? 'Sending...' : 'Send your message'}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1 motion-reduce:transition-none">
                →
              </span>
            </button>
          </div>

          <div aria-live="polite" className="empty:hidden">
            {status.kind === 'sent' && (
              <p className="mt-6 rounded-[10px] border border-[#00CDB8]/40 bg-[#00CDB8]/[0.08] px-4 py-3 text-[15px] text-white">
                Thanks for reaching out. Your message has been submitted.
              </p>
            )}
            {status.kind === 'error' && (
              <p className="mt-6 rounded-[10px] border border-[#FF9E8A]/50 bg-[#FF9E8A]/[0.08] px-4 py-3 text-[15px] leading-[1.6] text-white">
                {status.message.includes('hello@ashvi.tech') ? (
                  <>
                    We couldn&apos;t send your message right now. Please try again or email{' '}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="font-medium underline decoration-[#00CDB8] underline-offset-4"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </>
                ) : (
                  status.message
                )}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

function Field({ id, label, error, children, className = '' }: { id: string; label: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-[15px] font-medium text-white">
        {label} <span aria-hidden="true" className="text-[#00CDB8]">*</span>
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-2 text-[13.5px] text-[#FFB8A8]">
          {error}
        </p>
      )}
    </div>
  )
}

function Linework() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1440 700" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] w-full">
      <defs>
        <linearGradient id="ct-line" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#00CDB8" stopOpacity="0" />
          <stop offset="0.25" stopColor="#00CDB8" stopOpacity="0.35" />
          <stop offset="0.7" stopColor="#00CDB8" stopOpacity="0.25" />
          <stop offset="1" stopColor="#00CDB8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 560 C260 500 420 640 720 560 S1180 360 1440 420" fill="none" stroke="url(#ct-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d="M0 610 C300 560 460 670 760 600 S1200 440 1440 480" fill="none" stroke="url(#ct-line)" strokeOpacity="0.6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

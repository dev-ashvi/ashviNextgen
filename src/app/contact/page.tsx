import type { Metadata } from 'next'
import { ContactPage } from '@/components/contact/ContactPage'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Have a venture idea, a business challenge or a technical question worth exploring? We'd like to hear from you.",
  alternates: { canonical: 'https://ashvi.tech/contact' },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string }>
}) {
  const { interest } = await searchParams
  return <ContactPage initialInterest={interest} />
}

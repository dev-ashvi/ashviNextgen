import type { Metadata } from 'next'
import { TransformPage } from '@/components/transform/TransformPage'

export const metadata: Metadata = {
  title: 'Transform',
  description:
    'We partner with existing businesses to rethink operations, redesign workflows and build intelligent systems.',
  alternates: { canonical: 'https://ashvi.tech/transform' },
}

export default function Page() {
  // Fixed shared header is 84px; reserve that height once so the hero sits fully below it.
  return (
    <div className="bg-[#F8F9FD] pt-[84px]">
      <TransformPage />
    </div>
  )
}

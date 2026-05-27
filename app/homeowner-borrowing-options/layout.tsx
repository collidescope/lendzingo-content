import type { Metadata } from 'next'
import Header from '@/components/Header'
import GoogleTagManager from '@/components/GoogleTagManager'

export const metadata: Metadata = {
  title: 'Need a Large Sum of Money? Here Are 5 Ways Homeowners Can Get It Without the High Interest - Lendzingo',
  description:
    "If you need a large sum of money and you own a home, you have options most people don't know about, and they're far cheaper than a credit card or personal loan. Here's what to consider.",
}

export default function HomeownerBorrowingOptionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleTagManager />
      <Header pageLabel="Homeowner Options" />
      {children}
    </>
  )
}

import type { Metadata } from 'next'
import Header from '@/components/Header'
import GoogleTagManager from '@/components/GoogleTagManager'

export const metadata: Metadata = {
  title: "Still Paying Credit Card Interest? Here's What Financially Savvy People Do Instead — Lendzingo",
  description:
    'Credit card interest rates are near historic highs. But there are smarter ways out — especially if you own a home. Here are 5 moves worth making.',
}

export default function EscapeCreditCardInterestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleTagManager />
      <Header pageLabel="Credit Card Debt" />
      {children}
    </>
  )
}

import type { Metadata } from 'next'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: "If You Own a Home, You're Sitting on Money — Here's How to Access It — Lendzingo",
  description:
    "Most homeowners have no idea how much equity they've built up — or what it could actually do for them. Here's a plain-English guide to your options.",
}

export default function HomeEquityGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header pageLabel="Home Equity Guide" />
      {children}
    </>
  )
}

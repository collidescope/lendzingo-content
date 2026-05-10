import type { Metadata } from 'next'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: '5 Smarter Ways to Borrow Money (That Most People Don\'t Know About) — Lendzingo',
  description:
    'Most people reach for a credit card when they need cash. But there are smarter, lower-cost ways to borrow — especially if you own a home. Here are 5 options worth knowing about.',
}

export default function SmarterWaysToBorrowLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header pageLabel="Borrowing Smart" />
      {children}
    </>
  )
}

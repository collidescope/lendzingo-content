import type { Metadata } from 'next'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Credit Card Savings Calculator — Lendzingo',
  description:
    'See exactly how much you could save by replacing your credit card debt with a lower-interest personal loan.',
}

export default function SavingsCalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header pageLabel="Savings Calculator" />
      {children}
    </>
  )
}

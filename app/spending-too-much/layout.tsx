import type { Metadata } from 'next'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'The 5 Dumbest Things People Keep Spending Too Much Money On — Lendzingo',
  description:
    "You've already cut back on the small stuff. Here are the five recurring bills that quietly drain the most money — and how to fix each one.",
}

export default function SpendingTooMuchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header pageLabel="Save Smarter" />
      {children}
    </>
  )
}

import type { Metadata } from 'next'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Refi Tracker — Lendzingo',
  description:
    "Tell us your mortgage details and your savings goal. We'll monitor rates every month and let you know when it's worth refinancing.",
}

export default function RefiTrackerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header pageLabel="Refi Tracker" />
      {children}
    </>
  )
}

import Header from '@/components/Header'

export default function HomeEquityLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header pageLabel="Home Equity Guide" />
      {children}
    </>
  )
}

import type { Metadata } from 'next'
import { fontSerif, fontSans } from '@/lib/fonts'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lendzingo',
  description: 'Smarter ways to borrow — compare home equity, personal loan, and debt consolidation options.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fontSerif.variable} ${fontSans.variable}`}>
      <body>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

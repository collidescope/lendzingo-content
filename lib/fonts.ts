import { Lexend_Deca, Roboto } from 'next/font/google'

export const fontSerif = Lexend_Deca({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-serif',
  display: 'swap',
})

export const fontSans = Roboto({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-sans',
  display: 'swap',
})

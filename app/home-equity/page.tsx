import Image from 'next/image'
import ProductNavBar from '@/components/ProductNavBar'
import SolutionSection from '@/components/SolutionSection'
import RelatedArticlesGrid from '@/components/RelatedArticlesGrid'

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

const LOREM_SHORT =
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.'

const solutions = [
  {
    id: 'heloc',
    optionNumber: 'Option 01',
    headline: 'HELOC — Borrow What You Need, When You Need It',
    body1: LOREM,
    body2: LOREM_SHORT,
    callout:
      'A HELOC works like a credit card backed by your home — you draw funds as needed during the draw period, only paying interest on what you use.',
    body3: LOREM,
    card: {
      label: 'Featured Option',
      name: 'HELOC — Home Equity Line of Credit',
      detail: 'Variable rate · Draw period up to 10 years',
      ctaText: 'Check My Rate →',
      ctaHref: '#',
    },
  },
  {
    id: 'home-equity-loan',
    optionNumber: 'Option 02',
    headline: 'Home Equity Loan — Predictable Payments, Lump Sum Access',
    body1: LOREM,
    body2: LOREM_SHORT,
    callout:
      'Unlike a HELOC, a home equity loan gives you all the funds at once with a fixed interest rate — making it ideal for large, one-time expenses.',
    body3: LOREM,
    card: {
      label: 'Featured Option',
      name: 'Home Equity Loan',
      detail: 'Fixed rate · Lump sum disbursement',
      ctaText: 'Check My Rate →',
      ctaHref: '#',
    },
  },
  {
    id: 'cash-out-refi',
    optionNumber: 'Option 03',
    headline: 'Cash-Out Refinance — Replace Your Mortgage and Pocket the Difference',
    body1: LOREM,
    body2: LOREM_SHORT,
    callout:
      'A cash-out refinance replaces your existing mortgage with a new, larger one — the difference is paid to you in cash at closing.',
    body3: LOREM,
    card: {
      label: 'Featured Option',
      name: 'Cash-Out Refinance',
      detail: 'Fixed or variable rate · Replaces existing mortgage',
      ctaText: 'Explore My Options →',
      ctaHref: '#',
    },
  },
  {
    id: 'personal-loan',
    optionNumber: 'Option 04',
    headline: 'Personal Loan — Fast Funds Without Touching Your Home',
    body1: LOREM,
    body2: LOREM_SHORT,
    callout:
      'Personal loans are unsecured, meaning your home isn\'t on the line — but you\'ll typically pay a higher rate than with home equity products.',
    body3: LOREM,
    card: {
      label: 'Featured Option',
      name: 'Personal Loan',
      detail: 'Unsecured · Fixed rate · Fast approval',
      ctaText: 'Check My Rate →',
      ctaHref: '#',
    },
  },
  {
    id: 'debt-consolidation',
    optionNumber: 'Option 05',
    headline: 'Debt Consolidation — Simplify Your Payments, Lower Your Rate',
    body1: LOREM,
    body2: LOREM_SHORT,
    callout:
      'Rolling multiple high-interest balances into a single loan can significantly reduce the total interest you pay — and simplify your monthly finances.',
    body3: LOREM,
    card: {
      label: 'Featured Option',
      name: 'Debt Consolidation Loan',
      detail: 'Fixed rate · Single monthly payment',
      ctaText: 'See My Options →',
      ctaHref: '#',
    },
    isLast: true,
  },
]

export default function HomeEquityPage() {
  return (
    <>
      <ProductNavBar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Byline Bar */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
          <div
            className="w-9 h-9 rounded-full bg-lendzingo-green flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <span className="text-xs font-sans font-bold text-white tracking-tight">LZ</span>
          </div>
          <div>
            <p className="text-sm font-sans font-semibold text-lendzingo-ink">Lendzingo Editorial Team</p>
            <p className="text-xs font-sans text-lendzingo-muted">Updated May 9, 2026 · 6 min read</p>
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-bold text-lendzingo-ink leading-tight mb-6">
          [Article Headline Goes Here — Bold, Benefit-Driven, 10–12 Words]
        </h1>

        {/* Hero Image */}
        <div className="relative w-full mb-8 rounded-xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
          <div className="absolute inset-0 bg-lendzingo-green flex items-center justify-center">
            <span className="font-sans text-white/60 text-sm font-medium tracking-wide">Hero Image</span>
          </div>
        </div>

        {/* Intro Paragraphs */}
        <div className="mb-8">
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">{LOREM}</p>
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">{LOREM_SHORT}</p>
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">{LOREM}</p>
          <p className="font-sans text-[1.05rem] leading-[1.8] text-lendzingo-muted italic">
            Read through each option below, or jump to the one that fits your situation.
          </p>
        </div>

        {/* Solution Sections */}
        {solutions.map((section) => (
          <SolutionSection key={section.id} {...section} />
        ))}

        {/* Related Articles */}
        <RelatedArticlesGrid articles={[
          {
            thumbnailColor: '#2282e4',
            category: 'Borrowing Smart',
            title: '5 Smarter Ways to Borrow Money (That Most People Don\'t Know About)',
            excerpt: 'Most people reach for a credit card when they need cash. There are smarter, lower-cost options — especially if you own a home.',
            href: '/smarter-ways-to-borrow',
          },
          {
            thumbnailColor: '#2D5A8E',
            category: 'Debt',
            title: 'The Smartest Ways to Consolidate High-Interest Debt This Year',
            excerpt: 'From balance transfers to personal loans, here are the most effective tools for simplifying your payments and reducing what you owe.',
            href: '#',
          },
          {
            thumbnailColor: '#7B4F2E',
            category: 'Saving',
            title: 'What Every Homeowner Should Know Before Tapping Their Equity',
            excerpt: 'Your home equity is a powerful financial resource — but using it wisely means understanding the risks, costs, and smarter alternatives first.',
            href: '#',
          },
        ]} />

        {/* Page Footer Disclaimer */}
        <div className="py-8 border-t border-gray-100">
          <p className="font-sans text-xs text-lendzingo-muted leading-relaxed">
            Advertising Disclosure: Lendzingo is an advertising-supported comparison platform. We may receive
            compensation when you click on links to products featured on this site. This compensation may
            impact how and where products appear. Lendzingo does not include all available financial products.
          </p>
        </div>
      </div>
    </>
  )
}

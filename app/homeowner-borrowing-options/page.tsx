import Image from 'next/image'
import ProductNavBar from '@/components/ProductNavBar'
import SolutionSection from '@/components/SolutionSection'
import RelatedArticlesGrid from '@/components/RelatedArticlesGrid'
import type { NavItem } from '@/components/ProductNavBar'
import type { RelatedArticle } from '@/components/RelatedArticlesGrid'

const navItems: NavItem[] = [
  { id: 'heloc', label: 'HELOC' },
  { id: 'home-equity-loan', label: 'Home Equity Loan' },
  { id: 'cash-out-refi', label: 'Cash-Out Refinance' },
  { id: 'reverse-mortgage', label: 'Reverse Mortgage' },
  { id: 'personal-loan', label: 'Personal Loan' },
]

const solutions = [
  {
    id: 'heloc',
    optionNumber: 'Option 01',
    headline: 'HELOC: Access a Large Credit Line and Only Pay for What You Use',
    body1:
      "If your large expense isn't a single transaction, or if you're not sure of the exact total yet, a HELOC is often the smartest place to start. A Home Equity Line of Credit gives you access to a large credit line based on your home equity, and you draw from it as you need it. A kitchen renovation that unfolds over six months. A medical situation with ongoing costs. A business expense that doesn't fit neatly into one invoice. You borrow what you need, when you need it, and only pay interest on what you actually use.",
    body2:
      "Rates on HELOCs are typically in the 7–9% range, a fraction of what a credit card charges for the same amount. And because it's a revolving line of credit, the flexibility is built in. Pay down what you've borrowed and that credit becomes available again. For large expenses that are hard to pin to a single number, that flexibility is worth a lot.",
    callout:
      "A HELOC works like a credit card backed by your home. Draw what you need, when you need it, and only pay interest on what you use. Rates are typically far below what credit cards charge.",
    body3:
      "Checking your rate takes minutes and won't affect your credit score. If you've built up equity in your home, you may have more borrowing power available than you think.",
    card: {
      label: 'Most Popular Option',
      name: 'HELOC: Home Equity Line of Credit',
      detail: 'Variable rate · Draw period up to 10 years · Interest-only payments available',
      ctaText: 'Check My Rate →',
      ctaHref: 'https://www.myhomeequitycompanion.com/offer/cash-out-equity',
    },
  },
  {
    id: 'home-equity-loan',
    optionNumber: 'Option 02',
    headline: 'Home Equity Loan: Know Exactly What You Need? Get It All at Once at a Fixed Rate',
    body1:
      "When the number is clear and the expense is defined, a home equity loan delivers exactly what you need: a fixed amount, upfront, at a fixed interest rate, with a payment that never changes. You borrow against your home equity, receive the full amount at closing, and repay it in equal monthly installments over a set term. No variability, no surprises, no revolving balance to manage.",
    body2:
      "For large, one-time expenses like a major home addition, a full kitchen remodel, or funding a significant life event, this structure is often the cleanest fit. You know the total cost, you borrow exactly that amount, and you have a clear finish line from day one. And because your home serves as collateral, the rate is far lower than an unsecured personal loan for the same amount.",
    callout:
      "A home equity loan gives you the full amount upfront at a fixed rate, ideal when you know exactly what you need and want a predictable payment from start to finish.",
    body3:
      "Home equity loan rates are typically lower than personal loans and dramatically lower than credit cards. The fixed rate means you're fully protected if interest rates rise after you borrow. What you lock in is what you pay.",
    card: {
      label: 'Fixed Rate, Lump Sum',
      name: 'Home Equity Loan',
      detail: 'Fixed rate · Lump-sum disbursement · 5–30 year terms available',
      ctaText: 'Check My Rate →',
      ctaHref: 'https://www.myhomeequitycompanion.com/offer/cash-out-equity',
    },
  },
  {
    id: 'cash-out-refi',
    optionNumber: 'Option 03',
    headline: 'Cash-Out Refinance: Access Your Equity in One Move While Potentially Lowering Your Rate',
    body1:
      "If you need a large sum and your current mortgage rate is higher than what's available today, a cash-out refinance can accomplish two things at once. You refinance your mortgage for more than you currently owe and receive the difference as cash at closing. The old mortgage is gone, replaced by the new one. And if rates have dropped since you bought, your monthly payment could actually go down at the same time you're walking away with a significant sum of cash.",
    body2:
      "The amounts available through a cash-out refinance are often larger than what's accessible through a HELOC or home equity loan, making it a strong option for truly large expenses: a full home addition, a major property improvement, or paying off a substantial amount of debt in one shot. Closing costs apply, typically 2–5% of the loan amount, but for the right borrower those are offset quickly by the savings on the rate.",
    callout:
      "A cash-out refinance replaces your existing mortgage with a new, larger one. The difference is paid to you in cash at closing. In the right situation, you could lower your rate and access a large sum at the same time.",
    body3:
      "This option makes the most sense if your current rate is higher than today's market and you have significant equity built up. If both are true, it's one of the most powerful financial moves available to a homeowner.",
    card: {
      label: 'Two Wins, One Move',
      name: 'Cash-Out Refinance',
      detail: 'Fixed or variable rate · Replaces existing mortgage · Access large amounts of equity',
      ctaText: 'Explore My Options →',
      ctaHref: 'https://www.myreficompanion.com/offer/refinance',
    },
  },
  {
    id: 'reverse-mortgage',
    optionNumber: 'Option 04',
    headline: "Reverse Mortgage: If You're 62 or Older, Access Your Equity Without a Single Monthly Payment",
    body1:
      "For homeowners 62 and older, a reverse mortgage offers something no other equity product does: access to a large sum of money with no monthly loan payments required. You borrow against your home equity as a lump sum, a line of credit, or monthly installments, and the loan isn't repaid until you sell the home, move out permanently, or pass away. You stay on the title. You keep ownership. You just get access to the equity you've spent decades building.",
    body2:
      "For seniors facing a large expense, whether it's a medical cost, a major home repair, or simply wanting a financial cushion in retirement, a reverse mortgage can be transformative. It eliminates the pressure of a monthly payment while unlocking equity that would otherwise sit untouched. Your heirs retain the option to repay the loan and keep the home, or sell it and keep any remaining equity after the balance is settled.",
    callout:
      "A reverse mortgage lets homeowners 62 and older convert home equity into cash, with no monthly mortgage payments for as long as you live in the home.",
    body3:
      "It's not the right fit for every situation, but for seniors who are equity-rich and want more financial flexibility, it's worth a free, no-obligation consultation to understand what's available.",
    card: {
      label: 'For Homeowners 62 and Older',
      name: 'Reverse Mortgage',
      detail: 'No monthly payments · Stay in your home · Lump sum, credit line, or monthly payments',
      ctaText: 'See If I Qualify →',
      ctaHref: 'https://www.mymortgagecompanion.com/offer/reverse-mortgage',
    },
  },
  {
    id: 'personal-loan',
    optionNumber: 'Option 05',
    headline: "Personal Loan: Don't Own a Home? You Can Still Borrow Smart",
    body1:
      "Home equity products offer the lowest rates, but they require equity to tap. If you're not yet a homeowner, or if you'd prefer to keep your home out of the equation entirely, a personal loan is still a meaningfully smarter option than a credit card. Personal loans are unsecured, come with a fixed interest rate, and give you a defined payoff date from day one. You borrow what you need, make fixed monthly payments, and you're done.",
    body2:
      "For large expenses, personal loan amounts can go up to $50,000 or more depending on your credit profile, enough to cover a significant expense without touching home equity. The rate won't be as low as a HELOC or home equity loan, but it will be far lower than carrying the same balance on a credit card. And the fixed structure means you know exactly what you're paying and exactly when it ends.",
    callout:
      "Personal loans are unsecured, meaning your home isn't on the line. And with a fixed rate and fixed term, you always know exactly what you owe and when you'll be done.",
    body3:
      "Checking your rate takes about two minutes and won't affect your credit score. It's worth seeing what you qualify for before committing to any borrowing decision.",
    card: {
      label: 'No Home Equity Required',
      name: 'Personal Loan',
      detail: 'Unsecured · Fixed rate & term · Funding as fast as 1–3 business days',
      ctaText: 'Check My Rate →',
      ctaHref: 'https://www.mypersonalloancompanion.com/offer/personal-loan',
    },
    isLast: true,
  },
]

const relatedArticles: RelatedArticle[] = [
  {
    image: '/hero-smarter-ways.png',
    category: 'Borrowing Smart',
    title: "5 Smarter Ways to Borrow Money (That Most People Don't Know About)",
    excerpt:
      "Most people reach for a credit card when they need cash and end up paying far more than they should. Here are five lower-cost options worth knowing about.",
    href: '/smarter-ways-to-borrow',
  },
  {
    image: '/escape-cc-interest.png',
    category: 'Credit Card Debt',
    title: "Still Paying Credit Card Interest? Here's What Financially Savvy People Do Instead",
    excerpt:
      "Credit card interest rates are near historic highs. But there are smarter ways out, especially if you own a home. Here are 5 moves worth making.",
    href: '/escape-credit-card-interest',
  },
  {
    image: '/sitting-on-money.jpg',
    category: 'Home Equity',
    title: "If You Own a Home, You're Sitting on Money. Here's How to Access It",
    excerpt:
      "Most homeowners have no idea how much equity they've built up, or what it could actually do for them. Here's a plain-English guide to your options.",
    href: '/home-equity-guide',
  },
]

export default function HomeownerBorrowingOptionsPage() {
  return (
    <>
      <ProductNavBar items={navItems} />

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
            <p className="text-xs font-sans text-lendzingo-muted">Updated May 10, 2026 · 6 min read</p>
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-bold text-lendzingo-ink leading-tight mb-6">
          Need a Large Sum of Money? Here Are 5 Ways Homeowners Can Get It Without the High Interest
        </h1>

        {/* Hero Image */}
        <div className="relative w-full mb-8 rounded-xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
          <Image
            src="/large-sum.png"
            alt="Homeowner accessing large sum of money through home equity"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Intro Paragraphs */}
        <div className="mb-8">
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">
            Here&rsquo;s something most homeowners don&rsquo;t know: the equity in your home can be turned
            into a large sum of cash at interest rates that credit cards and standard bank loans simply
            can&rsquo;t touch. The key is knowing which option fits your situation, because they&rsquo;re
            not all the same.
          </p>
          <p className="font-sans text-[1.05rem] leading-[1.8] text-lendzingo-muted italic">
            Read through each option below, or jump to the one that fits your situation. Don&rsquo;t own a
            home yet? Stick around — we didn&rsquo;t forget about you.
          </p>
        </div>

        {/* Solution Sections */}
        {solutions.map((section) => (
          <SolutionSection key={section.id} {...section} />
        ))}

        {/* Related Articles */}
        <RelatedArticlesGrid
          articles={relatedArticles}
          heading="More Ways to Make Your Money Work Harder"
        />

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

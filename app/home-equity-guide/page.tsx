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
    headline: 'HELOC: A Flexible Line of Credit Backed by Your Biggest Asset',
    body1:
      "A Home Equity Line of Credit is one of the most flexible financial tools available to homeowners, and one of the least understood. It works like a credit card in terms of flexibility: you're approved for a credit limit based on your home equity, and you can draw from it whenever you need to. The difference is the interest rate. Where a credit card might charge 24–25%, a HELOC typically runs 7–9%.",
    body2:
      "You draw what you need, when you need it, and only pay interest on what you actually use. Pay it back and that credit becomes available again. It's particularly powerful for ongoing or unpredictable expenses — a home renovation you're tackling in phases, a business expense that ebbs and flows, or simply a financial safety net that costs nothing until you use it.",
    callout:
      "A HELOC works like a credit card backed by your home. You draw funds as needed and only pay interest on what you use. When you pay it back, that credit is available again.",
    body3:
      "Checking your rate takes minutes and won't affect your credit score. If you've been making mortgage payments for a few years, you may have more borrowing power than you realize.",
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
    headline: "Home Equity Loan: Get a Lump Sum at a Fixed Rate, Without Touching Your Mortgage",
    body1:
      "If you know exactly how much you need and you want the simplicity of one fixed payment that never changes, a home equity loan is worth a close look. You borrow a set amount against your equity, receive it as a lump sum, and repay it in equal monthly installments at a fixed rate over a set term. It sits alongside your existing mortgage — it doesn't replace it.",
    body2:
      "Home equity loan rates are far lower than credit cards and typically lower than personal loans, because your home serves as collateral. That security translates directly into savings. And because the rate is fixed, you're completely protected if interest rates rise after you borrow — what you lock in today is what you pay from start to finish.",
    callout:
      "Unlike a HELOC, a home equity loan gives you all the funds upfront at a fixed rate, making it ideal for large, one-time expenses where you want total payment predictability.",
    body3:
      "It's a particularly strong option for homeowners tackling a single large expense: a major renovation, paying off a medical bill in full, or funding a significant life event without draining savings.",
    card: {
      label: 'Fixed Rate, No Surprises',
      name: 'Home Equity Loan',
      detail: 'Fixed rate · Lump-sum disbursement · 5–30 year terms available',
      ctaText: 'Check My Rate →',
      ctaHref: 'https://www.myhomeequitycompanion.com/offer/cash-out-equity',
    },
  },
  {
    id: 'cash-out-refi',
    optionNumber: 'Option 03',
    headline: 'Cash-Out Refinance: Pull Cash From Your Equity and Potentially Lower Your Rate at the Same Time',
    body1:
      "A cash-out refinance is the option that surprises people the most. You refinance your existing mortgage for more than you currently owe, and the difference comes to you in cash at closing. If your home is worth $450,000 and you owe $280,000, you could refinance for $350,000 and walk away with $70,000 in cash. Your old mortgage is paid off and replaced with the new one.",
    body2:
      "The move makes the most sense when your current mortgage rate is higher than what's available today. If that's the case, you could end up with a lower monthly payment and a significant sum of cash at the same time. There are closing costs, typically 2–5% of the loan amount, but for the right borrower, those are offset quickly by the rate savings alone, before even factoring in the cash received.",
    callout:
      "A cash-out refinance replaces your existing mortgage with a new, larger one. The difference is paid to you in cash at closing, which you can use however you need.",
    body3:
      "If you've been in your home for several years and haven't looked at refinancing recently, it's worth running the numbers. A lot has changed, and some homeowners are genuinely surprised by what's available to them.",
    card: {
      label: 'Lower Your Rate, Access Your Equity',
      name: 'Cash-Out Refinance',
      detail: 'Fixed or variable rate · Replaces existing mortgage · Access large amounts of equity',
      ctaText: 'Explore My Options →',
      ctaHref: 'https://www.myreficompanion.com/offer/refinance',
    },
  },
  {
    id: 'reverse-mortgage',
    optionNumber: 'Option 04',
    headline: "Reverse Mortgage: If You're 62 or Older, Your Home Can Pay You Back",
    body1:
      "If you're 62 or older and own your home, a reverse mortgage might be the most powerful equity tool available to you, and one of the most misunderstood. Unlike a traditional mortgage where you make payments to a lender, a reverse mortgage pays you. You receive funds based on your home equity — as a lump sum, a line of credit, or monthly payments — and you don't make any loan payments for as long as you live in the home.",
    body2:
      "The loan is repaid when you sell the home, move out permanently, or pass away, at which point your heirs can repay the balance and keep the home, or sell it and pocket any remaining equity. You stay on the title. You keep ownership. And you get access to the equity you've spent decades building, on your terms, without a monthly payment hanging over you.",
    callout:
      "A reverse mortgage lets homeowners 62 and older convert their home equity into tax-free cash, with no monthly mortgage payments required for as long as you live in the home.",
    body3:
      "It's not the right fit for everyone, but for seniors who are equity-rich and cash-poor, or who simply want more financial flexibility in retirement, it's worth understanding what you qualify for. The process starts with a free, no-obligation consultation.",
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
    headline: "Personal Loan: Don't Have Enough Equity Yet? This Still Beats a Credit Card",
    body1:
      "Home equity products are powerful, but they require equity to tap. If you're earlier in your homeownership journey and haven't built up enough yet, or if you simply prefer not to borrow against your home, a personal loan is still a significantly smarter option than a credit card. It's unsecured, meaning your home isn't on the line, and it comes with a fixed rate and a fixed payoff date.",
    body2:
      "That structure matters more than people give it credit for. A personal loan forces a finish line — you borrow a set amount, make a set number of payments, and then you're done. There's no revolving balance, no minimum payment trap, no compounding interest working against you indefinitely. For a homeowner who needs cash but wants to keep their equity untouched, it's a clean and straightforward option.",
    callout:
      "Personal loans are unsecured, meaning your home isn't on the line, and they typically come with rates far below what credit cards charge, with a fixed payoff date built in from day one.",
    body3:
      "Checking your rate takes about two minutes and won't affect your credit score. It's worth knowing what you qualify for before you decide which direction to go.",
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
    image: '/large-sum.png',
    category: 'Home Equity',
    title: 'Need a Large Sum of Money? Here Are 5 Ways Homeowners Can Get It Without the High Interest',
    excerpt:
      "Whether it's a renovation, a major expense, or getting out of debt for good, homeowners have access to borrowing options most people don't know about.",
    href: '/homeowner-borrowing-options',
  },
]

export default function HomeEquityGuidePage() {
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
          If You Own a Home, You&rsquo;re Sitting on Money. Here&rsquo;s How to Access It
        </h1>

        {/* Hero Image */}
        <div className="relative w-full mb-8 rounded-xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
          <Image
            src="/sitting-on-money.jpg"
            alt="Homeowner sitting comfortably, representing home equity wealth"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Intro Paragraphs */}
        <div className="mb-8">
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">
            Here&rsquo;s something most homeowners never stop to calculate: the average American homeowner has
            over $300,000 in home equity. Not home value — equity. Money that&rsquo;s already yours, sitting
            in the walls of your house, doing absolutely nothing.
          </p>
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">
            You&rsquo;ve been making mortgage payments for years. Every single one of those payments has been
            quietly building something. Most people have no idea what that number actually is, or that there
            are simple, low-cost ways to put it to work without selling their home.
          </p>
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">
            Whether you want to renovate, pay off debt, cover a major expense, or just have a financial
            cushion that&rsquo;s actually affordable, your equity might be the most underused asset you have.
            Here&rsquo;s how to access it.
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

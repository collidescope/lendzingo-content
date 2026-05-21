import Image from 'next/image'
import ProductNavBar from '@/components/ProductNavBar'
import SolutionSection from '@/components/SolutionSection'
import RelatedArticlesGrid from '@/components/RelatedArticlesGrid'
import type { RelatedArticle } from '@/components/RelatedArticlesGrid'

const solutions = [
  {
    id: 'heloc',
    optionNumber: 'Option 01',
    headline: 'HELOC: Borrow What You Need, When You Need It',
    body1: (
      <>
        {"Here's something most homeowners don't realize: the equity sitting in your home can be turned into a flexible line of credit at an interest rate that's typically a fraction of what a credit card charges. A "}
        <a href="https://www.myhomeequitycompanion.com/offer/cash-out-equity" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">Home Equity Line of Credit, or HELOC</a>
        {", lets you borrow what you need, when you need it, up to a set credit limit based on your home's equity."}
      </>
    ),
    body2:
      "Think of it like a credit card, but backed by your home and with a much lower rate. You draw funds during a set draw period, usually 5 to 10 years, and only pay interest on what you actually use. Pay it back, and that credit is available again. It's flexible, reusable, and one of the lowest-cost borrowing options available to homeowners today.",
    callout:
      'A HELOC works like a credit card backed by your home. You draw funds as needed during the draw period, only paying interest on what you use.',
    body3:
      "A lot of people assume applying is complicated. It doesn't have to be. You can see real options from multiple lenders in minutes, without affecting your credit score.",
    card: {
      label: 'Featured Option',
      name: 'HELOC: Home Equity Line of Credit',
      detail: 'Variable rate · Draw period up to 10 years · Interest-only payments available',
      ctaText: 'Check My Rate →',
      ctaHref: 'https://www.myhomeequitycompanion.com/offer/cash-out-equity',
    },
  },
  {
    id: 'home-equity-loan',
    optionNumber: 'Option 02',
    headline: 'Home Equity Loan: Predictable Payments, Lump Sum Access',
    body1: (
      <>
        <a href="https://www.myhomeequitycompanion.com/offer/cash-out-equity" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">A HELOC</a>
        {" is great if you want flexibility. But sometimes you know exactly how much you need and you want a payment that never changes. That's what a home equity loan gives you. You borrow a fixed amount upfront, at a fixed interest rate, and pay it back in equal monthly installments over a set term."}
      </>
    ),
    body2:
      "It sits alongside your existing mortgage as a second loan, giving you access to your equity in one clean lump sum. It's particularly well-suited for a single large expense: a kitchen renovation, a college tuition payment, or a medical bill you want to knock out in full. Because the rate is fixed, you know exactly what you owe from day one to the last payment.",
    callout:
      'Unlike a HELOC, a home equity loan gives you all the funds at once with a fixed interest rate, making it ideal for large, one-time expenses.',
    body3: (
      <>
        {"Home equity loan rates are typically lower than "}
        <a href="https://www.mypersonalloancompanion.com/offer/personal-loan" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">personal loans</a>
        {", and because the rate is fixed, you're protected if interest rates rise. What you lock in today is what you pay, start to finish."}
      </>
    ),
    card: {
      label: 'Featured Option',
      name: 'Home Equity Loan',
      detail: 'Fixed rate · Lump-sum disbursement · 5–30 year terms available',
      ctaText: 'Check My Rate →',
      ctaHref: 'https://www.myhomeequitycompanion.com/offer/cash-out-equity',
    },
  },
  {
    id: 'cash-out-refi',
    optionNumber: 'Option 03',
    headline: 'Cash-Out Refinance: Replace Your Mortgage and Pocket the Difference',
    body1: (
      <>
        {"Here's a move that surprises a lot of homeowners: you can refinance your mortgage for more than you currently owe and pocket the difference as cash. It's called a "}
        <a href="https://www.myreficompanion.com/offer/refinance" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">cash-out refinance</a>
        {". If your home is worth $400,000 and you owe $250,000, you could refinance for $300,000, pay off the old mortgage, and walk away with $50,000 in cash to use however you need."}
      </>
    ),
    body2:
      "The math makes the most sense when two things are true: you have significant equity in your home, and your current mortgage rate is higher than what's available today. If both apply, you could end up with a lower monthly payment and a large sum of cash at the same time. There are closing costs involved, typically 2–5% of the loan amount, but for the right borrower, those are easily offset by the savings.",
    callout:
      'A cash-out refinance replaces your existing mortgage with a new, larger one. The difference is paid to you in cash at closing.',
    body3:
      "This option isn't right for everyone. If you're already locked into a great rate, you'll want to think carefully before replacing your mortgage. But for homeowners who bought at a higher rate and have built up significant equity, it can be a powerful move.",
    card: {
      label: 'Featured Option',
      name: 'Cash-Out Refinance',
      detail: 'Fixed or variable rate · Replaces existing mortgage · Access large amounts of equity',
      ctaText: 'Explore My Options →',
      ctaHref: 'https://www.myreficompanion.com/offer/refinance',
    },
  },
  {
    id: 'personal-loan',
    optionNumber: 'Option 04',
    headline: 'Personal Loan: Fast Funds Without Touching Your Home',
    body1: (
      <>
        {"Not everyone owns a home. And some homeowners simply don't want to borrow against it, which is a completely reasonable call. If that's you, "}
        <a href="https://www.mypersonalloancompanion.com/offer/personal-loan" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">a personal loan</a>
        {" is almost certainly still smarter than reaching for a credit card. Personal loans are unsecured, meaning they're not tied to your home or any other asset, and they typically come with interest rates well below what credit cards charge."}
      </>
    ),
    body2:
      "More importantly, a personal loan gives you a fixed payoff date. You borrow a set amount, make a set number of monthly payments, and then you're done. Credit card debt can follow you for years if you're only making minimum payments. The structure of a personal loan forces the finish line into view. Funding is fast too, with many lenders getting money into your account within one to three business days.",
    callout: (
      <>
        {"Personal loans are unsecured, meaning your home isn't on the line, but you'll typically pay a higher rate than with "}
        <a href="https://www.myhomeequitycompanion.com/offer/cash-out-equity" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">home equity products</a>
        {"."}
      </>
    ),
    body3:
      "Personal loan rates vary based on your credit score, but checking your rate typically takes two minutes and won't affect your credit. It's worth knowing what you qualify for before you decide.",
    card: {
      label: 'Featured Option',
      name: 'Personal Loan',
      detail: 'Unsecured · Fixed rate & term · Funding as fast as 1–3 business days',
      ctaText: 'Check My Rate →',
      ctaHref: 'https://www.mypersonalloancompanion.com/offer/personal-loan',
    },
  },
  {
    id: 'debt-relief',
    optionNumber: 'Option 05',
    headline: 'Debt Relief: Get a Portion of What You Owe Forgiven',
    body1:
      "If your debt has reached the point where consolidating it into another loan doesn't feel realistic, there's another path worth knowing about. Debt relief services work differently — instead of giving you a new loan, they negotiate directly with your creditors on your behalf to reduce the total amount you owe. Not restructure it. Actually reduce it.",
    body2: (
      <>
        {"It's not the right fit for everyone. Debt relief typically makes sense when you owe at least $10,000–$15,000 in unsecured debt — credit cards, medical bills, "}
        <a href="https://www.mypersonalloancompanion.com/offer/personal-loan" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">personal loans</a>
        {" — and you're struggling to make meaningful progress on your own. If that's your situation, a debt relief partner can often settle your balances for significantly less than you owe and set you up with a manageable monthly payment plan in the meantime."}
      </>
    ),
    callout:
      "Debt relief isn't a loan — it's a negotiation. A debt relief partner works with your creditors directly to reduce what you owe, not just restructure it.",
    body3:
      "The process takes time — typically 24 to 48 months — but for people who are genuinely stuck, it can be a faster path to being debt-free than making minimum payments for years. It takes about a minute to see if you qualify.",
    card: {
      label: 'Not a Loan — A Better Way Out',
      name: 'Debt Relief Assistance',
      detail: 'Creditor negotiation · Works with Accredited, National Debt Relief & Freedom Financial',
      ctaText: 'See If I Qualify →',
      ctaHref: 'https://myDebtCompanion.com',
    },
    isLast: true,
  },
]

const relatedArticles: RelatedArticle[] = [
  {
    image: '/hero-smarter-ways.png',
    category: 'Borrowing Smart',
    title: "Still Paying Credit Card Interest? Here's What Financially Savvy People Do Instead",
    excerpt:
      "Credit card interest is one of the most expensive mistakes you can keep making. Here's how homeowners are escaping it and what to do if you don't have equity yet.",
    href: '/escape-credit-card-interest',
  },
  {
    image: '/escape-cc-interest.png',
    category: 'Home Equity',
    title: "If You Own a Home, You're Sitting on Money. Here's How to Access It",
    excerpt:
      "Most homeowners have no idea how much equity they've built up, or how easily they can put it to work. Here's a plain-English guide to your options.",
    href: '/home-equity-guide',
  },
  {
    image: '/sitting-on-money.jpg',
    category: 'Home Equity',
    title: 'Need a Large Sum of Money? Here Are 5 Ways Homeowners Can Get It Without the High Interest',
    excerpt:
      "Whether it's a renovation, a major expense, or getting out of debt for good, homeowners have access to borrowing options most people don't know about.",
    href: '/homeowner-borrowing-options',
  },
]

export default function SmarterWaysToBorrowPage() {
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
            <p className="text-xs font-sans text-lendzingo-muted">Updated May 10, 2026 · 6 min read</p>
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-bold text-lendzingo-ink leading-tight mb-6">
          5 Smarter Ways to Borrow Money (That Most People Don&rsquo;t Know About)
        </h1>

        {/* Hero Image */}
        <div className="relative w-full mb-8 rounded-xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
          <Image
            src="/hero-smarter-ways.png"
            alt="Person at kitchen table researching smarter ways to borrow money"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Intro Paragraphs */}
        <div className="mb-8">
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">
            You need money. Maybe it&rsquo;s for a home project, maybe it&rsquo;s to finally get out from under
            credit card debt, maybe it&rsquo;s just a big expense you didn&rsquo;t see coming. Whatever the
            reason, the way most people borrow is costing them way more than it should.
          </p>
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">
            Most people&rsquo;s first instinct is to reach for a credit card. It&rsquo;s easy and fast, and
            it could cost you 20%, 25%, or more in interest. There are smarter options. Most people just
            don&rsquo;t know they exist.
          </p>
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">
            If you own a home, you&rsquo;re especially well-positioned. Your home equity is one of the most
            powerful and underused financial tools available to everyday Americans.
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
        <RelatedArticlesGrid articles={relatedArticles} />

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

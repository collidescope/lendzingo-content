import Image from 'next/image'
import ProductNavBar from '@/components/ProductNavBar'
import SolutionSection from '@/components/SolutionSection'
import RelatedArticlesGrid from '@/components/RelatedArticlesGrid'
import type { NavItem } from '@/components/ProductNavBar'
import type { RelatedArticle } from '@/components/RelatedArticlesGrid'

const navItems: NavItem[] = [
  { id: 'heloc', label: 'HELOC' },
  { id: 'debt-relief', label: 'Debt Relief' },
  { id: 'home-equity-loan', label: 'Home Equity Loan' },
  { id: 'cash-out-refi', label: 'Cash-Out Refinance' },
  { id: 'personal-loan', label: 'Personal Loan' },
]

const solutions = [
  {
    id: 'heloc',
    optionNumber: 'Option 01',
    headline: "HELOC: Use Your Home's Equity to Wipe Out High-Interest Debt",
    body1:
      "Here's a move that changes the math completely. A Home Equity Line of Credit lets you borrow against the equity in your home at a rate that's typically a fraction of what your credit card charges. Use it to pay off your card balances in full and suddenly you're paying 7–9% interest instead of 24–25%. On $20,000 in debt, that difference can save you thousands of dollars a year.",
    body2:
      "A HELOC works like a revolving line of credit. You're approved for a limit based on your home equity, draw what you need, and only pay interest on what you use. It's flexible, reusable, and because it's secured by your home, lenders offer rates that credit card companies simply can't compete with.",
    callout:
      "A HELOC works like a credit card backed by your home, but with a fraction of the interest rate. Use it to pay off high-interest balances and keep it available for future needs.",
    body3:
      "Checking your rate takes minutes and won't affect your credit score. If you own a home and carry credit card debt, this is the first option worth exploring.",
    card: {
      label: 'Most Popular Option',
      name: 'HELOC: Home Equity Line of Credit',
      detail: 'Variable rate · Draw period up to 10 years · Interest-only payments available',
      ctaText: 'Check My Rate →',
      ctaHref: 'https://www.myhomeequitycompanion.com/offer/cash-out-equity',
    },
  },
  {
    id: 'debt-relief',
    optionNumber: 'Option 02',
    headline: 'Debt Relief: Stop Negotiating Alone. Get Experts to Reduce What You Owe',
    body1:
      "If your credit card debt has reached the point where paying it off feels genuinely out of reach, there's a path that most people don't know exists. Debt relief services don't give you a new loan — they negotiate directly with your creditors on your behalf to reduce the total amount you owe. Not restructure it. Actually reduce it.",
    body2:
      "It typically makes sense when you owe at least $10,000–$15,000 in unsecured debt and you're struggling to make meaningful progress on your own. A debt relief partner builds you a monthly payment plan, then works with your creditors over time to settle your balances for significantly less than the original amount. It takes 24 to 48 months, but for people who are genuinely stuck, it's often a faster path to being debt-free than making minimum payments indefinitely.",
    callout:
      "Debt relief isn't a loan — it's a negotiation. A debt relief partner works with your creditors directly to reduce what you owe, not just restructure it.",
    body3:
      "It takes about a minute to see if you qualify. There's no obligation, and checking won't affect your credit score.",
    card: {
      label: 'Not a Loan — A Better Way Out',
      name: 'Debt Relief Assistance',
      detail: 'Creditor negotiation · Works with Accredited, National Debt Relief & Freedom Financial',
      ctaText: 'See If I Qualify →',
      ctaHref: 'https://myDebtCompanion.com',
    },
  },
  {
    id: 'home-equity-loan',
    optionNumber: 'Option 03',
    headline: 'Home Equity Loan: Lock In a Low Fixed Rate and Pay Off Your Cards for Good',
    body1:
      "If you want to pay off your credit card balances once and be done with it — one payoff, one fixed rate, one predictable monthly payment — a home equity loan is worth a serious look. You borrow a set amount against your home equity, receive it as a lump sum, and use it to clear every card balance at once. Then you repay the home equity loan at a fixed rate that's a fraction of what the cards were charging.",
    body2:
      "Unlike a HELOC, the rate never changes. You know exactly what you owe and exactly when you'll be done. For people who want the certainty of a fixed payoff date and a payment that stays the same start to finish, this structure is often more appealing than a revolving line of credit.",
    callout:
      "A home equity loan gives you all the funds at once with a fixed interest rate. Use it to pay off every card balance and replace multiple high-interest payments with one low fixed one.",
    body3:
      "Home equity loan rates are typically lower than personal loans and far lower than credit cards. And because the rate is fixed, you're fully protected if interest rates rise after you borrow.",
    card: {
      label: 'Fixed Rate, One Payment',
      name: 'Home Equity Loan',
      detail: 'Fixed rate · Lump-sum disbursement · 5–30 year terms available',
      ctaText: 'Check My Rate →',
      ctaHref: 'https://www.myhomeequitycompanion.com/offer/cash-out-equity',
    },
  },
  {
    id: 'cash-out-refi',
    optionNumber: 'Option 04',
    headline: 'Cash-Out Refinance: Replace Your Mortgage, Pay Off Your Debt, Start Fresh',
    body1:
      "If you have significant equity in your home and your current mortgage rate is higher than what's available today, a cash-out refinance can accomplish two things at once. You refinance your mortgage for more than you currently owe, pocket the difference as cash, and use it to pay off your credit card balances in full. In the right situation, you walk away with a lower mortgage payment and zero credit card debt.",
    body2:
      "It's a bigger move than a HELOC or home equity loan — you're replacing your entire mortgage, not adding a second one alongside it. That means closing costs, typically 2–5% of the loan amount. But for homeowners who bought at a higher rate and have built up real equity, the math can work strongly in their favor.",
    callout:
      "A cash-out refinance replaces your existing mortgage with a new, larger one. The difference comes to you in cash, which you can use to pay off high-interest debt entirely.",
    body3:
      "This isn't the right move for everyone — if you're locked into a low rate, you'll want to think carefully before replacing it. But if rates have dropped since you bought, it's worth running the numbers.",
    card: {
      label: 'Two Problems, One Move',
      name: 'Cash-Out Refinance',
      detail: 'Fixed or variable rate · Replaces existing mortgage · Access large amounts of equity',
      ctaText: 'Explore My Options →',
      ctaHref: 'https://www.myreficompanion.com/offer/refinance',
    },
  },
  {
    id: 'personal-loan',
    optionNumber: 'Option 05',
    headline: "Personal Loan: No Home Equity? There's Still a Smarter Way Out",
    body1:
      "Not everyone owns a home — and some homeowners simply don't want to borrow against it. If that's you, a personal loan is still a significantly smarter move than carrying credit card balances. Personal loans are unsecured, come with a fixed interest rate, and typically charge well below what credit cards do. You borrow a set amount, consolidate your card balances into one payment, and have a clear date when it's all paid off.",
    body2:
      "That fixed payoff date matters more than people realize. Credit card minimum payments are designed to keep you paying interest as long as possible. A personal loan forces a finish line. And because the rate is fixed, you know exactly how much you'll pay in total — no surprises, no compounding balances, no moving targets.",
    callout:
      "Personal loans are unsecured, meaning your home isn't on the line, and they typically come with rates far below what credit cards charge, making them a strong alternative for non-homeowners.",
    body3:
      "Checking your rate takes about two minutes and won't affect your credit score. It's worth knowing what you qualify for, even if you're not sure yet whether a personal loan is the right move.",
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
    image: '/sitting-on-money.jpg',
    category: 'Home Equity',
    title: "If You Own a Home, You're Sitting on Money. Here's How to Access It",
    excerpt:
      "Most homeowners have no idea how much equity they've built up, or how easily they can put it to work. Here's a plain-English guide to your options.",
    href: '/home-equity-guide',
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

export default function EscapeCreditCardInterestPage() {
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
          Still Paying Credit Card Interest? Here&rsquo;s What Financially Savvy People Do Instead
        </h1>

        {/* Hero Image */}
        <div className="relative w-full mb-8 rounded-xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
          <Image
            src="/escape-cc-interest.png"
            alt="Person researching ways to escape credit card interest"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Intro Paragraphs */}
        <div className="mb-8">
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">
            You make the payment every month. Sometimes more than the minimum. And yet the balance barely
            moves. That&rsquo;s not a discipline problem — that&rsquo;s a math problem. Credit card interest
            rates are sitting near 25% right now, and at that rate, the bank is winning every single month.
          </p>
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">
            The good news: there are ways out that most people never consider. Lower rates, real payoff
            timelines, and in some cases, a path to paying back less than you actually owe.
          </p>
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">
            If you own a home, your options are especially strong. The equity you&rsquo;ve built up is one of
            the most effective tools available for escaping high-interest debt, and most homeowners never use it.
          </p>
          <p className="font-sans text-[1.05rem] leading-[1.8] text-lendzingo-muted italic">
            Read through each option below, or jump to the one that fits your situation. Don&rsquo;t own a home
            yet? Stick around — we didn&rsquo;t forget about you.
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

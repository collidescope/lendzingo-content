import Image from 'next/image'
import ProductNavBar from '@/components/ProductNavBar'
import SolutionSection from '@/components/SolutionSection'
import RelatedArticlesGrid from '@/components/RelatedArticlesGrid'
import type { RelatedArticle } from '@/components/RelatedArticlesGrid'

const solutions = [
  {
    id: 'auto-insurance',
    optionNumber: 'Option 01',
    headline: 'Auto Insurance: Loyalty Costs You More Than You Think',
    body1: (
      <>
        {"Most people pick an "}
        <a href="#" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">auto insurance</a>
        {" policy once, set up autopay, and never look at it again. That loyalty costs money. Insurance companies routinely charge long-term customers more than they'd charge a brand-new customer for the exact same coverage, a practice called price optimization, and they're counting on the fact that most people won't notice."}
      </>
    ),
    body2:
      "The fix is straightforward: compare rates. Studies consistently show that drivers who shop their policy save an average of $500–$700 per year by switching. You don't even have to switch if you don't want to. Sometimes showing your current insurer a competing quote is enough to bring your rate down. But you can't negotiate a price you don't know is wrong.",
    callout:
      "Insurance companies frequently charge loyal customers more than new customers for identical coverage. Shopping your policy takes about five minutes and costs nothing.",
    body3: (
      <>
        <a href="#" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">Comparing rates</a>
        {" is free, takes about five minutes, and won't affect your credit score. There's no obligation to switch. It's worth knowing the number either way."}
      </>
    ),
    card: {
      label: 'Featured Option',
      name: 'Auto Insurance Comparison',
      detail: 'Compare rates from multiple carriers · No impact to credit score · Takes about 5 minutes',
      ctaText: 'Compare My Rate →',
      ctaHref: '#',
    },
  },
  {
    id: 'high-yield-savings',
    optionNumber: 'Option 02',
    headline: 'Your Savings Account: Earning Almost Nothing While Better Options Pay Far More',
    body1: (
      <>
        {"If your savings are sitting in a traditional bank account, you're likely earning somewhere between 0.01% and 0.5% interest per year. On a $10,000 balance, that's $1 to $50 annually. High-yield savings accounts, typically offered by online banks, such as "}
        <a href="#" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">Barclay's</a>
        {", are currently paying upwards of 7X on the same FDIC-insured deposits. Your money is doing the same job in both places. It's just getting paid very differently."}
      </>
    ),
    body2:
      "On $10,000, the gap between a 0.1% traditional account and a 3.65% high-yield account works out to roughly $355 per year. And every year, the difference increases as your savings grows.",
    callout: (
      <>
        {"High-yield savings accounts like "}
        <a href="#" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">Barclay's</a>
        {" are FDIC-insured, just like traditional bank accounts. The difference isn't safety. It's how much your money earns while it sits there."}
      </>
    ),
    body3: (
      <>
        {"Opening a "}
        <a href="#" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">Barclay's</a>
        {" account takes about ten minutes. There's no minimum balance requirement and no monthly fees. Your money stays fully accessible whenever you need it."}
      </>
    ),
    card: {
      label: 'Featured Option',
      name: 'High-Yield Savings Account',
      detail: 'FDIC-insured · No monthly fees · Earn significantly more than a traditional savings account',
      ctaText: 'Open an Account →',
      ctaHref: '#',
    },
  },
  {
    id: 'credit-card-debt',
    optionNumber: 'Option 03',
    headline: 'Credit Card Interest: The Bill That Keeps Growing If You’re Only Paying the Minimum',
    body1: (
      <>
        {"The average credit card charges 20–24% interest annually. If you're carrying a balance and making minimum payments, the math is working hard against you. A $10,000 balance at 24% APR can cost more than $8,000 in interest over the life of the debt, assuming you never add to it. A "}
        <a href="/savings-calculator" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">personal loan at a lower rate</a>
        {" changes that math entirely."}
      </>
    ),
    body2:
      "Consolidating credit card debt into a personal loan means replacing multiple high-interest accounts with a fixed payment at a lower rate. You get a clear finish line, a specific month when the debt is gone, rather than the open-ended treadmill of minimum payments. The total interest you pay drops significantly, and your monthly payment is often lower than what you're paying now.",
    callout:
      "Consolidating into a personal loan doesn't just lower your interest rate. It gives you a fixed payoff date. Minimum payments on a credit card can keep you in debt for a decade.",
    body3: (
      <>
        {"Use "}
        <a href="/savings-calculator" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">our calculator</a>
        {" to see exactly how much you could save based on your actual balances and rates. It takes about a minute and requires no personal information."}
      </>
    ),
    card: {
      label: 'Try Our Free Calculator',
      name: 'Credit Card Savings Calculator',
      detail: 'Enter your balances and APRs · See your exact savings · No personal info required',
      ctaText: 'Calculate My Savings →',
      ctaHref: '/savings-calculator',
    },
  },
  {
    id: 'student-loans',
    optionNumber: 'Option 04',
    headline: 'Student Loans: Still Paying the Rate You Got at 22?',
    body1:
      "Most people took out student loans when they were young, had little or no credit history, and had no real ability to negotiate their rate. They took what the lender offered, signed the paperwork, and moved on. Years later, their financial situation has changed substantially, with better income, stronger credit, and a track record of on-time payments, but they're still paying the rate they locked in as a college student.",
    body2: (
      <>
        {"Refinancing a "}
        <a href="#" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">student loan</a>
        {" means replacing your current loan with a new one at a lower interest rate, based on who you are today rather than who you were at graduation. If your credit score has improved, you may qualify for a rate that meaningfully reduces both your monthly payment and the total interest you'll pay over the life of the loan. The process is straightforward, and checking your rate doesn't affect your credit score."}
      </>
    ),
    callout:
      "Your credit profile at 22 was almost certainly weaker than it is today. Refinancing lets you borrow based on who you are now, not the rate you were handed when you first signed.",
    body3:
      "Checking your rate takes about two minutes and won't affect your credit. If the new rate beats what you're currently paying, refinancing is a simple process. If it doesn't, you're no worse off for having looked.",
    card: {
      label: 'Featured Option',
      name: 'Student Loan Refinancing',
      detail: 'Check your rate in 2 minutes · No impact to credit score · Fixed or variable rate options',
      ctaText: 'Check My Rate →',
      ctaHref: '#',
    },
  },
  {
    id: 'home-insurance',
    optionNumber: 'Option 05',
    headline: 'Home Insurance: Another Policy That Auto-Renews at a Price Nobody Negotiated',
    body1:
      "Home insurance works exactly like auto insurance in one important way: most homeowners bought a policy when they closed on their house, set up autopay, and have been renewing it ever since without ever asking whether they could do better. The premium creeps up each year, chalked up to inflation, and most people pay it without question.",
    body2: (
      <>
        {"The reality is that "}
        <a href="#" target="_blank" rel="noopener noreferrer" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">home insurance</a>
        {" rates vary significantly between carriers for the same property and the same level of coverage. Bundling your home and auto policies with the same insurer can help, but it doesn't always produce the best rate. The only way to know if you're overpaying is to see what other carriers would charge. For most homeowners, the savings from switching run several hundred dollars per year."}
      </>
    ),
    callout:
      "Home insurance premiums can vary by hundreds of dollars annually for identical coverage. Most homeowners haven't compared rates since the day they bought their house.",
    body3:
      "Comparing home insurance rates is free and takes a few minutes. There's no penalty for switching mid-policy, and most carriers will prorate any unused premium back to you.",
    card: {
      label: 'Featured Option',
      name: 'Home Insurance Comparison',
      detail: 'Compare multiple carriers · Same coverage, lower rate · No impact to credit score',
      ctaText: 'Compare My Rate →',
      ctaHref: '#',
    },
    isLast: true,
  },
]

const relatedArticles: RelatedArticle[] = [
  {
    image: '/escape-cc-interest.png',
    category: 'Credit Card Debt',
    title: "Still Paying Credit Card Interest? Here's What Financially Savvy People Do Instead",
    excerpt:
      "Credit card interest is one of the most expensive mistakes you can keep making. Here's how to get ahead of it.",
    href: '/escape-credit-card-interest',
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

export default function SpendingTooMuchPage() {
  return (
    <>
      <ProductNavBar items={[
        { id: 'auto-insurance',    label: 'Auto Insurance' },
        { id: 'high-yield-savings', label: 'High-Yield Savings' },
        { id: 'credit-card-debt',  label: 'Credit Card Consolidation' },
        { id: 'student-loans',     label: 'Student Loan Refinance' },
        { id: 'home-insurance',    label: 'Home Insurance' },
      ]} />

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
            <p className="text-xs font-sans text-lendzingo-muted">Updated May 24, 2026 · 7 min read</p>
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-bold text-lendzingo-ink leading-tight mb-6">
          The 5 Dumbest Things People Keep Spending Too Much Money On
        </h1>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-8">
          <Image
            src="/savings.png"
            alt="Person reviewing their finances at a kitchen table"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Intro Paragraphs */}
        <div className="mb-8">
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">
            You&rsquo;ve already cut the subscriptions you weren&rsquo;t using. You&rsquo;re making coffee at home. You&rsquo;ve done
            the things every personal finance article tells you to do. And you&rsquo;re still looking for more room
            in your budget.
          </p>
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">
            Here&rsquo;s what most of those articles miss: the biggest savings for most people aren&rsquo;t hiding in
            their daily habits. They&rsquo;re locked inside recurring bills that were set up once and never
            revisited. Insurance policies that auto-renew every year at a price nobody negotiated. A savings
            account earning almost nothing when better options are widely available. Debt that&rsquo;s costing more
            than it needs to because refinancing was never mentioned as an option.
          </p>
          <p className="font-sans text-[1.1rem] leading-[1.8] text-lendzingo-ink mb-4">
            These aren&rsquo;t lifestyle choices. They&rsquo;re structural overpayments. Unlike cutting your
            morning coffee, fixing them doesn&rsquo;t require any ongoing sacrifice. You deal with it once, and the
            savings show up every month after that.
          </p>
          <p className="font-sans text-[1.05rem] leading-[1.8] text-lendzingo-muted italic">
            Here are five of the biggest. Read through each one, or jump to the one that applies to your
            situation.
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

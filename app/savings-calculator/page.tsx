import Image from 'next/image'
import CalculatorForm from '@/components/calculator/CalculatorForm'

export default function SavingsCalculatorPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-24 lg:pb-10">
      {/* Intro */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <span className="block text-xs font-sans font-semibold text-lendzingo-green uppercase tracking-[0.15em] mb-3">
          Credit Card Debt
        </span>
        <h1 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-lendzingo-ink leading-tight mb-6">
          How Much Could You Save by Ditching Your Credit Card Interest?
        </h1>
        <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-6">
          <Image
            src="/credit_card.png"
            alt="Credit card on a clean surface"
            fill
            className="object-cover"
            priority
          />
        </div>
        <p className="font-sans text-[1.05rem] leading-[1.8] text-lendzingo-muted">
          If you&rsquo;re carrying a credit card balance, you&rsquo;re probably paying more in interest than
          you realize. Adjust the sliders below to see exactly how much you could save by switching
          to a lower-interest personal loan.
        </p>
      </div>

      {/* Calculator */}
      <CalculatorForm />
    </div>
  )
}

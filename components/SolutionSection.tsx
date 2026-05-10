import CalloutBox from './CalloutBox'
import ProductCard from './ProductCard'

interface SolutionSectionProps {
  id: string
  optionNumber: string
  headline: string
  body1: string
  body2: string
  callout: string
  body3: string
  card: {
    label: string
    name: string
    detail: string
    ctaText: string
    ctaHref: string
  }
  isLast?: boolean
}

export default function SolutionSection({
  id,
  optionNumber,
  headline,
  body1,
  body2,
  callout,
  body3,
  card,
  isLast = false,
}: SolutionSectionProps) {
  return (
    <section id={id} className="py-10 scroll-mt-32">
      <span className="block text-xs font-sans font-semibold text-lendzingo-green uppercase tracking-[0.15em] mb-3">
        {optionNumber}
      </span>
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-lendzingo-ink mb-5 leading-snug">
        {headline}
      </h2>
      <p className="font-sans text-base leading-[1.8] text-lendzingo-ink mb-4">{body1}</p>
      <p className="font-sans text-base leading-[1.8] text-lendzingo-ink mb-4">{body2}</p>
      <CalloutBox>{callout}</CalloutBox>
      <p className="font-sans text-base leading-[1.8] text-lendzingo-ink mb-4">{body3}</p>
      <ProductCard {...card} />
      {!isLast && <hr className="border-gray-100 mt-4" />}
    </section>
  )
}

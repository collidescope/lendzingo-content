import Image from 'next/image'
import RefiTracker from '@/components/RefiTracker'

export default function RefiTrackerPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
      {/* Intro */}
      <div className="mb-10">
        <span className="block text-xs font-sans font-semibold text-lendzingo-green uppercase tracking-[0.15em] mb-3">
          Personal Finance
        </span>
        <h1 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-lendzingo-ink leading-tight mb-6">
          Know the moment refinancing makes sense for you.
        </h1>
      </div>

      {/* Hero Image */}
      <div className="relative w-full mb-8 rounded-xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
        <Image
          src="/couple_refinancing.png"
          alt="Couple reviewing their mortgage refinancing options"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Intro copy */}
      <div className="mb-10">
        <p className="font-sans text-[1.05rem] leading-[1.8] text-lendzingo-ink mb-3">
          Enter your loan details and tell us how much you&rsquo;d like to save each month. We&rsquo;ll
          run your numbers against live mortgage rates and show you exactly where things stand today.
        </p>
        <p className="font-sans text-sm leading-[1.8] text-lendzingo-muted">
          Takes about 60 seconds. No login required.
        </p>
      </div>

      {/* Form + Results */}
      <RefiTracker />

      {/* Footer disclaimer */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <p className="font-sans text-xs text-lendzingo-muted leading-relaxed">
          Advertising Disclosure: Lendzingo is an advertising-supported comparison platform. We may
          receive compensation when you click on links to products featured on this site. This
          compensation may impact how and where products appear. Lendzingo does not include all
          available financial products.
        </p>
      </div>
    </div>
  )
}

import Link from 'next/link'

interface ProductCardProps {
  label: string
  name: string
  detail: string
  ctaText: string
  ctaHref: string
}

export default function ProductCard({ label, name, detail, ctaText, ctaHref }: ProductCardProps) {
  return (
    <div className="my-8 bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-sans font-semibold text-lendzingo-muted uppercase tracking-widest">
            {label}
          </p>
          <p className="text-base font-sans font-semibold text-lendzingo-ink">
            {name}
          </p>
          <p className="text-sm text-lendzingo-muted font-sans">{detail}</p>
        </div>
        <Link
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 w-full sm:w-auto text-center bg-lendzingo-green hover:bg-lendzingo-green-dark text-white text-sm font-sans font-semibold px-6 py-3 rounded-lg transition-colors duration-150"
        >
          {ctaText}
        </Link>
      </div>
    </div>
  )
}

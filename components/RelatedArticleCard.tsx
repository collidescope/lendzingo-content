import Link from 'next/link'

interface RelatedArticleCardProps {
  thumbnailColor: string
  category: string
  title: string
  excerpt: string
  href: string
}

export default function RelatedArticleCard({
  thumbnailColor,
  category,
  title,
  excerpt,
  href,
}: RelatedArticleCardProps) {
  return (
    <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div
        className="w-full h-40 flex-shrink-0"
        style={{ backgroundColor: thumbnailColor }}
        aria-hidden="true"
      />
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-sans font-semibold text-lendzingo-green uppercase tracking-widest mb-2">
          {category}
        </span>
        <h3 className="font-serif text-base font-bold text-lendzingo-ink leading-snug mb-2">
          {title}
        </h3>
        <p className="font-sans text-sm text-lendzingo-muted leading-relaxed mb-4 flex-1">
          {excerpt}
        </p>
        <Link
          href={href}
          className="font-sans text-sm font-semibold text-lendzingo-green hover:text-lendzingo-green-dark transition-colors"
        >
          Read More →
        </Link>
      </div>
    </article>
  )
}

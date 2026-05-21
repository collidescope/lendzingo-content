'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const TRACKED_PARAMS = ['tid', 'aid', 'creatid', 'campid', 'adsetid', 'gad_source', 'gbraid', 'wbraid', 'gclid']

interface RelatedArticleCardProps {
  image: string
  category: string
  title: string
  excerpt: string
  href: string
}

export default function RelatedArticleCard({
  image,
  category,
  title,
  excerpt,
  href,
}: RelatedArticleCardProps) {
  const searchParams = useSearchParams()

  const decoratedHref = (() => {
    const params = TRACKED_PARAMS
      .filter((key) => searchParams.has(key))
      .map((key) => `${key}=${searchParams.get(key)}`)
    return params.length ? `${href}?${params.join('&')}` : href
  })()

  return (
    <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="relative w-full flex-shrink-0" style={{ aspectRatio: '16/9' }}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
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
          href={decoratedHref}
          className="font-sans text-sm font-semibold text-lendzingo-green hover:text-lendzingo-green-dark transition-colors"
        >
          Read More →
        </Link>
      </div>
    </article>
  )
}

import { Suspense } from 'react'
import RelatedArticleCard, { RelatedArticleCardShell } from './RelatedArticleCard'

export interface RelatedArticle {
  image: string
  category: string
  title: string
  excerpt: string
  href: string
}

interface RelatedArticlesGridProps {
  articles: RelatedArticle[]
  heading?: string
}

export default function RelatedArticlesGrid({ articles, heading = 'More Ways to Improve Your Finances' }: RelatedArticlesGridProps) {
  return (
    <section className="py-12">
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-lendzingo-ink mb-8">
        {heading}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Suspense key={article.title} fallback={<RelatedArticleCardShell {...article} />}>
            <RelatedArticleCard {...article} />
          </Suspense>
        ))}
      </div>
    </section>
  )
}

import RelatedArticleCard from './RelatedArticleCard'

export interface RelatedArticle {
  thumbnailColor: string
  category: string
  title: string
  excerpt: string
  href: string
}

interface RelatedArticlesGridProps {
  articles: RelatedArticle[]
}

export default function RelatedArticlesGrid({ articles }: RelatedArticlesGridProps) {
  return (
    <section className="py-12">
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-lendzingo-ink mb-8">
        More Ways to Improve Your Finances
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <RelatedArticleCard key={article.title} {...article} />
        ))}
      </div>
    </section>
  )
}

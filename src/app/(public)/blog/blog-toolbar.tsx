import Link from 'next/link'

type Category = { _id: string; name: string; slug: string }

/**
 * Category pills + search. Shared by the blog index and the category pages
 * so both keep the same control row rather than each rolling its own.
 */
export function BlogToolbar({
  categories,
  activeCategory,
  activeQuery,
}: {
  categories: Category[]
  activeCategory?: string
  activeQuery?: string
}) {
  return (
    <div className="page-toolbar">
      <div className="page-pills">
        <Link href="/blog" className={`page-pill${!activeCategory ? ' active' : ''}`}>
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/blog/category/${category.slug}`}
            className={`page-pill${activeCategory === category.slug ? ' active' : ''}`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <form action="/blog" method="get">
        <input
          type="search"
          name="q"
          placeholder="Search posts…"
          defaultValue={activeQuery}
          aria-label="Search posts"
          className="page-search"
        />
      </form>
    </div>
  )
}

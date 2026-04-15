import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import Link from 'next/link'
import { encyclopediaData } from '../data/encyclopedia'
import { BOOK_SLUGS } from '../lib/slugs'

export default function SearchPage({ index }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const q = (router.query.q || '').trim()
    setQuery(q)
    if (!q) {
      setResults([])
      return
    }
    const matched = index.filter(
      (item) =>
        item.chapterName.includes(q) ||
        item.bookName.includes(q) ||
        item.content.includes(q)
    )
    setResults(matched)
  }, [router.query.q, index])

  function handleSubmit(e) {
    e.preventDefault()
    const q = e.target.q.value.trim()
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  function getSnippet(content, q) {
    const idx = content.indexOf(q)
    if (idx === -1) return content.slice(0, 160) + '...'
    const start = Math.max(0, idx - 60)
    const end = Math.min(content.length, idx + q.length + 100)
    return (start > 0 ? '...' : '') + content.slice(start, end) + (end < content.length ? '...' : '')
  }

  return (
    <Layout title="البحث">
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <h2 className="section-title">البحث في الموسوعة</h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="search-bar">
            <input
              key={query}
              name="q"
              defaultValue={query}
              placeholder="ابحث في الموسوعة..."
              className="search-input"
              autoFocus
            />
            <button type="submit" className="search-btn">بحث</button>
          </div>
        </form>

        {query && (
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
            {results.length > 0
              ? `${results.length} نتيجة للبحث عن "${query}"`
              : `لا توجد نتائج للبحث عن "${query}"`}
          </p>
        )}

        <div className="search-results">
          {results.map((item) => (
            <Link
              key={item.chapterId}
              href={`/book/${item.bookSlug}?chapter=${item.chapterId}`}
              className="search-result"
            >
              <div className="search-result-meta">{item.bookName}</div>
              <div className="search-result-title">{item.chapterName}</div>
              {item.content && (
                <div className="search-result-snippet">
                  {getSnippet(item.content, query)}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const index = []
  for (const book of encyclopediaData.books) {
    for (const chapter of book.chapters) {
      index.push({
        bookId: book.id,
        bookName: book.nameAr,
        bookSlug: BOOK_SLUGS[book.id] || book.id,
        chapterId: chapter.id,
        chapterName: chapter.nameAr,
        content: (chapter.articles?.[0]?.content || '').slice(0, 500),
      })
    }
  }
  return { props: { index } }
}

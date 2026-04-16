import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import Link from 'next/link'
import { encyclopediaData } from '../../data/encyclopedia'
import { BOOK_SLUGS } from '../../lib/slugs'
import { useTranslation, SUPPORTED_LANGS } from '../../lib/useTranslation'

export default function SearchPage({ index, lang }) {
  const { t } = useTranslation(lang)
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const q = (router.query.q || '').trim()
    setQuery(q)
    if (!q) { setResults([]); return }
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
    if (q) router.push(`/${lang}/search?q=${encodeURIComponent(q)}`)
  }

  function getSnippet(content, q) {
    const idx = content.indexOf(q)
    if (idx === -1) return content.slice(0, 160) + '...'
    const start = Math.max(0, idx - 60)
    const end = Math.min(content.length, idx + q.length + 100)
    return (start > 0 ? '...' : '') + content.slice(start, end) + (end < content.length ? '...' : '')
  }

  return (
    <Layout title={t('search_page_title')} lang={lang}>
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <h2 className="section-title">{t('search_heading')}</h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="search-bar">
            <input
              key={query}
              name="q"
              defaultValue={query}
              placeholder={t('search_input_placeholder')}
              className="search-input"
              autoFocus
            />
            <button type="submit" className="search-btn">{t('search_btn')}</button>
          </div>
        </form>

        {query && (
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
            {results.length > 0
              ? t('search_results', { count: results.length, query })
              : t('search_no_results', { query })}
          </p>
        )}

        <div className="search-results">
          {results.map((item) => (
            <Link
              key={item.chapterId}
              href={`/${lang}/book/${item.bookSlug}?chapter=${item.chapterId}`}
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

export async function getStaticPaths() {
  return {
    paths: SUPPORTED_LANGS.map((lang) => ({ params: { lang } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const { lang } = params
  if (!SUPPORTED_LANGS.includes(lang)) return { notFound: true }

  const nameKey = `name${lang.charAt(0).toUpperCase() + lang.slice(1)}`
  const contentKey = `content${lang.charAt(0).toUpperCase() + lang.slice(1)}`

  const index = []
  for (const book of encyclopediaData.books) {
    for (const chapter of book.chapters) {
      const article = chapter.articles?.[0]
      const content = (article?.[contentKey] || article?.content || '').slice(0, 500)
      index.push({
        bookId: book.id,
        bookName: book[nameKey] || book.nameAr,
        bookSlug: BOOK_SLUGS[book.id] || book.id,
        chapterId: chapter.id,
        chapterName: chapter[nameKey] || chapter.nameAr,
        content,
      })
    }
  }
  return { props: { index, lang } }
}

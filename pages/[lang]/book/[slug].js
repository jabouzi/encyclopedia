import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import Sidebar from '../../../components/Sidebar'
import ArticleView from '../../../components/ArticleView'
import { encyclopediaData } from '../../../data/encyclopedia'
import { BOOK_SLUGS, SLUG_TO_BOOK_ID } from '../../../lib/slugs'
import { useTranslation, SUPPORTED_LANGS } from '../../../lib/useTranslation'
import Link from 'next/link'

export default function BookPage({ book, chapters, lang }) {
  const { t } = useTranslation(lang)
  const router = useRouter()
  const [activeChapterId, setActiveChapterId] = useState(
    chapters.length > 0 ? chapters[0].id : null
  )

  useEffect(() => {
    const chapterFromQuery = router.query.chapter
    if (chapterFromQuery && chapters.some((ch) => ch.id === chapterFromQuery)) {
      setActiveChapterId(chapterFromQuery)
    } else {
      setActiveChapterId(chapters.length > 0 ? chapters[0].id : null)
    }
  }, [book.id, router.query.chapter])

  const nameKey = `name${lang.charAt(0).toUpperCase() + lang.slice(1)}`
  const descKey = `description${lang.charAt(0).toUpperCase() + lang.slice(1)}`
  const bookName = book[nameKey] || book.nameAr
  const bookDesc = book[descKey] || book.description

  const activeChapter = chapters.find((ch) => ch.id === activeChapterId)
  const activeArticle = activeChapter?.articles?.[0] || null

  const contentKey = `content${lang.charAt(0).toUpperCase() + lang.slice(1)}`
  const localizedArticle = activeArticle
    ? { ...activeArticle, content: activeArticle[contentKey] || activeArticle.content }
    : null

  const borderInlineStart = lang === 'ar' ? 'borderRight' : 'borderLeft'

  return (
    <Layout title={bookName} activeBook={book.id} lang={lang}>
      <div className="container">
        <div className="breadcrumb">
          <Link href={`/${lang}`}>{t('breadcrumb_home')}</Link>
          <span> › </span>
          <span>{bookName}</span>
        </div>

        <div className="page-header" style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{book.icon}</div>
          <h1 style={{ margin: '0 0 8px 0', color: 'var(--green-dark)' }}>{bookName}</h1>
          <p style={{ margin: '0', color: 'var(--muted)', lineHeight: '1.6' }}>{bookDesc}</p>
        </div>

        <div className="content-layout">
          <div style={{ flex: '0 0 280px' }}>
            <Sidebar
              chapters={chapters}
              activeChapterId={activeChapterId}
              onChapterSelect={setActiveChapterId}
              lang={lang}
            />
          </div>
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            {localizedArticle && <ArticleView article={localizedArticle} />}
          </div>
        </div>

        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #e5e7eb' }}>
          <h2 className="section-title">{t('chapters_heading')}</h2>
          <ul className="chapter-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {chapters.map((chapter) => {
              const chapterName = chapter[nameKey] || chapter.nameAr
              return (
                <li
                  key={chapter.id}
                  style={{
                    padding: '12px 16px',
                    [borderInlineStart]: activeChapterId === chapter.id ? '4px solid var(--green)' : '4px solid transparent',
                    backgroundColor: activeChapterId === chapter.id ? '#f0fdf4' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: activeChapterId === chapter.id ? 'var(--green-dark)' : 'var(--text)',
                    fontWeight: activeChapterId === chapter.id ? '600' : '400',
                  }}
                  onClick={() => setActiveChapterId(chapter.id)}
                >
                  {chapterName}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = []
  for (const lang of SUPPORTED_LANGS) {
    for (const book of encyclopediaData.books) {
      paths.push({ params: { lang, slug: BOOK_SLUGS[book.id] || book.id } })
    }
  }
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const { lang, slug } = params
  if (!SUPPORTED_LANGS.includes(lang)) return { notFound: true }

  const bookId = SLUG_TO_BOOK_ID[slug] || slug
  const book = encyclopediaData.books.find((b) => b.id === bookId)
  if (!book) return { notFound: true }

  const chapters = book.chapters.map((chapter) => ({
    id: chapter.id,
    nameAr: chapter.nameAr,
    nameEn: chapter.nameEn || chapter.nameAr,
    nameFr: chapter.nameFr || chapter.nameAr,
    orderIndex: chapter.orderIndex,
    articles: (chapter.articles || []).map((article) => ({
      id: article.id,
      nameAr: article.nameAr,
      nameEn: article.nameEn || article.nameAr,
      nameFr: article.nameFr || article.nameAr,
      content: article.content,
      contentEn: article.contentEn || article.content,
      contentFr: article.contentFr || article.content,
      orderIndex: article.orderIndex,
    })),
  }))

  return {
    props: {
      lang,
      book: {
        id: book.id,
        nameAr: book.nameAr,
        nameEn: book.nameEn || book.nameAr,
        nameFr: book.nameFr || book.nameAr,
        description: book.description,
        descriptionEn: book.descriptionEn || book.description,
        descriptionFr: book.descriptionFr || book.description,
        icon: book.icon,
      },
      chapters,
    },
  }
}

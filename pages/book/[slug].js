import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import Sidebar from '../../components/Sidebar'
import ArticleView from '../../components/ArticleView'
import { encyclopediaData } from '../../data/encyclopedia'
import { BOOK_SLUGS, SLUG_TO_BOOK_ID } from '../../lib/slugs'
import Link from 'next/link'

export default function BookPage({ book, chapters }) {
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

  const activeChapter = chapters.find((ch) => ch.id === activeChapterId)
  const activeArticle = activeChapter?.articles?.[0] || null

  return (
    <Layout title={book.nameAr} activeBook={book.id}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/">الرئيسية</Link>
          <span> › </span>
          <span>{book.nameAr}</span>
        </div>

        {/* Page Header */}
        <div className="page-header" style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{book.icon}</div>
          <h1 style={{ margin: '0 0 8px 0', color: 'var(--green-dark)' }}>{book.nameAr}</h1>
          <p style={{ margin: '0', color: 'var(--muted)', lineHeight: '1.6' }}>
            {book.description}
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="content-layout">
          {/* Left Sidebar */}
          <div style={{ flex: '0 0 280px' }}>
            <Sidebar
              chapters={chapters}
              activeChapterId={activeChapterId}
              onChapterSelect={setActiveChapterId}
            />
          </div>

          {/* Right Content */}
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            {activeArticle && <ArticleView article={activeArticle} />}
          </div>
        </div>

        {/* Chapter List */}
        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #e5e7eb' }}>
          <h2 className="section-title">📖 فهرس الفصول</h2>
          <ul className="chapter-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {chapters.map((chapter) => (
              <li
                key={chapter.id}
                style={{
                  padding: '12px 16px',
                  borderRight: activeChapterId === chapter.id ? '4px solid var(--green)' : '4px solid transparent',
                  backgroundColor: activeChapterId === chapter.id ? '#f0fdf4' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: activeChapterId === chapter.id ? 'var(--green-dark)' : 'var(--text)',
                  fontWeight: activeChapterId === chapter.id ? '600' : '400',
                }}
                onClick={() => setActiveChapterId(chapter.id)}
              >
                {chapter.nameAr}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = encyclopediaData.books.map((book) => ({
    params: { slug: BOOK_SLUGS[book.id] || book.id },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const bookId = SLUG_TO_BOOK_ID[params.slug] || params.slug
  const book = encyclopediaData.books.find((b) => b.id === bookId)

  if (!book) {
    return { notFound: true }
  }

  const chapters = book.chapters.map((chapter) => ({
    id: chapter.id,
    nameAr: chapter.nameAr,
    orderIndex: chapter.orderIndex,
    articles: (chapter.articles || []).map((article) => ({
      id: article.id,
      nameAr: article.nameAr,
      content: article.content,
      orderIndex: article.orderIndex,
    })),
  }))

  return {
    props: {
      book: {
        id: book.id,
        nameAr: book.nameAr,
        description: book.description,
        icon: book.icon,
      },
      chapters,
    },
  }
}

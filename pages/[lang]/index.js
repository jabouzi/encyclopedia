import Layout from '../../components/Layout'
import BookCard from '../../components/BookCard'
import { encyclopediaData } from '../../data/encyclopedia'
import { useTranslation, SUPPORTED_LANGS } from '../../lib/useTranslation'

export default function HomePage({ books, lang }) {
  const { t } = useTranslation(lang)
  return (
    <Layout title={null} lang={lang}>
      <div className="container">
        <div className="hero">
          <h2>{t('hero_basmala')}</h2>
          <p>{t('hero_welcome')}</p>
        </div>
        <h2 className="section-title">{t('sections_title')}</h2>
        <div className="cards-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} lang={lang} />
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

  const books = encyclopediaData.books.map((b) => ({
    id: b.id,
    nameAr: b.nameAr,
    nameEn: b.nameEn || b.nameAr,
    nameFr: b.nameFr || b.nameAr,
    description: b.description,
    descriptionEn: b.descriptionEn || b.description,
    descriptionFr: b.descriptionFr || b.description,
    icon: b.icon,
    chapterCount: b.chapters.length,
    orderIndex: b.orderIndex,
  }))

  return { props: { books, lang } }
}

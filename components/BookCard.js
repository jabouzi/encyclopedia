import Link from 'next/link'
import { BOOK_SLUGS } from '../lib/slugs'
import { useTranslation } from '../lib/useTranslation'

export default function BookCard({ book, lang = 'ar' }) {
  const { t } = useTranslation(lang)
  const slug = BOOK_SLUGS[book.id] || book.id
  const nameKey = `name${lang.charAt(0).toUpperCase() + lang.slice(1)}`
  const descKey = `description${lang.charAt(0).toUpperCase() + lang.slice(1)}`
  const name = book[nameKey] || book.nameAr
  const description = book[descKey] || book.description

  return (
    <Link href={`/${lang}/book/${slug}`} className="card">
      <div className="card-icon">{book.icon}</div>
      <h3 className="card-title">{name}</h3>
      <p className="card-subtitle">{t('chapter_count', { count: book.chapterCount })}</p>
      <p style={{ fontSize: '0.85rem', color: '#999', marginTop: 'auto' }}>
        {description}
      </p>
    </Link>
  )
}

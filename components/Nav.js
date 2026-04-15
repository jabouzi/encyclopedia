import Link from 'next/link'
import { useRouter } from 'next/router'
import { BOOK_SLUGS } from '../lib/slugs'

function SearchForm() {
  const router = useRouter()
  function handleSubmit(e) {
    e.preventDefault()
    const q = e.target.q.value.trim()
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
  }
  return (
    <form onSubmit={handleSubmit} className="nav-search">
      <input name="q" placeholder="بحث..." className="nav-search-input" />
      <button type="submit" className="nav-search-btn">🔍</button>
    </form>
  )
}

const navigationBooks = [
  { id: 'book-1', label: 'أخلاق المسلم' },
  { id: 'book-2', label: 'الآداب الإسلامية' },
  { id: 'book-3', label: 'الأسرة السعيدة' },
  { id: 'book-4', label: 'قصص الأنبياء' },
  { id: 'book-5', label: 'البيت المسلم' },
  { id: 'book-6', label: 'التاريخ الإسلامي' },
  { id: 'book-7', label: 'الحضارة الإسلامية' },
  { id: 'book-8', label: 'السيرة النبوية' },
  { id: 'book-9', label: 'الصحابة الكرام' },
  { id: 'book-10', label: 'العبادات' },
  { id: 'book-11', label: 'العقيدة' },
  { id: 'book-12', label: 'الولد الصالح' },
  { id: 'book-13', label: 'قضايا إسلامية' },
  { id: 'book-14', label: 'مسلمات' },
  { id: 'book-15', label: 'أعلام المسلمين' },
  { id: 'book-16', label: 'معاملات إسلامية' },
]

export default function Nav({ activeBook = null }) {
  return (
    <nav className="nav">
      <Link href="/" className={`nav-link ${activeBook === null ? 'active' : ''}`}>
        الرئيسية
      </Link>
      {navigationBooks.map((book) => {
        const slug = BOOK_SLUGS[book.id] || book.id
        return (
          <Link key={book.id} href={`/book/${slug}`} className={`nav-link ${activeBook === book.id ? 'active' : ''}`}>
            {book.label}
          </Link>
        )
      })}
      <SearchForm />
    </nav>
  )
}

import Link from 'next/link'

const navigationBooks = [
  { id: 'book-1', label: 'أخلاق المسلم' },
  { id: 'book-4', label: 'قصص الأنبياء' },
  { id: 'book-6', label: 'التاريخ الإسلامي' },
  { id: 'book-8', label: 'السيرة النبوية' },
  { id: 'book-10', label: 'العبادات' },
  { id: 'book-11', label: 'العقيدة' },
]

export default function Nav({ activeBook = null }) {
  return (
    <nav className="nav">
      <Link href="/" className={`nav-link ${activeBook === null ? 'active' : ''}`}>
        الرئيسية
      </Link>
      {navigationBooks.map((book) => (
        <Link key={book.id} href={`/book/${book.id}`} className={`nav-link ${activeBook === book.id ? 'active' : ''}`}>
          {book.label}
        </Link>
      ))}
    </nav>
  )
}

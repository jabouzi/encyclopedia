import Link from 'next/link'

export default function BookCard({ book }) {
  return (
    <Link href={`/book/${book.id}`} className="card">
      <div className="card-icon">{book.icon}</div>
      <h3 className="card-title">{book.nameAr}</h3>
      <p className="card-subtitle">{book.chapterCount} فصل</p>
      <p style={{ fontSize: '0.85rem', color: '#999', marginTop: 'auto' }}>
        {book.description}
      </p>
    </Link>
  )
}

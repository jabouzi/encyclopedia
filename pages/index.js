import Layout from '../components/Layout'
import BookCard from '../components/BookCard'
import { encyclopediaData } from '../data/encyclopedia'

export default function HomePage({ books }) {
  return (
    <Layout title="الرئيسية">
      <div className="container">
        <div className="hero">
          <h2>بسم الله الرحمن الرحيم</h2>
          <p>
            مرحباً بكم في موسوعة الأسرة المسلمة، مرجع إسلامي متكامل يضمّ ستة عشر بابًا
            يشمل العقيدة والأخلاق والتاريخ والسيرة النبوية وقصص الأنبياء والعبادات وغيرها.
          </p>
        </div>

        <h2 className="section-title">📚 أقسام الموسوعة</h2>
        <div className="cards-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const books = encyclopediaData.books.map((b) => ({
    id: b.id,
    nameAr: b.nameAr,
    description: b.description,
    icon: b.icon,
    chapterCount: b.chapters.length,
    orderIndex: b.orderIndex,
  }))

  return { props: { books } }
}

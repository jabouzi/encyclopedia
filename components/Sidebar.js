export default function Sidebar({ chapters = [], activeChapterId = null, onChapterSelect = () => {} }) {
  return (
    <aside className="sidebar">
      <h3 style={{ marginBottom: '1rem', color: '#1b6b3a', fontSize: '1.1rem' }}>
        الفصول
      </h3>
      <nav>
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onChapterSelect(chapter.id)}
            className={`sidebar-link ${activeChapterId === chapter.id ? 'active' : ''}`}
            style={{ width: '100%', textAlign: 'right', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            {chapter.nameAr}
          </button>
        ))}
      </nav>
    </aside>
  )
}

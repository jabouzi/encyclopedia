import { useTranslation } from '../lib/useTranslation'

export default function Sidebar({ chapters = [], activeChapterId = null, onChapterSelect = () => {}, lang = 'ar' }) {
  const { t } = useTranslation(lang)
  return (
    <aside className="sidebar">
      <h3 style={{ marginBottom: '1rem', color: '#1b6b3a', fontSize: '1.1rem' }}>
        {t('chapters_sidebar')}
      </h3>
      <nav>
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onChapterSelect(chapter.id)}
            className={`sidebar-link ${activeChapterId === chapter.id ? 'active' : ''}`}
            style={{ width: '100%', textAlign: lang === 'ar' ? 'right' : 'left', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            {chapter[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || chapter.nameAr}
          </button>
        ))}
      </nav>
    </aside>
  )
}

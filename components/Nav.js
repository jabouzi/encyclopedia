import Link from 'next/link'
import { useRouter } from 'next/router'
import { BOOK_SLUGS } from '../lib/slugs'
import { useTranslation, SUPPORTED_LANGS } from '../lib/useTranslation'
import { encyclopediaData } from '../data/encyclopedia'

const LANG_LABELS = { ar: 'ع', en: 'EN', fr: 'FR' }

function SearchForm({ lang }) {
  const { t } = useTranslation(lang)
  const router = useRouter()
  function handleSubmit(e) {
    e.preventDefault()
    const q = e.target.q.value.trim()
    if (q) router.push(`/${lang}/search?q=${encodeURIComponent(q)}`)
  }
  return (
    <form onSubmit={handleSubmit} className="nav-search">
      <input name="q" placeholder={t('search_placeholder')} className="nav-search-input" />
      <button type="submit" className="nav-search-btn">🔍</button>
    </form>
  )
}

function LangSwitcher({ lang, activeBook }) {
  const router = useRouter()

  function handleSwitch(targetLang) {
    if (typeof localStorage !== 'undefined') localStorage.setItem('lang', targetLang)
  }

  function getHref(targetLang) {
    // If on a book page, switch to the same book in the target language
    if (activeBook) {
      const slug = BOOK_SLUGS[activeBook] || activeBook
      return `/${targetLang}/book/${slug}`
    }
    // Check if on search page
    if (router.pathname.includes('/search')) {
      const q = router.query.q || ''
      return q ? `/${targetLang}/search?q=${encodeURIComponent(q)}` : `/${targetLang}/search`
    }
    return `/${targetLang}`
  }

  return (
    <div className="lang-switcher">
      {SUPPORTED_LANGS.map((l) => (
        <Link
          key={l}
          href={getHref(l)}
          onClick={() => handleSwitch(l)}
          className={`lang-btn ${l === lang ? 'active' : ''}`}
        >
          {LANG_LABELS[l]}
        </Link>
      ))}
    </div>
  )
}

export default function Nav({ activeBook = null, lang = 'ar' }) {
  const { t } = useTranslation(lang)
  const nameKey = `name${lang.charAt(0).toUpperCase() + lang.slice(1)}`

  return (
    <nav className="nav">
      <Link href={`/${lang}`} className={`nav-link ${activeBook === null ? 'active' : ''}`}>
        {t('home')}
      </Link>
      {encyclopediaData.books.map((book) => {
        const slug = BOOK_SLUGS[book.id] || book.id
        return (
          <Link
            key={book.id}
            href={`/${lang}/book/${slug}`}
            className={`nav-link ${activeBook === book.id ? 'active' : ''}`}
          >
            {book[nameKey] || book.nameAr}
          </Link>
        )
      })}
      <SearchForm lang={lang} />
      <LangSwitcher lang={lang} activeBook={activeBook} />
    </nav>
  )
}

import { useTranslation } from '../lib/useTranslation'

export default function Header({ lang = 'ar' }) {
  const { t } = useTranslation(lang)
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-circle">☪</div>
        <h1>{t('site_title')}</h1>
        <p>{t('site_subtitle')}</p>
      </div>
    </header>
  )
}

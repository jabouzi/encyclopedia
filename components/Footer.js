import { useTranslation } from '../lib/useTranslation'

export default function Footer({ lang = 'ar' }) {
  const { t } = useTranslation(lang)
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <p>
        <strong>{t('site_title')}</strong>
      </p>
      <p>{t('footer_source')}</p>
      <div className="footer-copyright">
        <p>&copy; {currentYear} {t('footer_rights')}</p>
      </div>
    </footer>
  )
}

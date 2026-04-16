import Head from 'next/head'
import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'
import { useTranslation } from '../lib/useTranslation'

export default function Layout({ children, title, activeBook = null, lang = 'ar' }) {
  const { t } = useTranslation(lang)
  const pageTitle = title ? `${title} — ${t('site_title')}` : t('site_title')
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={t('site_description')} />
        <html lang={lang} dir={dir} />
      </Head>
      <div dir={dir} lang={lang}>
        <Header lang={lang} />
        <Nav activeBook={activeBook} lang={lang} />
        <main className="main-content">{children}</main>
        <Footer lang={lang} />
      </div>
    </>
  )
}

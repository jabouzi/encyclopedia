import Head from 'next/head'
import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'

export default function Layout({ children, title = 'موسوعة الأسرة المسلمة', activeBook = null }) {
  return (
    <>
      <Head>
        <title>{`${title} — موسوعة الأسرة المسلمة`}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="موسوعة الأسرة المسلمة — مرجع إسلامي شامل" />
      </Head>
      <Header />
      <Nav activeBook={activeBook} />
      <main className="main-content">{children}</main>
      <Footer />
    </>
  )
}

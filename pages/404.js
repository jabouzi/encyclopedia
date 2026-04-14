import Layout from '../components/Layout'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Layout title="الصفحة غير موجودة">
      <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
        <h2 style={{ color: 'var(--green-dark)', fontSize: '1.8rem', marginBottom: '12px' }}>
          الصفحة غير موجودة
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
          عذراً، الصفحة التي تبحث عنها غير موجودة.
        </p>
        <Link href="/" style={{
          background: 'var(--green)',
          color: '#fff',
          padding: '12px 28px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          display: 'inline-block',
        }}>
          العودة إلى الرئيسية
        </Link>
      </div>
    </Layout>
  )
}

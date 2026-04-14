import '../styles/globals.css'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Seed the database on first client-side load
    async function initDB() {
      try {
        const { getDatabase } = await import('../db/index')
        const { seedIfEmpty } = await import('../lib/seed')
        const db = getDatabase()
        if (db) await seedIfEmpty(db)
      } catch (err) {
        console.error('DB init error:', err)
      }
    }
    initDB()
  }, [])

  return <Component {...pageProps} />
}

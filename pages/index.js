import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Root() {
  const router = useRouter()
  useEffect(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null
    router.replace(`/${saved || 'ar'}`)
  }, [])
  return null
}

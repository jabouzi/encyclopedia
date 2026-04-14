import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import schema from './schema'
import Book from './models/Book'
import Chapter from './models/Chapter'
import Article from './models/Article'

let _database = null

export function getDatabase() {
  if (typeof window === 'undefined') return null
  if (_database) return _database

  const adapter = new LokiJSAdapter({
    schema,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
    dbName: 'EncyclopediaDB',
    onQuotaExceededError: (error) => console.error('Quota exceeded:', error),
    onSetUpError: (error) => console.error('DB setup error:', error),
  })

  _database = new Database({
    adapter,
    modelClasses: [Book, Chapter, Article],
  })

  return _database
}

export default getDatabase

import { Q } from '@nozbe/watermelondb'

export async function getAllBooks(database) {
  return database.collections
    .get('books')
    .query(Q.sortBy('order_index', Q.asc))
    .fetch()
}

export async function getBook(database, bookId) {
  return database.collections.get('books').find(bookId)
}

export async function getChaptersByBook(database, bookId) {
  return database.collections
    .get('chapters')
    .query(Q.where('book_id', bookId), Q.sortBy('order_index', Q.asc))
    .fetch()
}

export async function getArticlesByChapter(database, chapterId) {
  return database.collections
    .get('articles')
    .query(Q.where('chapter_id', chapterId), Q.sortBy('order_index', Q.asc))
    .fetch()
}

export async function getArticlesByBook(database, bookId) {
  return database.collections
    .get('articles')
    .query(Q.where('book_id', bookId), Q.sortBy('order_index', Q.asc))
    .fetch()
}

export async function getBooksCount(database) {
  return database.collections.get('books').query().fetchCount()
}

import { encyclopediaData } from '../data/encyclopedia'

export async function seedIfEmpty(database) {
  if (!database) return

  const count = await database.collections.get('books').query().fetchCount()
  if (count > 0) return // already seeded

  await database.write(async () => {
    for (const bookData of encyclopediaData.books) {
      const book = await database.collections.get('books').create((b) => {
        b._raw.id = bookData.id
        b.nameAr = bookData.nameAr
        b.description = bookData.description
        b.icon = bookData.icon
        b.chapterCount = bookData.chapters.length
        b.orderIndex = bookData.orderIndex
      })

      for (const chapterData of bookData.chapters) {
        const chapter = await database.collections.get('chapters').create((c) => {
          c._raw.id = chapterData.id
          c.bookId = book.id
          c.nameAr = chapterData.nameAr
          c.orderIndex = chapterData.orderIndex
        })

        if (chapterData.articles) {
          for (const articleData of chapterData.articles) {
            await database.collections.get('articles').create((a) => {
              a._raw.id = articleData.id
              a.chapterId = chapter.id
              a.bookId = book.id
              a.nameAr = articleData.nameAr
              a.content = articleData.content
              a.orderIndex = articleData.orderIndex
            })
          }
        }
      }
    }
  })
}

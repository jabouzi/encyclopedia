import { Model } from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'

export default class Article extends Model {
  static table = 'articles'
  static associations = {
    chapters: { type: 'belongs_to', key: 'chapter_id' },
    books: { type: 'belongs_to', key: 'book_id' },
  }

  @field('chapter_id') chapterId
  @field('book_id') bookId
  @field('name_ar') nameAr
  @field('content') content
  @field('order_index') orderIndex

  @relation('chapters', 'chapter_id') chapter
  @relation('books', 'book_id') book
}

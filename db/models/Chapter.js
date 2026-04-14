import { Model } from '@nozbe/watermelondb'
import { field, relation, children } from '@nozbe/watermelondb/decorators'

export default class Chapter extends Model {
  static table = 'chapters'
  static associations = {
    books: { type: 'belongs_to', key: 'book_id' },
    articles: { type: 'has_many', foreignKey: 'chapter_id' },
  }

  @field('book_id') bookId
  @field('name_ar') nameAr
  @field('order_index') orderIndex

  @relation('books', 'book_id') book
  @children('articles') articles
}

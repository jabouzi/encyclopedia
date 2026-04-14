import { Model } from '@nozbe/watermelondb'
import { field, children, lazy } from '@nozbe/watermelondb/decorators'

export default class Book extends Model {
  static table = 'books'
  static associations = {
    chapters: { type: 'has_many', foreignKey: 'book_id' },
    articles: { type: 'has_many', foreignKey: 'book_id' },
  }

  @field('name_ar') nameAr
  @field('description') description
  @field('icon') icon
  @field('chapter_count') chapterCount
  @field('order_index') orderIndex

  @children('chapters') chapters
}

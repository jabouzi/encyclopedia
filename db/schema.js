import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'books',
      columns: [
        { name: 'name_ar', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'icon', type: 'string' },
        { name: 'chapter_count', type: 'number' },
        { name: 'order_index', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'chapters',
      columns: [
        { name: 'book_id', type: 'string', isIndexed: true },
        { name: 'name_ar', type: 'string' },
        { name: 'order_index', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'articles',
      columns: [
        { name: 'chapter_id', type: 'string', isIndexed: true },
        { name: 'book_id', type: 'string', isIndexed: true },
        { name: 'name_ar', type: 'string' },
        { name: 'content', type: 'string' },
        { name: 'order_index', type: 'number' },
      ],
    }),
  ],
})

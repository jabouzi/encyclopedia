export const BOOK_SLUGS = {
  'book-1':  'akhlaq-al-muslim',
  'book-2':  'al-adab-al-islami',
  'book-3':  'al-usra-al-saida',
  'book-4':  'qasas-al-anbiya',
  'book-5':  'al-bayt-al-muslim',
  'book-6':  'al-tarikh-al-islami',
  'book-7':  'al-hadara-al-islamiya',
  'book-8':  'al-sira-al-nabawiya',
  'book-9':  'al-sahaba-al-kiram',
  'book-10': 'al-ibadat',
  'book-11': 'al-aqida',
  'book-12': 'al-walad-al-salih',
  'book-13': 'qadaya-islamiya',
  'book-14': 'muslimat',
  'book-15': 'alam-al-muslimin',
  'book-16': 'muamalat-islamiya',
}

// Reverse map: slug → book id
export const SLUG_TO_BOOK_ID = Object.fromEntries(
  Object.entries(BOOK_SLUGS).map(([id, slug]) => [slug, id])
)

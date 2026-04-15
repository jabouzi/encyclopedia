/**
 * Import scraped JSON into data/encyclopedia.js
 *
 * Usage:
 *   node scripts/import.js              # import all books in scripts/scraped/
 *   node scripts/import.js --book 4    # import only book 4
 *
 * The script merges scraped content into the existing encyclopedia.js data,
 * preserving any manual edits already in the file.
 */

const fs = require('fs')
const path = require('path')

const SCRAPED_DIR = path.join(__dirname, 'scraped')
const DATA_FILE   = path.join(__dirname, '..', 'data', 'encyclopedia.js')

function parseArgs() {
  const args = process.argv.slice(2)
  const idx = args.indexOf('--book')
  return { book: idx !== -1 ? parseInt(args[idx + 1]) : null }
}

function loadExistingData() {
  // Dynamically require the existing data file
  const mod = require(DATA_FILE)
  return mod.encyclopediaData || mod.default?.encyclopediaData
}

function slugify(n, ch) {
  return `book-${n}-ch-${ch}`
}

function buildChapters(scraped, existingBook) {
  const existing = {}
  ;(existingBook?.chapters || []).forEach((ch) => {
    existing[ch.id] = ch
  })

  return scraped.chapters.map((ch) => {
    const id = slugify(scraped.bookN, ch.chapterN)
    const existingCh = existing[id] || {}

    // Prefer scraped title over placeholder, unless manual edit exists
    const nameAr = ch.title && ch.title !== scraped.nameAr
      ? ch.title
      : existingCh.nameAr || ch.title || `فصل ${ch.chapterN}`

    const articleId = `${id}-art-1`
    const existingArticle = existingCh.articles?.[0] || {}

    return {
      id,
      nameAr,
      orderIndex: ch.chapterN,
      url: ch.url,
      articles: [
        {
          id: articleId,
          nameAr,
          // Keep manual content if it's longer than scraped (manual edits win)
          content: existingArticle.content && existingArticle.content.length > ch.content.length
            ? existingArticle.content
            : ch.content || existingArticle.content || '',
          orderIndex: 1,
        },
      ],
    }
  })
}

function mergeBook(existing, scraped) {
  const idx = existing.findIndex((b) => b.id === `book-${scraped.bookN}`)
  const existingBook = idx !== -1 ? existing[idx] : null

  const merged = {
    id: `book-${scraped.bookN}`,
    nameAr: existingBook?.nameAr || scraped.nameAr,
    description: existingBook?.description || '',
    icon: existingBook?.icon || '📖',
    orderIndex: scraped.bookN,
    chapters: buildChapters(scraped, existingBook),
  }

  if (idx !== -1) {
    existing[idx] = merged
  } else {
    existing.push(merged)
    existing.sort((a, b) => a.orderIndex - b.orderIndex)
  }

  return existing
}

function serialize(data) {
  // Pretty-print as a JS module
  const json = JSON.stringify(data, null, 2)
  return `export const encyclopediaData = ${json}\n`
}

function main() {
  const { book } = parseArgs()

  if (!fs.existsSync(SCRAPED_DIR)) {
    console.error('No scraped/ directory found. Run: node scripts/scrape.js first.')
    process.exit(1)
  }

  const files = fs.readdirSync(SCRAPED_DIR)
    .filter((f) => f.endsWith('.json'))
    .filter((f) => !book || f === `book-${book}.json`)

  if (files.length === 0) {
    console.error(`No JSON files found${book ? ` for book ${book}` : ''}.`)
    process.exit(1)
  }

  // Clear require cache so we always load the current file
  delete require.cache[DATA_FILE]
  const existingData = loadExistingData()
  let books = [...(existingData?.books || [])]

  for (const file of files) {
    const scraped = JSON.parse(fs.readFileSync(path.join(SCRAPED_DIR, file), 'utf8'))
    console.log(`Merging book-${scraped.bookN} (${scraped.chapters.length} chapters)...`)
    books = mergeBook(books, scraped)
  }

  fs.writeFileSync(DATA_FILE, serialize({ books }), 'utf8')
  console.log(`\n✅ Updated data/encyclopedia.js (${books.length} books total)`)
  console.log('   Restart `npm run dev` to see the changes.')
}

main()

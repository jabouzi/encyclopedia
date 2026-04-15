/**
 * Wayback Machine scraper for islam.aljayyash.net/encyclopedia
 *
 * Usage:
 *   node scripts/scrape.js                 # scrape all 16 books
 *   node scripts/scrape.js --book 4        # scrape only book 4
 *   node scripts/scrape.js --book 4 --dry  # print URLs only, no fetching
 *
 * Output: scripts/scraped/book-{N}.json
 *
 * NOTE: Review scraped content for copyright before publishing.
 * Quran verses and hadith are public domain. Editorial text may not be.
 */

const fetch = require('node-fetch')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

// ── Config ───────────────────────────────────────────────────────────────────

const BASE = 'https://web.archive.org/web/20100830082411/http://islam.aljayyash.net/encyclopedia'
const DELAY_MS = 1500   // polite delay between requests
const MAX_CHAPTERS = 40 // max chapters to probe per book (stops at first 404)

const BOOK_NAMES = {
  1:  'أخلاق المسلم',
  2:  'الآداب الإسلامية',
  3:  'الأسرة السعيدة',
  4:  'قصص الأنبياء',
  5:  'البيت المسلم',
  6:  'التاريخ الإسلامي',
  7:  'الحضارة الإسلامية',
  8:  'السيرة النبوية',
  9:  'الصحابة الكرام',
  10: 'العبادات',
  11: 'العقيدة',
  12: 'الولد الصالح',
  13: 'قضايا إسلامية',
  14: 'مسلمات',
  15: 'أعلام المسلمين',
  16: 'معاملات إسلامية',
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function parseArgs() {
  const args = process.argv.slice(2)
  const bookIdx = args.indexOf('--book')
  const book = bookIdx !== -1 ? parseInt(args[bookIdx + 1]) : null
  const dry = args.includes('--dry')
  return { book, dry }
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (archival research)' },
      timeout: 20000,
    })
    if (!res.ok) return null
    const buffer = await res.buffer()
    // The archived pages are windows-1256 encoded
    const text = buffer.toString('latin1')
    return text
  } catch {
    return null
  }
}

function decodeWindows1256(raw) {
  // Node's latin1 gives us byte values; remap Arabic windows-1256 range
  const map = {
    0x80: '\u060c', 0x81: '\u200e', 0x82: '\u201a', 0x83: '\u0192',
    0x84: '\u201e', 0x85: '\u2026', 0x86: '\u2020', 0x87: '\u2021',
    0x88: '\u02c6', 0x89: '\u2030', 0x8a: '\u0679', 0x8b: '\u2039',
    0x8c: '\u0152', 0x8d: '\u0686', 0x8e: '\u0698', 0x8f: '\u0688',
    0x90: '\u06af', 0x91: '\u2018', 0x92: '\u2019', 0x93: '\u201c',
    0x94: '\u201d', 0x95: '\u2022', 0x96: '\u2013', 0x97: '\u2014',
    0x98: '\u0698', 0x99: '\u2122', 0x9a: '\u0691', 0x9b: '\u203a',
    0x9c: '\u0153', 0x9d: '\u200c', 0x9e: '\u200f', 0x9f: '\u06ba',
    0xa0: '\u00a0', 0xa1: '\u060c', 0xa2: '\u00a2', 0xa3: '\u00a3',
    0xa4: '\u00a4', 0xa5: '\u00a5', 0xa6: '\u00a6', 0xa7: '\u00a7',
    0xa8: '\u00a8', 0xa9: '\u00a9', 0xaa: '\u06be', 0xab: '\u00ab',
    0xac: '\u00ac', 0xad: '\u00ad', 0xae: '\u00ae', 0xaf: '\u00af',
    0xb0: '\u00b0', 0xb1: '\u00b1', 0xb2: '\u00b2', 0xb3: '\u00b3',
    0xb4: '\u00b4', 0xb5: '\u00b5', 0xb6: '\u00b6', 0xb7: '\u00b7',
    0xb8: '\u00b8', 0xb9: '\u00b9', 0xba: '\u061b', 0xbb: '\u00bb',
    0xbc: '\u00bc', 0xbd: '\u00bd', 0xbe: '\u00be', 0xbf: '\u061f',
    0xc0: '\u06c1', 0xc1: '\u0621', 0xc2: '\u0622', 0xc3: '\u0623',
    0xc4: '\u0624', 0xc5: '\u0625', 0xc6: '\u0626', 0xc7: '\u0627',
    0xc8: '\u0628', 0xc9: '\u0629', 0xca: '\u062a', 0xcb: '\u062b',
    0xcc: '\u062c', 0xcd: '\u062d', 0xce: '\u062e', 0xcf: '\u062f',
    0xd0: '\u0630', 0xd1: '\u0631', 0xd2: '\u0632', 0xd3: '\u0633',
    0xd4: '\u0634', 0xd5: '\u0635', 0xd6: '\u0636', 0xd7: '\u00d7',
    0xd8: '\u0637', 0xd9: '\u0638', 0xda: '\u0639', 0xdb: '\u063a',
    0xdc: '\u0640', 0xdd: '\u0641', 0xde: '\u0642', 0xdf: '\u0643',
    0xe0: '\u00e0', 0xe1: '\u0644', 0xe2: '\u00e2', 0xe3: '\u0645',
    0xe4: '\u0646', 0xe5: '\u0647', 0xe6: '\u0648', 0xe7: '\u00e7',
    0xe8: '\u00e8', 0xe9: '\u00e9', 0xea: '\u00ea', 0xeb: '\u00eb',
    0xec: '\u0649', 0xed: '\u064a', 0xee: '\u00ee', 0xef: '\u00ef',
    0xf0: '\u00f0', 0xf1: '\u064b', 0xf2: '\u00f2', 0xf3: '\u064c',
    0xf4: '\u064d', 0xf5: '\u064e', 0xf6: '\u00f6', 0xf7: '\u00f7',
    0xf8: '\u064f', 0xf9: '\u0650', 0xfa: '\u00fa', 0xfb: '\u0651',
    0xfc: '\u0652', 0xfd: '\u00fd', 0xfe: '\u00fe', 0xff: '\u06d2',
  }
  return raw.split('').map((ch) => {
    const code = ch.charCodeAt(0)
    return code > 0x7f ? (map[code] || ch) : ch
  }).join('')
}

function extractContent(html) {
  const decoded = decodeWindows1256(html)
  const $ = cheerio.load(decoded)

  // Remove Wayback Machine toolbar and scripts
  $('#wm-ipp-base, script, style, noscript').remove()

  // The main content is usually in a <td> with actual Arabic text
  // Try to find the largest text block that isn't navigation
  let title = ''
  let content = ''

  // Extract page title (strip site suffix)
  const rawTitle = $('title').text().trim()
  title = rawTitle.split('-')[0].trim()

  // Find all table cells and pick the ones with substantial Arabic text
  const blocks = []
  $('td, div, p').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim()
    // Must be >100 chars and contain Arabic characters
    if (text.length > 100 && /[\u0600-\u06ff]/.test(text)) {
      blocks.push(text)
    }
  })

  // De-duplicate (longer blocks often contain shorter ones)
  const unique = blocks.filter((b, i) =>
    !blocks.some((other, j) => j !== i && other.includes(b) && other.length > b.length)
  )

  // Exclude nav repetition (lines that appear in every page)
  const NAV_PATTERN = /أخلاق المسلم.+الآداب الاسلامية/
  content = unique
    .filter((b) => !NAV_PATTERN.test(b))
    .join('\n\n')

  return { title, content }
}

// ── Core scrape logic ─────────────────────────────────────────────────────────

async function scrapeChapter(bookN, chapterN, dry) {
  const url = `${BASE}/book-${bookN}-${chapterN}`
  if (dry) {
    console.log(`  [dry] ${url}`)
    return { chapterN, url, title: '', content: '' }
  }

  process.stdout.write(`  Fetching book-${bookN}-${chapterN} ... `)
  const html = await fetchPage(url)

  if (!html) {
    console.log('not found')
    return null
  }

  const { title, content } = extractContent(html)
  console.log(`ok (${content.length} chars)`)
  return { chapterN, url, title, content }
}

async function scrapeBook(bookN, dry) {
  const bookName = BOOK_NAMES[bookN] || `Book ${bookN}`
  console.log(`\n📖 Book ${bookN}: ${bookName}`)

  const chapters = []
  let consecutiveFails = 0

  for (let ch = 1; ch <= MAX_CHAPTERS; ch++) {
    const result = await scrapeChapter(bookN, ch, dry)

    if (!result) {
      consecutiveFails++
      if (consecutiveFails >= 2) break // stop after 2 consecutive misses
      continue
    }

    consecutiveFails = 0
    chapters.push(result)

    if (!dry) await sleep(DELAY_MS)
  }

  const bookData = {
    bookN,
    nameAr: bookName,
    scrapedAt: new Date().toISOString(),
    chapters,
  }

  if (!dry) {
    const outDir = path.join(__dirname, 'scraped')
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)
    const outFile = path.join(outDir, `book-${bookN}.json`)
    fs.writeFileSync(outFile, JSON.stringify(bookData, null, 2), 'utf8')
    console.log(`  ✓ Saved to scripts/scraped/book-${bookN}.json (${chapters.length} chapters)`)
  }

  return bookData
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const { book, dry } = parseArgs()

  console.log('🕌 Encyclopedia scraper')
  console.log(`   Source: ${BASE}`)
  if (dry) console.log('   [DRY RUN — no requests will be made]')
  console.log()

  const booksToScrape = book
    ? [book]
    : Array.from({ length: 16 }, (_, i) => i + 1)

  for (const n of booksToScrape) {
    await scrapeBook(n, dry)
  }

  console.log('\n✅ Done.')
  if (!dry) {
    console.log('   Review scripts/scraped/book-N.json files, then run:')
    console.log('   node scripts/import.js')
  }
}

main().catch(console.error)

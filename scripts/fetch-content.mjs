/**
 * One-time migration script: re-fetches article content from the Wayback Machine
 * and restores paragraph breaks (<br> → \n) that were lost during the original scrape.
 *
 * Usage: node scripts/fetch-content.mjs
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, '../data/encyclopedia.js')
const ARCHIVE_BASE = 'https://web.archive.org/web/20100821202345/http://islam.aljayyash.net/encyclopedia'
const DELAY_MS = 600

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function fetchPage(bookNum, chapterNum) {
  const url = `${ARCHIVE_BASE}/book-${bookNum}-${chapterNum}`
  try {
    const html = execSync(
      `curl -s --max-time 20 "${url}" | iconv -f windows-1256 -t utf-8 2>/dev/null`,
      { maxBuffer: 10 * 1024 * 1024 }
    ).toString('utf8')
    return html
  } catch {
    return null
  }
}

function extractContent(html) {
  if (!html) return null

  // Extract inner content of <span class="text">
  const spanMatch = html.match(/<span class="text">([\s\S]*?)<\/span>/i)
  if (!spanMatch) return null

  let raw = spanMatch[1]

  // Strip the ac4p.com footer div
  raw = raw.replace(/<div[\s\S]*?<\/div>/gi, '')

  // Convert <br> variants to newline
  raw = raw.replace(/<br\s*\/?>/gi, '\n')

  // Strip remaining HTML tags
  raw = raw.replace(/<[^>]+>/g, '')

  // Decode common HTML entities
  raw = raw
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")

  // Collapse multiple blank lines into one
  raw = raw.replace(/\n{3,}/g, '\n\n')

  // Trim leading/trailing whitespace per line, remove empty-only lines at edges
  raw = raw
    .split('\n')
    .map((l) => l.trim())
    .join('\n')
    .trim()

  return raw || null
}

async function main() {
  // Read and parse encyclopedia.js
  const fileText = readFileSync(DATA_FILE, 'utf8')
  const jsonText = fileText.replace(/^export const encyclopediaData\s*=\s*/, '').replace(/\s*$/, '')
  const data = JSON.parse(jsonText)

  let updated = 0
  let failed = 0

  for (let bi = 0; bi < data.books.length; bi++) {
    const book = data.books[bi]
    const bookNum = bi + 1

    for (let ci = 0; ci < book.chapters.length; ci++) {
      const chapter = book.chapters[ci]
      const chapterNum = ci + 1
      const label = `book-${bookNum}-${chapterNum} (${chapter.nameAr})`

      process.stdout.write(`Fetching ${label}... `)

      const html = fetchPage(bookNum, chapterNum)
      const content = extractContent(html)

      if (!content) {
        console.log('FAILED')
        failed++
      } else {
        // Update the primary article's content
        if (chapter.articles && chapter.articles.length > 0) {
          chapter.articles[0].content = content
          updated++
          console.log(`OK (${content.split('\n').length} lines)`)
        }
      }

      await sleep(DELAY_MS)
    }
  }

  // Write back
  const output = `export const encyclopediaData = ${JSON.stringify(data, null, 2)}\n`
  writeFileSync(DATA_FILE, output, 'utf8')

  console.log(`\nDone. Updated: ${updated}, Failed: ${failed}`)
  if (failed > 0) {
    console.log('Re-run the script for failed entries, or check the URLs manually.')
  }
}

main().catch(console.error)

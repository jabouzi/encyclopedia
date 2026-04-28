// Split a paragraph string into alternating text/quran/hadith segments
function parseInlineSegments(text) {
  const segments = []
  // Combined regex: matches {quran} or «hadith»
  const pattern = /\{([^}]+)\}|«([^»]+)»/g
  let last = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ type: 'text', content: text.slice(last, match.index) })
    }
    if (match[1] !== undefined) {
      segments.push({ type: 'quran', content: match[1] })
    } else {
      segments.push({ type: 'hadith', content: match[2] })
    }
    last = pattern.lastIndex
  }

  if (last < text.length) {
    segments.push({ type: 'text', content: text.slice(last) })
  }

  return segments
}

function renderSegments(segments) {
  return segments.map((seg, i) => {
    if (seg.type === 'quran') {
      return <span key={i} className="quran-inline">{seg.content}</span>
    }
    if (seg.type === 'hadith') {
      return <span key={i} className="hadith-inline">{seg.content}</span>
    }
    return <span key={i}>{seg.content}</span>
  })
}

export default function ArticleView({ article = {} }) {
  const { nameAr = '', content = '' } = article

  const parseContent = (text) => {
    if (!text) return []

    const lines = text.split('\n')
    const sections = []
    let currentParagraph = null

    lines.forEach((line) => {
      const trimmed = line.trim()

      if (!trimmed) {
        if (currentParagraph) {
          sections.push(currentParagraph)
          currentParagraph = null
        }
        return
      }

      if (!currentParagraph) {
        currentParagraph = { type: 'paragraph', content: trimmed }
      } else {
        currentParagraph.content += ' ' + trimmed
      }
    })

    if (currentParagraph) sections.push(currentParagraph)
    return sections
  }

  const sections = parseContent(content)

  return (
    <article className="article">
      <h1>{nameAr}</h1>
      {sections.map((section, index) => (
        <p key={index}>
          {renderSegments(parseInlineSegments(section.content))}
        </p>
      ))}
    </article>
  )
}

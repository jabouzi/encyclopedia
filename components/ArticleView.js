export default function ArticleView({ article = {} }) {
  const { nameAr = '', content = '' } = article

  // Parse content into sections with proper styling
  const parseContent = (text) => {
    if (!text) return []

    const lines = text.split('\n')
    const sections = []
    let currentSection = null

    lines.forEach((line, index) => {
      const trimmed = line.trim()

      if (!trimmed) {
        // Empty line
        if (currentSection && currentSection.type === 'paragraph') {
          sections.push(currentSection)
          currentSection = null
        }
        return
      }

      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        // Quran verse
        if (currentSection && currentSection.type === 'paragraph') {
          sections.push(currentSection)
          currentSection = null
        }
        const verseText = trimmed.slice(1, -1)
        sections.push({
          type: 'quran',
          content: verseText,
        })
      } else if (trimmed.startsWith('«') && trimmed.endsWith('»')) {
        // Hadith
        if (currentSection && currentSection.type === 'paragraph') {
          sections.push(currentSection)
          currentSection = null
        }
        const hadithText = trimmed.slice(1, -1)
        sections.push({
          type: 'hadith',
          content: hadithText,
        })
      } else {
        // Regular paragraph
        if (!currentSection || currentSection.type !== 'paragraph') {
          if (currentSection) {
            sections.push(currentSection)
          }
          currentSection = {
            type: 'paragraph',
            content: trimmed,
          }
        } else {
          currentSection.content += ' ' + trimmed
        }
      }
    })

    // Push remaining section
    if (currentSection) {
      sections.push(currentSection)
    }

    return sections
  }

  const sections = parseContent(content)

  return (
    <article className="article">
      <h1>{nameAr}</h1>
      {sections.map((section, index) => {
        if (section.type === 'quran') {
          return (
            <div key={index} className="quran-verse">
              {section.content}
            </div>
          )
        } else if (section.type === 'hadith') {
          return (
            <div key={index} className="hadith">
              {section.content}
            </div>
          )
        } else {
          return (
            <p key={index}>
              {section.content}
            </p>
          )
        }
      })}
    </article>
  )
}

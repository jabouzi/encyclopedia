# Encyclopedia Islamiya

An Islamic encyclopedia web application covering 16 sections (creed, ethics, history, Prophetic biography, stories of prophets, worship, etc.).

## Tech Stack

- **Framework**: Next.js 14.2 (React 18.3)
- **Database**: WatermelonDB (v0.27.1) with RxJS — client-side only (excluded from webpack server bundle)
- **Babel**: Custom config with decorators and class-properties plugins (required for WatermelonDB models)

## Project Structure

```
/pages          # Next.js pages (index, 404, book/[id], _app)
/components     # Layout, Header, Nav, Sidebar, Footer, BookCard, ArticleView
/db             # WatermelonDB schema and models (Book, Chapter, Article)
/lib            # queries.js, seed.js
/data           # encyclopedia.js — static source data (Books → Chapters → Articles)
/styles         # Global CSS
```

## Data Architecture

Three-tier model: **Books → Chapters → Articles**

Static content is seeded from `/data/encyclopedia.js` via `getStaticProps`. WatermelonDB handles reactive client-side state.

## Notes

- Arabic/RTL content throughout — preserve RTL layout when editing components
- WatermelonDB must remain client-only; do not import db models in server-side code

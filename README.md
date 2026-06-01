# Saakshi Sunil Portfolio

An editorial fashion archive built as a native React experience with Next.js 15, TypeScript, Tailwind CSS, GSAP, Framer Motion, Lenis, and React PageFlip.

## Assets Used

The readable supplied assets are in `public/assets`:

- `chrome-reference.jfif` - liquid chrome hero reference
- `crossword.png` - interactive crossword gateway image
- `archive-table-reference.jfif` - glass coffee table visual reference
- `remembrance-archived-thesis.pdf` - thesis flipbook, 122 pages
- `magazine-issue-01.pdf` - magazine flipbook, 47 pages

## Architecture

- `app/` - App Router entry and global styles
- `sections/` - full-page editorial sections
- `components/` - shared cursor, PDF flipbook, section labels, and portfolio primitives
- `components/portfolio/` - React recreation of the portfolio as editorial chapters
- `lib/assets.ts` - canonical uploaded asset registry
- `lib/portfolio.ts` - structured portfolio content from the thesis/magazine archive
- `hooks/` - smooth scrolling and reduced-motion hooks
- `animations/` - GSAP registration
- `types/` - shared TypeScript types

## Experience

1. Full-screen liquid chrome hero with embossed Saakshi Sunil title animation.
2. Editorial About section with the supplied exact biography copy.
3. Interactive crossword gateway using the uploaded crossword image and cursor reveal.
4. Native React portfolio experience built from thesis and magazine chapter content.
5. Floating sculptural glass coffee table with thesis, magazine, polaroids, fabric swatches, notes, and coffee mug.
6. Fullscreen thesis and magazine page-flip viewers using the uploaded PDFs.
7. Minimal contact section.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production

```bash
npm run build
npm run start
```

## Vercel

Import the repository into Vercel and keep the default Next.js settings.

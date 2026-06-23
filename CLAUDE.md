@AGENTS.md

# Fishers Founders Dashboard

Community dashboard for Indiana IoT Lab, Fishers IN. Runs on an 80" 4K TV, readable from 20-30 feet.

## Key Facts
- **Live:** https://fishers-founder-united.github.io/Dash/
- **Kiosk:** append `?kiosk=true` to hide nav dots
- **Stack:** Next.js 16, React 19, Tailwind v4, Framer Motion, static export to GitHub Pages
- **Deploy:** push to `main` triggers GitHub Actions → GitHub Pages

## Design System (Light Theme)
- **Background:** `#f0f3f6` (cool light gray)
- **Primary accent:** `teal-500/600` (IoT Lab brand color)
- **Secondary accent:** `amber-400` (nav dots, featured badge)
- **Text:** `slate-800` primary, `slate-500/400` secondary/muted
- **Cards:** `bg-white border-2 border-slate-200 shadow-sm`
- **Dividers:** `h-[2px]` (never 1px — invisible on 4K)
- **Borders:** always `border-2` (never `border` alone)
- **Font sizing:** always `clamp(min, vw, max)` — minimums start at 1.5rem for the smallest text
- **Headers:** `clamp(3rem, 4vw, 5rem)` range
- **Body text:** `clamp(2rem, 2.5vw, 3rem)` range
- **QR codes:** 280-320px for phone scanning from distance
- **Logo:** real PNG at `public/images/logos/indiana-iot-lab.png`

## Layout
- Left 38%: persistent clock + weather panel (ClockWeatherPanel.tsx)
- Right 62%: rotating slides (SlideShow.tsx)
- Bottom: scrolling ticker (Ticker.tsx)
- Top: branding bar with IoT Lab logo + tagline + nav dots

## Slide Rotation
`featured → events → news → radar → spotlight → stats → photos → funfact → announcements`

Each slide only shows if it has data. Featured events cycle through the array.

## Data Files (public/data/)
- `featured-event.json` — array of featured events with optional poster images
- `local-events.json` — hand-curated events
- `events.json` — auto-synced from external calendars (don't hand-edit)
- `news.json` — auto-synced from RSS feeds (don't hand-edit)
- `spotlights.json` — featured companies
- `announcements.json` — community board (auto-filtered by expires date)
- `stats.json` — community numbers
- `photos.json` — photo carousel

## Featured Events
Set `"poster": true` when the image already contains event info (full-bleed, no text overlay).
Set `"poster": false` for image-as-background with text overlay.
Images go in `public/images/featured/`. Auto-hides after `expires` date.

## External Syncs (GitHub Actions, hourly)
- Launch Fishers iCal (hardcoded URL in sync-events.ts)
- Google Calendar, Eventbrite, Meetup (via GitHub Actions secrets)
- Inside Indiana Business RSS (sync-news.ts)

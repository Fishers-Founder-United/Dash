# Fishers Founders Dashboard — Contributor Guide

Welcome! This file has everything you need to get set up, understand the codebase, and start making changes. You can load this file directly into Claude Code and use it as your reference for all work on the dashboard.

> **This file lives in the repo.** You can also find it at https://github.com/Fishers-Founder-United/Dash/blob/main/CONTRIBUTOR-GUIDE.md

---

## How to Use This Guide With Claude Code

Once you have the repo cloned (see Step 1 and 2 below), open a terminal in the `Dash` folder and run:

```bash
claude
```

Then tell Claude Code to read this file:

```
read CONTRIBUTOR-GUIDE.md
```

From there, just talk to it in plain English. Examples:

```
Add a new company called "Acme Robotics" to the spotlights
```
```
Replace the placeholder logo for Qumulex with this image I put in the logos folder
```
```
Add 3 new photos to the photo carousel
```
```
Change the stats numbers to 50 members and 200 jobs created
```
```
Push my changes to GitHub
```

Claude Code will read the guide, understand the project structure, make the changes, and can commit and push for you. You don't need to know the code — just describe what you want.

---

## Step 1: Get GitHub Access

The repo is at: **https://github.com/Fishers-Founder-United/Dash**

1. Create a GitHub account if you don't have one: https://github.com/signup
2. Send your GitHub username to the project owner so they can add you as a collaborator
3. You'll get an email invitation — accept it to get push access
4. While waiting for access, you can still clone and run the project locally

---

## Step 2: Set Up Your Machine

You need **Node.js 18+** and **git** installed.

### Install Node.js (if you don't have it)
- Mac: `brew install node` (or download from https://nodejs.org)
- Windows: Download from https://nodejs.org
- Check: `node --version` should show v18 or higher

### Install Claude Code (if you don't have it)
```bash
npm install -g @anthropic-ai/claude-code
```

### Clone the repo
```bash
git clone https://github.com/Fishers-Founder-United/Dash.git
cd Dash
npm install
```

### Run locally
```bash
npm run dev
```
Open http://localhost:3000 in your browser. That's it — you're running the dashboard.

TV kiosk mode (hides navigation dots): http://localhost:3000?kiosk=true

---

## Step 3: Make Changes and Deploy

The workflow is simple — edit, commit, push. GitHub Actions handles the rest.

```bash
# After making changes:
git add .
git commit -m "description of what you changed"
git push origin main
```

Pushing to `main` automatically builds and deploys to GitHub Pages. The live site updates within a few minutes:

**Live:** https://fishers-founder-united.github.io/Dash/
**Kiosk:** https://fishers-founder-united.github.io/Dash/?kiosk=true

---

## What This Dashboard Does

It's a community dashboard for the Indiana IoT Lab in Fishers, IN. It runs 24/7 on a 4K TV in the lab and is also web-accessible. It rotates through slides showing events, news, weather, company spotlights, stats, photos, announcements, and fun facts.

**Tech stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, static export to GitHub Pages.

**Important Next.js note:** This project uses Next.js 16 which has breaking changes from earlier versions. Before writing new Next.js code, check the docs at `node_modules/next/dist/docs/` for the correct APIs.

---

## Architecture — Where Everything Lives

```
app/
  layout.tsx            Root layout (Geist font, dark theme, metadata)
  page.tsx              Single entry point — renders <Dashboard />
  globals.css           Theme colors, glass effect, ticker keyframes

components/
  Dashboard.tsx         Top-level: fetches data every 30min, manages spotlight rotation, kiosk detection
  SlideShow.tsx         Slide orchestrator: rotation order, timing, progress bar, layout (38% left + 62% right)
  ClockWeatherPanel.tsx Left panel: clock, dynamic greeting, event countdown, weather, 5-day forecast
  Ticker.tsx            Bottom scrolling marquee (events + announcements + jokes)
  NavDots.tsx           Slide navigation dots (hidden in kiosk mode)

  slides/
    EventsSlide.tsx         Upcoming events list with auto-scroll
    NewsSlide.tsx           Indiana business news with auto-scroll
    WeatherRadarSlide.tsx   NEXRAD weather radar map header
    WeatherRadarMap.tsx     Leaflet map component for the radar
    SpotlightSlide.tsx      Featured company: logo, category, NEW badge, description, QR code
    CommunityStatsSlide.tsx "By The Numbers" — animated stat counters
    PhotoSlide.tsx          Photo carousel with caption overlay
    AnnouncementsSlide.tsx  Community board + QR code to indianaiot.com
    FunFactSlide.tsx        Random IoT jokes and fun facts
    ClockWeatherSlide.tsx   (UNUSED legacy file — safe to delete)

lib/
  types.ts              All TypeScript interfaces (Event, Spotlight, StatsData, Photo, etc.)
  events.ts             Fetches all JSON data files from /public/data/
  weather.ts            Open-Meteo API integration, WMO weather code mappings
  iotJokes.ts           45+ curated IoT jokes and fun facts
  useAutoScroll.ts      Hook for smooth auto-scrolling (used by events/news slides)
  basepath.ts           GitHub Pages base path helper

scripts/
  sync-events.ts        GitHub Action script: fetches events from Google Calendar, Eventbrite, Meetup, Launch Fishers
  sync-news.ts          GitHub Action script: fetches news from Inside Indiana Business RSS

public/data/            All content JSON files (this is where you'll spend most of your time)
public/images/logos/    Company logo images (currently placeholders)
public/images/photos/   Photo carousel images (currently placeholders)
```

---

## The Data Files You'll Edit Most

All content lives in `public/data/`. The dashboard refetches these every 30 minutes. After pushing changes, the live site picks them up automatically.

### `spotlights.json` — Featured Companies

Currently has 10 companies. Each entry looks like:

```json
{
  "id": "spotlight-001",
  "name": "Company Name",
  "tagline": "Short tagline shown under the name",
  "description": "2-3 sentences about what the company does.",
  "website": "https://example.com",
  "tags": ["IoT", "startup", "healthcare"],
  "logo": "/images/logos/company-name.svg",
  "category": "Healthcare & Life Sciences",
  "newMember": true
}
```

| Field | Required | What it does |
|-------|----------|--------------|
| `id` | Yes | Unique ID, e.g. `spotlight-011` |
| `name` | Yes | Company name (displayed large) |
| `tagline` | Yes | One-liner shown under the name in cyan |
| `description` | Yes | 2-3 sentences about the company |
| `website` | No | Full URL — when present, a QR code is generated on the slide |
| `tags` | No | Short keyword tags (rendered as cyan pill badges) |
| `logo` | No | Path to logo image in `public/images/logos/` |
| `category` | No | Category label shown above the name (e.g. "Aerospace & Defense") |
| `newMember` | No | Set `true` to show a glowing cyan NEW badge. Remove when no longer new. |

### `stats.json` — Community Numbers

```json
{
  "members": 40,
  "squareFeet": 20000,
  "companiesLaunched": 25,
  "jobsCreated": 150,
  "yearFounded": 2019
}
```

These numbers appear on the "By The Numbers" slide with animated counters. "Years of Innovation" is auto-calculated from `yearFounded`. Update these whenever the real numbers change.

### `photos.json` — Photo Carousel

```json
[
  {
    "id": "photo-001",
    "src": "/images/photos/your-photo.jpg",
    "caption": "Caption shown at the bottom of the photo"
  }
]
```

Drop your images into `public/images/photos/` and reference them here. Recommended size: 1920x1080 or wider. **The current entries are placeholder SVGs — replace them with real photos.**

### `local-events.json` — Hand-Curated Events

```json
{
  "id": "local-001",
  "title": "Event Name",
  "date": "2026-06-01",
  "time": "18:00",
  "location": "Venue Name, Fishers IN",
  "description": "Optional description",
  "url": "https://optional-link.com",
  "source": "local",
  "tags": []
}
```

For recurring events, add a `recurrence` field (e.g. `"Mon-Thu · 12:15 PM"`) — the date is still needed for sorting but won't display.

### `announcements.json` — Community Board

```json
{
  "id": "ann-001",
  "text": "Your announcement text.",
  "url": "https://optional-link.com",
  "expires": "2026-12-31"
}
```

Expired announcements are automatically filtered out.

### `events.json` and `news.json`

**Don't edit these by hand.** They're auto-generated by GitHub Actions scripts that run hourly. To run the sync manually:

```bash
npx tsx scripts/sync-events.ts
npx tsx scripts/sync-news.ts
```

---

## Slide Rotation

Defined in `components/SlideShow.tsx`. Slides play in this order:

| Slide | Duration | Shows when |
|-------|----------|------------|
| events | 40s | events data exists |
| news | 40s | news data exists |
| radar | 25s | always |
| spotlight | 15s | spotlights exist |
| stats | 15s | stats.json loads |
| photos | 20s | photos exist |
| funfact | 12s | always |
| announcements | 15s | announcements exist |

- Spotlights rotate through all companies, one every 60 seconds
- Photos cycle internally every 6 seconds within the photo slide
- Slides with no data are automatically skipped

**To change timing:** Edit the `DURATIONS` object in `SlideShow.tsx`.
**To reorder:** Edit the `SLIDES` array in `SlideShow.tsx`.
**To remove a slide:** Remove it from the `SLIDES` array.

---

## How to Add a New Slide

1. Create `components/slides/YourSlide.tsx`:
   ```tsx
   "use client";

   export default function YourSlide() {
     return (
       <div className="flex flex-col h-full px-12 py-10 gap-6">
         <div className="shrink-0">
           <h2
             className="text-cyan-400 font-black tracking-widest uppercase"
             style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
           >
             Slide Title
           </h2>
         </div>
         <div className="h-px bg-cyan-500/20" />
         <div className="flex-1">
           {/* Your content */}
         </div>
       </div>
     );
   }
   ```

2. Register it in `components/SlideShow.tsx`:
   - Import the component at the top
   - Add its name to the `SLIDES` array
   - Add its duration to the `DURATIONS` object
   - Add a `case` in the `RightPanel` switch statement
   - Add a filter rule in the `activeSlides` useMemo (return `true` to always show)

3. If it needs its own data:
   - Add a TypeScript interface to `lib/types.ts`
   - Add the field to the `DashboardData` interface in `lib/types.ts`
   - Fetch the data in `lib/events.ts` inside `fetchDashboardData()`
   - Update the initial state in `components/Dashboard.tsx`

---

## Placeholder Assets to Replace

These are currently simple SVG placeholders. Replace them with real images:

**Logos** (`public/images/logos/`) — any format works (SVG, PNG, JPG):
- `indiana-iot-lab.svg`
- `arcticrx.svg`
- `qumulex.svg`
- `levisonics.svg`
- `taot.svg`
- `outside-source.svg`
- `pierce-aerospace.svg`
- `1st-maker-space.svg`
- `brotherhood-designs.svg`
- `raineman-solutions.svg`

If you change a filename, update the matching `logo` path in `spotlights.json`.

**Photos** (`public/images/photos/`) — replace placeholder SVGs with real JPGs/PNGs and update `photos.json`.

---

## Styling Reference

The dashboard uses a dark theme optimized for 4K TV display. Key patterns:

- **Background**: `#060d1a`
- **Primary accent**: `text-cyan-400`, `bg-cyan-500`
- **Body text**: `text-white`, secondary `text-white/50` or `text-white/40`
- **Borders**: `border-white/5`, `border-cyan-500/20`
- **Glass panels**: `bg-white/[0.04] border border-white/8`
- **Font sizing**: Always use `clamp(min, preferred, max)` for responsive TV scaling
  - Large headers: `clamp(1.5rem, 3vw, 3rem)`
  - Body text: `clamp(1.25rem, 2vw, 2rem)`
  - Small labels: `clamp(0.9rem, 1.4vw, 1.4rem)`
- **Slide transitions**: Framer Motion (fade + slide)
- **Burn-in protection**: A JS-based pixel shift applies a small random translate to the main container once per minute to protect OLED/plasma screens (no continuous CSS animation — keeps GPU usage low)

---

## Refresh & Deployment Cycle

- Data JSON files refetch every **30 minutes** on the client
- Weather refreshes every **60 minutes**
- The page hard-reloads every **2 hours** (automatically picks up new deployments)
- Push to `main` triggers GitHub Actions build and deploy to GitHub Pages
- GitHub Actions also runs `sync-events.ts` and `sync-news.ts` hourly to pull in external events and news

---

## Common Tasks — Quick Reference

| Task | What to do |
|------|------------|
| **Add a company** | Add entry to `spotlights.json`, drop logo in `public/images/logos/`, set `"newMember": true` |
| **Remove NEW badge** | Set `"newMember": false` or remove the field in `spotlights.json` |
| **Update lab stats** | Edit numbers in `stats.json` |
| **Add photos** | Drop images in `public/images/photos/`, add entries to `photos.json` |
| **Add an event** | Add entry to `local-events.json` |
| **Add announcement** | Add entry to `announcements.json` with an `expires` date |
| **Change slide order** | Edit `SLIDES` array in `components/SlideShow.tsx` |
| **Change slide timing** | Edit `DURATIONS` in `components/SlideShow.tsx` |
| **Add a new slide type** | See "How to Add a New Slide" section above |
| **Add event source** | Edit `scripts/sync-events.ts`, add source type to `Event.source` in `lib/types.ts`, add badge color in `EventsSlide.tsx` |
| **Change jokes/facts** | Edit `lib/iotJokes.ts` |

---

## Using Claude Code With This Project

Start Claude Code from the project directory:

```bash
cd Dash
claude
```

You can ask Claude Code to do things like:
- "Add a new company called XYZ to the spotlight"
- "Replace the placeholder logos with these real images"
- "Change the stats slide to show different numbers"
- "Add a new slide that shows a social media feed"
- "Change the slide durations"
- "Push my changes to GitHub"

Claude Code has full context of the codebase and can read, edit, and run commands. You have creative freedom to change anything — the design, layout, slides, data, colors, animations, whatever makes the dashboard better for the community.

---

## Rules for Claude Code (IMPORTANT — read this section if you are an AI assistant)

When working on this project, you MUST follow these two rules after every change:

### 1. Keep `README.md` up to date

After making any meaningful change to the dashboard — adding slides, adding companies, changing features, modifying the slide rotation, adding data files, changing the tech stack — update `README.md` in the repo root to reflect the current state. The README is public on GitHub and is the first thing anyone sees. It should always accurately describe:

- What slides the dashboard shows (the table of slides, durations, and content)
- How to contribute (data file formats, especially if you added new fields)
- The tech stack
- Any new setup steps, secrets, or configuration

Do NOT let the README fall out of date. If you added a feature, the README should mention it. If you changed how something works, the README should reflect that.

### 2. Keep this `CONTRIBUTOR-GUIDE.md` up to date

After making structural changes — adding/removing slides, changing the architecture, adding new data files, modifying the build process, changing how deployment works — update this file so the next person (or your future self) has accurate information. Specifically:

- The **Architecture** section should list all current files and their purposes
- The **Data Files** section should document all JSON file formats with current field lists
- The **Slide Rotation** table should match the actual `SLIDES` array and `DURATIONS` in `SlideShow.tsx`
- The **Placeholder Assets** section should list any assets that still need replacing
- The **Common Tasks** table should cover any new recurring tasks

This file is in the repo — keep it accurate so every contributor benefits.

### Summary of what to update when

| What you changed | Update README.md? | Update this file? |
|-----------------|-------------------|-------------------|
| Added/removed a company in spotlights.json | No | No |
| Added/removed a slide type | Yes | Yes |
| Changed slide durations or order | No | Yes |
| Added a new data file | Yes (if it changes contribution flow) | Yes |
| Changed the tech stack or dependencies | Yes | Yes |
| Added a new feature (greeting, countdown, etc.) | Yes | Yes |
| Fixed a bug | No | No |
| Changed styling/design | No | No |
| Added new placeholder assets | No | Yes |

---

## Troubleshooting

**`npm run dev` fails:** Make sure you ran `npm install` first. Check Node version is 18+.

**Push rejected:** Someone else pushed first. Run `git pull --rebase origin main` then push again.

**Changes not showing on live site:** GitHub Actions takes a few minutes to build and deploy. Check the Actions tab at https://github.com/Fishers-Founder-United/Dash/actions to see if the deploy succeeded.

**Weather not loading:** The Open-Meteo API is free and doesn't need a key. It occasionally has rate limits. The dashboard shows "Weather unavailable" and retries automatically.

**Slides showing blank:** A slide only appears if its data exists. Check that the corresponding JSON file in `public/data/` is valid JSON and has entries.

# Fishers Founders United — Community Dashboard

A public, community-owned dashboard for the Fishers, Indiana startup, maker, and small business community. Designed to run on TV screens and be web-accessible.

**Live:** https://fishers-founder-united.github.io/Dash/
**Kiosk mode (no nav dots):** `https://fishers-founder-united.github.io/Dash/?kiosk=true`

---

## What It Shows

| Slide | Duration | Content |
|-------|----------|---------|
| Clock + Weather | 15s | Live time, date, current conditions, 5-day forecast for Fishers, IN |
| Upcoming Events | 20s | Next 5 events from all sources |
| Community Spotlight | 15s | Featured startup, maker, or small business |
| Announcements | 15s | Community board + contribute QR code |

A scrolling ticker runs at the bottom of every slide with upcoming events and announcements.

---

## How to Contribute

All community content is managed via pull requests. No API keys or logins required.

### Add an Event
Edit [`public/data/local-events.json`](public/data/local-events.json) and add an entry:

```json
{
  "id": "local-XXX",
  "title": "Your Event Name",
  "date": "2026-06-01",
  "time": "18:00",
  "location": "Venue Name, Fishers IN",
  "description": "What is this event about?",
  "url": "https://your-event-link.com",
  "source": "local",
  "tags": ["startup", "maker", "networking"]
}
```

### Add a Community Spotlight
Edit [`public/data/spotlights.json`](public/data/spotlights.json):

```json
{
  "id": "spotlight-XXX",
  "name": "Your Business or Project",
  "tagline": "One-line description",
  "description": "2-3 sentences about what you do.",
  "website": "https://yourwebsite.com",
  "tags": ["startup", "maker"]
}
```

### Add an Announcement
Edit [`public/data/announcements.json`](public/data/announcements.json):

```json
{
  "id": "ann-XXX",
  "text": "Your announcement text here.",
  "url": "https://optional-link.com",
  "expires": "2026-07-01"
}
```

Then open a pull request. Changes deploy automatically to GitHub Pages.

---

## Automatic Event Sync (External Sources)

GitHub Actions syncs events hourly from external sources. To enable, add these as GitHub Actions Secrets (repo Settings > Secrets and variables > Actions):

| Secret | Description |
|--------|-------------|
| `GOOGLE_CALENDAR_ICAL_URL` | Public iCal URL from Google Calendar (Settings > Integrate calendar) |
| `EVENTBRITE_API_TOKEN` | Eventbrite private token |
| `EVENTBRITE_ORG_ID` | Your Eventbrite organization ID |
| `MEETUP_GROUP_URLNAMES` | Comma-separated Meetup group slugs (e.g. `fishers-founders,indy-makers`) |

---

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy

Push to `main` — GitHub Actions builds and deploys to GitHub Pages automatically.

---

## Tech Stack

- **Next.js 16** (static export)
- **React 19** + TypeScript
- **Tailwind CSS v4**
- **Framer Motion** (slide transitions)
- **Open-Meteo** (free weather API, no key needed)
- **GitHub Pages** + **GitHub Actions**

---

## License

MIT — fork it, customize it, run it for your own community.

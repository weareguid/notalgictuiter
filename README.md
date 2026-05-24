# El Informado

A personal news aggregator that unifies RSS feeds and Bluesky posts into a single chronological timeline. Inspired by Feedly's minimal list view.

## Features

- **Unified feed** — RSS sources + Bluesky posts in one chronological stream
- **Color-coded categories** — red border for México, blue for Internacional, sky for Bluesky
- **Filter bar** — toggle categories and individual sources on/off
- **Mark as read** — click any card to gray it out; state persists in localStorage
- **Auto-refresh** — fetches new content every 5 minutes; spinner shows live updates
- **Dark mode** — remembers your preference, no flash on load

---

## Quick Start

```bash
cd el-informado
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Configuration

### Adding / removing RSS sources

Edit **`sources.config.js`** — no other file needs to change:

```js
export const SOURCES = [
  {
    id: 'my-source',        // unique slug (no spaces)
    name: 'My Source',      // display name
    url: 'https://example.com/feed.xml',
    category: 'mexico',     // 'mexico' | 'international'
    domain: 'example.com',  // used for the favicon
  },
  // ...
];
```

### Adding Bluesky handles

```js
export const BLUESKY_HANDLES = [
  'username.bsky.social',
  'journalist.bsky.social',
];
```

The Bluesky tab appears automatically once at least one handle is added.

---

## Environment Variables

Create a `.env.local` file (copy from `.env.example`):

```
BLUESKY_HANDLE=yourhandle.bsky.social
BLUESKY_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

- **`BLUESKY_HANDLE`** — your Bluesky handle (optional, enables auth)
- **`BLUESKY_APP_PASSWORD`** — generate one at [bsky.app/settings/app-passwords](https://bsky.app/settings/app-passwords)

Without credentials the app reads public posts anonymously — which works for most handles. Add credentials if you get rate-limit errors.

---

## Deployment on Vercel

1. Push to a GitHub/GitLab/Bitbucket repo.
2. Import the project in [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Next.js — click **Deploy**.
4. Add your env vars under **Settings → Environment Variables**.

A `vercel.json` is included that sets a 30-second timeout on the feeds route (needed when several sources are slow).

---

## RSS Feed Notes

| Source | URL | Notes |
|---|---|---|
| Milenio | `milenio.com/rss` | Working public feed |
| N+ | `nmas.com.mx/rss` | May require verification |
| Radio Fórmula | `radioformula.com.mx/noticias.xml` | Working public feed |
| López Dóriga | `lopezdoriga.com/feed/` | WordPress standard |
| NYT Politics | `rss.nytimes.com/.../Politics.xml` | Free tier, headlines only |
| NYT World | `rss.nytimes.com/.../World.xml` | Free tier |
| BBC World | `feeds.bbci.co.uk/news/world/rss.xml` | Fully public |
| Financial Times | `ft.com/rss/home` | Limited public content post-2023 |
| Politico | `rss.politico.com/politics-news.xml` | Working public feed |
| WSJ World | `feeds.a.dj.com/rss/RSSWorldNews.xml` | Working public feed |
| Washington Post | `feeds.washingtonpost.com/rss/politics` | Free tier |

If a feed returns 0 items, check the browser Network tab for the `/api/feeds` response — each failed source logs a warning but doesn't crash the app.

---

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** — utility-first styling, dark mode via `class` strategy
- **rss-parser** — robust RSS/Atom parsing
- **@atproto/api** — official Bluesky AT Protocol SDK

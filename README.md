# Fistball Live 🤾

A live results & standings web app (installable **PWA**) for the
**2026 U18 World Championship & Women's EFA Championship** (Reiden, Switzerland · 23–26 July 2026).

Users pick a category and follow **standings** and **match results** that update
automatically from the official Google Sheet — no backend, just static files.

## Features

- **Category selector** — switch between U18 M/W Gold/Silver, WEC, etc.
- **Standings** — computed live from completed group-stage matches
  (points, wins/losses, set ratio, set/point differential, with tiebreakers).
- **Matches** — fixtures & results grouped by day, filterable (All / Live / Finished / Upcoming),
  with per-set scores and live-match highlighting.
- **Live updates** — auto-refresh every 60s and whenever the app regains focus.
- **Installable PWA** — add to home screen on phone/desktop; works offline with the last loaded data.

## How the data works

The app reads the results sheet directly in the browser via the Google
Visualization CSV endpoint:

```
https://docs.google.com/spreadsheets/d/<SHEET_ID>/gviz/tq?tqx=out:csv&gid=<GID>
```

This works **only while the sheet is shared as “Anyone with the link → Viewer”**
(it currently is). No API key or login is required, and viewers never get edit access.

Configuration lives at the top of [`app.js`](app.js):

```js
const CONFIG = {
  sheetId: "1IWuv2zOZtIJDZCFnItp_z8p546azRGlD8I052jVe8Mk",
  gid: "0",          // tab holding the schedule + scores
  refreshMs: 60000,
};
```

> **Note:** the app shows whatever is in that results tab. Right now the tab
> contains matches **16–48** (group stage + first knock-outs). As the organizers
> fill in scores and add the later matches (49–75), they appear automatically —
> no code change needed. New categories also appear on their own.

## Run locally

```bash
python3 -m http.server 8742
# then open http://localhost:8742
```

(A service worker + PWA install only activate over `https://` or `localhost`.)

## Deploy (any static host)

The whole app is static files, so just upload the folder.

**GitHub Pages**
```bash
git init && git add . && git commit -m "Fistball Live"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
# then enable Pages → Deploy from branch → main / root
```

**Netlify / Vercel / Cloudflare Pages** — drag-and-drop the folder, or point it at the repo.
No build step required.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Markup / app shell |
| `styles.css` | Styling (dark, mobile-first) |
| `app.js` | Data fetch, parsing, standings, rendering |
| `manifest.webmanifest` | PWA metadata |
| `sw.js` | Service worker (offline shell, live data always from network) |
| `icons/` | App icons (192/512 + maskable) |

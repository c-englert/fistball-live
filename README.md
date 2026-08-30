# Fistball Live

Public spectator app for fistball (punhobol) tournaments: live scores,
standings, knockout bracket, full schedule and a cards list — plus a countdown
and weather forecast for the event location. Installable PWA, no login.

It is the read-only companion to **[Fistball Arena](../fistball-arena)**, which
does the scoring and publishing. This app reads only the **public** Firestore
docs Arena writes, so anyone can open it without an account.

Plain HTML/CSS/JS — no build step, no framework.

## Run your own instance

1. Point it at the **same Firebase project** your Arena app writes to: edit the
   `initializeApp({...})` config block near the top of `index.html`
   (apiKey / authDomain / projectId / appId — client-side, not secret).
2. Serve the folder as static files (GitHub Pages, Netlify, or any web server).
   For local testing: `python3 -m http.server` then open the printed URL.
3. In Arena, use **Show on Live** on an event to set the `public/live` pointer;
   Fistball Live then shows that event. You can also open a specific event with
   `?event=<eventId>`.

## How it works

- Reads `public/live` to learn which event is on air, `public/event_{id}` for
  the header/countdown/logos, and `events/{id}/results` for scores — all
  public-read, so no authentication is required.
- Weather is a keyless [Open-Meteo](https://open-meteo.com) forecast for the
  event city (within ~16 days).
- A service worker caches the app shell for offline/instant loads and
  auto-updates on new deploys (bump `VERSION` in `sw.js` when you deploy).

## License & branding

Code is released under the [MIT License](LICENSE). Trademarks and logos
(IFA/PAFA marks, club logos) are **not** covered by this license and belong to
their owners — replace `assets/ifa-mark*.png` with your own for a fork.

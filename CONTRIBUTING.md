# Contributing to Fistball Live

Fistball Live is the public, read-only spectator app for fistball tournaments —
the companion to **Fistball Arena** (which does the scoring and publishing).

It is plain HTML/CSS/JS with **no build step**: edit `index.html`, `app.js` and
`styles.css` and refresh. When you deploy, bump `VERSION` in `sw.js` so the
service worker ships the new files.

Contributions are welcome — bug reports, fixes, translations and ideas.
Please:

- Keep changes focused and match the surrounding style.
- Don't commit third-party trademarks/logos (the app ships neutral placeholder
  marks on purpose).
- Point the Firebase config in `index.html` at your own project for testing.

The broader contribution guide, Code of Conduct and license terms live in the
[Fistball Arena repository](../fistball-arena/CONTRIBUTING.md). By contributing
you agree your work is licensed under the [MIT License](LICENSE).

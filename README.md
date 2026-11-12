# TimeZines

A 24-hour timezone heat map that runs entirely in the browser. There's no build step and no dependencies, and it makes no network requests after the first load.

## Run it

Any static file server works:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` straight from disk also works, but offline/install support needs http(s).

## Deploy

Upload the folder to any static host: GitHub Pages, Netlify, Cloudflare Pages, S3.

## Files

| File | What it does |
|------|--------------|
| `index.html` | Page shell |
| `styles.css` | "Board" design, light and dark themes |
| `app.js` | Timezone maths (browser `Intl` API, DST-safe), rendering, picker, drag-to-reorder, saving |
| `cities.js` | ~230 cities mapped to IANA timezones. Every other zone the browser knows is also searchable |
| `sw.js`, `manifest.webmanifest`, `icon*` | Offline support and add-to-home-screen |
| `fonts/` | Self-hosted IBM Plex Sans Condensed and JetBrains Mono |

Your cities, home override, 12/24h choice, theme and meeting-times filter are saved in `localStorage` under `timezines:v1`.

When you change any app file, bump `CACHE` in `sw.js` so installed copies pick up the update.

## Keyboard

`/` or `a` add a city · `t` jump to now · `[` / `]` previous / next day · `g` / `b` good / best meeting times, `c` clear · `Alt+↑/↓` on a city name to reorder · `Esc` close the picker

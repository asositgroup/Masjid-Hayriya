# Masjid-Hayriya

Static Uzbek donation landing pages:

| Route | Design |
| --- | --- |
| `/` | Original landing |
| `/a/` | Figma Site 1 — gold |
| `/b/` | Figma Site 2 — blue |
| `/c/` | Figma Site 3 — green |

No build or package installation is required to serve the site. For a local preview:

```sh
python -m http.server 5501 --bind 127.0.0.1
```

Both donation links on every page open the project's Telegram invitation directly: https://t.me/+DCcwSCfohihkNDA0. There is no registration modal, lead collection, Apps Script submission, or thank-you page. Native links also work when JavaScript is disabled.

The shared `js/app.20261026.js` preserves Meta Pixel `857523047352756` across all four routes. It sends `PageView` on page load and `CompleteRegistration` when a donation link is activated. Here, `CompleteRegistration` measures a Telegram link click, not confirmed channel membership or a donation.

New variants use local AVIF images, native Figma vector assets, and background scenes capped at 500px outside the content container. Their design source is the `Site 1`, `Site 2`, and `Site 3` frames in the supplied Figma file. No Figma credentials are included in the project.

CSS and shared JavaScript use the `20261026` filename version so browsers request the current assets after deployment. When replacing these assets again, update their versioned filenames and all HTML references together.

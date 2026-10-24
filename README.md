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

All pages use the shared registration modal scripts. The form collects name and phone, sends them to the configured Apps Script `Lead` destination, and enables the Telegram invitation after the destination returns `ok: true`. Failed submissions remain in browser storage and offer an explicit retry.

New variants use local AVIF images, native Figma vector assets, and background scenes capped at 500px outside the content container. Their design source is the `Site 1`, `Site 2`, and `Site 3` frames in the supplied Figma file. No Figma credentials are included in the project.

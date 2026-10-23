# Website audit, 2026-10-23

## Scope

Fresh comparison of the 24 Chinese/English page pairs, with Chinese content as
the reference. Existing language-specific sales contacts are intentional and
remain unchanged. Legacy redirect files are retained.

## Corrections

- Replaced the English home heading and supporting paragraph with the requested
  wording; constrained wrapping inside the existing panel.
- Matched the English tube-thawing category image to the Chinese ThawLINE image.
- Removed CellHome production/layout commentary in both languages and obsolete
  implementation commentary on the local-history page.
- Corrected English grid classes, surplus feature headings and missing support
  form fields to match the Chinese pages.
- Reviewed English terminology and feature descriptions: ozone disinfection,
  residual ice, SD-card handling, user permissions, temperature protection,
  capacity-based settings, container types and model dimensions. Removed
  unsupported mechanisms and regulatory implications from translations.
- Translated dynamic comparison names and aligned feature summaries with Chinese.
- Corrected English homepage canonical/hreflang URLs.
- Replaced consent references to nonexistent policy pages with a direct
  contact-processing acknowledgement in Chinese, matching the English forms.
- Form success now requires an affirmative API result, not HTTP 200 alone.
  Added duplicate-submit protection and a timeout. Optional local history no
  longer turns successful submission into a failure when storage is unavailable.
- Local-history records are rendered as text, not executable HTML.

## Performance and media integrity

- Original video remains 1280 x 720. No re-encoding, bitrate reduction, frame
  interpolation or resolution change was performed.
- Moved the 28,617-byte MP4 index ahead of media data and adjusted 619 chunk
  offsets. Media payload SHA-256 before and after:
  `824ebf109eb82fa9cce3008868cd775cad656e8556c884060acc33b212d5ba1b`.
- Default mobile playback now uses the same original-quality source as desktop.
  Explicit data-saving preferences and 2G connections retain a lightweight source.
- Pause decoding offscreen/in hidden tabs; resume when visible. Honor reduced
  motion and restore playback after back/forward navigation.
- Removed real-time background blur over the moving hero and reduced reveal
  delays. Navigation is not delayed by a transition.
- Converted 19 large product images to full-size lossless WebP: 37,440,172 bytes
  to 22,433,426 bytes, a 40.1% reduction. Verified identical alpha and all visible
  decoded pixels. Original PNG assets are retained.
- Added 480/960/1600-pixel responsive variants where applicable, preserving
  aspect ratios and transparency. Small screens avoid full-size downloads.
- At device pixel ratio 1, the three homepage series images selected at 1440px
  total 622,538 bytes and at 390px total 170,820 bytes, versus 5,142,955 bytes
  for the previous PNG sources. These are image-file sizes, not a claim about
  download times on real visitor networks.
- Added intrinsic image dimensions to stabilize layout and a display-sized
  logo to avoid repeatedly decoding the oversized source logo.
- Fixed small-screen English footer columns and tiny English introductory copy.

## Repeatable validation

Run `node tools/audit-site.cjs` with Playwright installed and Chrome available.
If dependencies are supplied by the desktop runtime, set NODE_PATH to that
runtime's node_modules first. The audit starts an ephemeral local HTTP server,
supports byte ranges, and writes reports/screenshots only to `.vite/audit/`.

It checks all sitemap pages at desktop/mobile widths, additional narrow/tablet
views, local asset/link references including responsive images, image/card/section
parity, overflow, broken images and runtime exceptions. It also tests navigation,
video source/play/pause, reduced motion, product selection, filters and mocked
form success/rejection. No real consultation or email is sent by these tests.

Live 53KF script and map embed endpoints returned HTTP 200 during this audit.
Full external chat delivery, actual inbox receipt, map tile availability in all
regions, and real iOS/Android hardware behavior still require operational checks.
Browser emulation and a local test cannot guarantee GitHub Pages network latency
from every domestic ISP. Quantitative product claims remain sourced from the
Chinese product materials, not independently certified by this audit.
In particular, the Chinese ThawWaker material calls a feature "two export
methods" but the description identifies only Bluetooth printing. The missing
method needs product-owner confirmation; no second method has been invented.

The older `build-english-site.js` and `update-site-seo.js` are historical bootstrap
scripts. Their defaults now stop instead of silently overwriting reviewed pages,
redirects and metadata. Maintain the current HTML directly.

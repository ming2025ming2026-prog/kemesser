# Kemesser quality review, 2026-10-25

## Scope and reference

Fresh review of the current worktree, not acceptance based on a previous audit.
Chinese pages are authoritative. Language-specific sales contacts remain
intentional. Baseline for this pass: Git `39ed64c`.

Skills used: web-design-guidelines, frontend-design, performance, and Playwright
browser verification. The Playwright CLI prerequisites were unavailable; tests
used the existing Node Playwright API with installed Chrome, without new packages.

## Corrections in this pass

- Accessible skip links, primary headings, product breadcrumbs, visible keyboard
  focus, labelled filters, live result counts and status messages.
- Navigation disclosure state now agrees with its visible state. Keyboard open,
  Escape, hover, focus exit and mobile outside-click behavior are coordinated.
- Product pages highlight their parent series and inquiry links carry the actual
  selected product, including tube/bag variants across language switching.
- Download/comparison filters survive reload and language switching. Preferred
  manual language follows the page language; missing manuals offer an inquiry.
- Smaller mobile table columns keep product names and manual links usable. Tables
  support keyboard horizontal scrolling and retain the product column.
- Matched Chinese/English footer grids, constrained long English text, corrected
  contact heading scale and filled the map container without a blank lower band.
- Strengthened primary-button/text contrast without changing the green/white
  identity. Reduced hover movement on interactive cards; removed movement from
  informational feature cards.
- Content is readable before animation initialization and without JavaScript.
  Below-fold reveals and reduced-motion behavior remain supported.
- Added a keyboard-operable hero pause/resume control. A deliberate pause is not
  overridden when the visitor scrolls back. Autoplay/muted/loop/playsinline remain.
- Forms validate total attachment size, lock inputs while submitting, preserve
  the sent snapshot and restore inputs afterward. Editing clears stale status.
  Failure, timeout and success have distinct messages; a timeout does not claim
  delivery. Optional local-history storage cannot turn success into failure.
- Original 53KF identity and FormSubmit recipients are unchanged. Chat scheduling
  no longer waits for slow maps or other subresources to finish loading.
- About-page quality/R&D/service paragraphs were made concise in both languages,
  without adding certification, clinical or service-level claims.

The requested English hero wording, Chinese-authoritative category imagery and
removal of production/layout commentary were verified again in this pass. Those
content corrections were originally introduced in the preceding audit commit.

## Fresh verification

- `node tools/audit-site.cjs`: exit 0; 146 page/viewport renders. All 48 public
  Chinese/English pages at 1440 and 390 px; key pages additionally at 320, 768,
  1024, 1280 and 1920 px.
- No missing local resources/links, broken images, uncaught page exceptions,
  structural/image/model/feature-count parity differences or measured overflow
  in that run. Geometry checks do not prove that all external services are up.
- Real clicks on all 24 product inquiry flows and language switches; download
  filters, preferred manual language, empty states and query persistence.
- Both languages' sales/support forms: mocked rejection, mocked success, disabled
  browser storage and recipient checks. No real inquiry or email was sent.
- Targeted checks: slow map cannot delay the chat script; oversized attachments
  rejected; valid attachments included; pending inputs locked/restored; stale
  success cleared on new edits. These used mocked external responses.
- Desktop/mobile original-quality video playback, offscreen pause/resume,
  reduced motion, manual pause, keyboard disclosure and no-JavaScript content.
- Screenshot inspection of desktop/mobile home, contact, footer and narrow tables.
  All 36 available manual links in Chinese/English tables were also clicked in a
  narrow-screen browser test with requests intercepted, not downloaded.
- `node --check app.js`, `node --check utility-pages.js`, and `git diff --check`
  passed. Legacy redirects and `CNAME` were retained.

Raw local evidence is under `.vite/audit/`, `.vite/ux-review/`,
`.vite/html-fresh-audit/` and `.vite/performance-review/`. It is not deployed.

## Performance and media

Global `app.js` is 20,296 bytes versus 28,776 at baseline, a 29.5% reduction in
uncompressed common-script bytes. `utility-pages.js` (17,538 bytes) now loads only
on the nine form/download/comparison/local-history pages, after `app.js` and
`site-data.js`. Utility pages do not have a smaller combined JavaScript payload;
the split removes unused utility work from home and product pages.

No video re-encoding, resolution reduction or frame interpolation was performed.
Default playback tested at 1280 x 720 on desktop and mobile. Original video SHA-256:

`D671FE9FA0733FD5FDBA53C9903209D6E6BC7570A3D33AA37499215FD6A0CD5E`

The original video is approximately 22.8 MB over 38.87 seconds, about 4.7 Mbps.
It cannot stream indefinitely without buffering over a 1.6 Mbps connection while
retaining that bitrate. Data-saving preferences retain the existing lightweight
source; normal users retain the original-quality source.

Lab measurements use cold-cache, local uncompressed HTTP/1.1, Chrome, 390 x 844
mobile emulation, 4x CPU slowdown, 150 ms latency and 200,000 bytes/s. They do not
represent actual domestic GitHub Pages response time, phone GPU performance,
CrUX/RUM or field INP. Baseline mobile n=3 median FCP 1164 ms and first video frame
2679 ms. Final measurements overlap that baseline; no large speedup is established.

Final suite `2026-10-25T14-22-39-472Z-home-working`, n=3 per profile:

| Metric | Baseline median [min, max] | Final median [min, max] |
| --- | --- | --- |
| Mobile FCP, ms | 1164 [1148, 1192] | 1176 [1156, 1220] |
| Mobile first video frame, ms | 2679 [2679, 2707] | 2684 [2670, 2709] |
| Desktop FCP, ms | 60 [60, 80] | 60 [56, 80] |
| Desktop first video frame, ms | 207 [206, 230] | 213 [190, 222] |

Mobile CLS was 0 in all final samples; desktop median CLS was 0.000169. Desktop
video samples reported no dropped frames. CPU/network-throttled mobile samples
showed substantial buffering/dropped frames, also present at baseline: this is
not evidence of smooth real-phone playback. LCP candidates changed from the
baseline logo to text, so a smaller LCP value is not a like-for-like hero gain.
No uncaught application exceptions were observed. Console resource errors in
this isolated suite were intentionally blocked external requests, not a live
availability check of 53KF or other third parties.

## Remaining confirmations

- Real FormSubmit mailbox receipt and attachment delivery require an agreed live
  submission. Real 53KF reception, notifications and chat-window theme require
  its backend; no credentials or authenticated browser state are committed.
- Chinese ThawWaker descriptions for two export methods and capacity adaptation,
  and ThawLINE Pro password-period wording, need product-owner clarification.
  Required feature names were retained; translations do not invent mechanisms.
- Real iPhone/Android and mainland ISP testing remain necessary. External map
  tiles, chat and mail availability depend on third-party networks/services.
- This review is not a certification of every translation, device or network.

## Maintenance

When changing utilities, load shared scripts in this order: `site-data.js`,
`app.js`, `utility-pages.js`. Home/product pages do not need utility-pages.js.
Keep cache versions synchronized in root and English HTML. Re-run the audit
after editing shared layouts, navigation, form contracts or data structure.

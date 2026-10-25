# Video and navigation loading fix, 2026-10-25

This pass follows the real-user report of stalled video and blank series cards.
The previous layout audit did not establish acceptable network loading behavior.

## Changes

- Browser discovers the video URL directly in HTML, with preload=auto. Removed
  idle-callback and timer deferral and avoided reloading an already selected URL.
- Video-derived 15 KB poster is visible before decoding; it is not proof that
  playback has started. The previous unrelated background was not restored.
- Added a web playback derivative; preserved the original file unchanged.
- First two product images on non-home pages load eagerly at high priority.
  Series pages preload the first responsive image with matching srcset/sizes.
  Other below-fold product images remain lazy to avoid competing downloads.
- Delegated intent-prefetch handles dynamic links and query strings, capped at
  four pages and disabled for data saving/2G. Native navigation is not intercepted
  and does not wait for an animation. Pressed controls give immediate feedback.
- Shared asset cache version is now 20261025-3 in both languages.

## Media integrity and tradeoff

Web derivative: 3,721,885 bytes vs original 22,826,044, approximately 84% smaller.
1280x720, 30 fps, 1166 frames and full duration retained; silent background audio
track removed. H.264, yuv420p, faststart, CRF18, slow preset, maxrate/bufsize 1600k,
keyframe interval 30. No resizing or interpolated frames.

Whole-video FFmpeg SSIM against original: Y 0.996827, U 0.998683, V 0.998505,
All 0.997416. This is high similarity, not mathematically lossless or a guarantee
that every viewer perceives identical detail. An uncapped intermediate had SSIM
0.998281 but worse startup/burst behavior and was not shipped.

## Verification

`tools/audit-loading.cjs --baseline` serves HTML/JS/CSS from immutable 4a446e4;
without the flag it serves current files. Both use the unchanged original assets
where referenced. Run with installed Node Playwright via NODE_PATH.

Two cold-cache runs each, Chrome at 390x844, 150 ms latency, 200,000 bytes/s
(about 1.6 Mbps), no CPU slowdown, third parties blocked, local HTTP/1.1. Observation
ends 15 seconds after DOMContentLoaded, not exactly 15 seconds from navigation.

| Metric | Baseline runs | Final runs |
| --- | --- | --- |
| First decoded video frame, ms | 2595 / 2576 | 1515 / 1505 |
| Video time at observation end, seconds | 3.46 / 3.46 | 13.43 / 13.42 |

The final video still emitted short waiting events; this is not a zero-buffering
claim. Results isolate the transfer bottleneck, not real phone GPU or mainland
GitHub Pages TTFB. Browser autoplay policies and network latency can still delay
playback; posters and prefetch cannot guarantee instant network responses.

Fresh full audit: 146 renders passed, including both languages, responsive layout,
product inquiry clicks, filters, forms, keyboard menus, language state, manual
pause, reduced motion, and original 720p dimensions on the new playback source.
Six Chinese/English series pages were additionally checked without forcing image
loading: their first images loaded successfully with eager/high priority.
node --check app.js and git diff --check passed. Local raw evidence is under
.vite/loading/ and .vite/audit-loading-fix.txt; test packages are not deployed.

## Remaining boundary

No real email/chat messages were sent. Immediate local control response is
different from immediate network completion. The hosting route and third-party
services remain outside client-side control; real-device/domestic-ISP checks
remain necessary if delays persist after this deployment.

# Release checks — 2026-10-08

This release remains four static HTML pages with shared CSS/JavaScript. No dependencies, framework or build were added. Original assets, contact icons, films, Formspree endpoint, Turnstile site key and the map coordinates are preserved.

## Initial release verification (183b250 / 9804990)

- Chrome headless: all four pages in French/Arabic at 320, 390, 640, 900 and 1440 CSS px (40 visits). Images loaded, no missing local assets, no horizontal overflow or uncaught JavaScript exceptions. Fresh full-page screenshots captured at 390 and 1440 px in `/tmp/djouri-<page>-<language>-<width>.png` for this run.
- A 720 CSS px viewport at device scale 2 checked the reflow equivalent of a 1440 px desktop at 200% zoom, across all pages/languages. This is emulation, not a manual browser zoom or physical-device check.
- Direct navigation, refresh and repository-subdirectory hosting passed. Invalid `lang` defaults to French; switching and Back/Forward retain drafts and update language/RTL. Mobile navigation and all content remain available with JavaScript disabled (initial French HTML).
- Gallery collections: Home 9; Projects All 13, Architecture 7, Interior 5, Plans/3D 1. Previous wraps, single-entry controls disable, rapid navigation ends on the correct image, Escape closes, keyboard focus traps and returns to the opening card. Closing is immediate; obsolete image loads are discarded.
- Both form listeners tested with isolated transport and a Turnstile stub: valid acknowledgement, validation rejection, 429 rate limit, malformed JSON, network rejection, stalled fetch, stalled body parsing, repeated clicks and language switching while pending. Failure preserves entered text; controls recover and tokens reset. Two consecutive attempts send distinct tokens. No test inquiry was sent externally.
- The real 30-second deadline was also exercised without shortening the timer: by 30.5 seconds the signal was aborted, controls restored, text retained and exactly one request attempted. No automatic resend.
- Turnstile loading failure, unavailable state, expiry, retry, awaiting/verified states, compact/flexible resizing and fresh tokens checked using controlled callbacks. Production challenge issuance and server-side secret/dashboard configuration require a live owner check.
- Camera Pause, reduced motion and preference changes passed. Background suspension/resume was tested by changing the visibility input and dispatching its event; real tab switching remains a manual smoke check. Fine-pointer hover rules and keyboard equivalents were inspected; films retain native controls and `preload="none"`.
- Browser-rendered contrast: bronze/white **6.04:1**, bronze/muted surface **5.64:1**, muted text/white **6.01:1**, muted text/muted surface **5.61:1**, bright bronze/black **5.83:1**, footer muted/black **9.14:1**. These cover active navigation, captions, placeholders, form/status text and text on plain surfaces. Hero text was made fully opaque and its image shade strengthened, including its RTL override. Screenshot sampling of the brightest pixels within small-text bounds across all three slides, both languages and all five viewport widths measured a conservative minimum of **4.84:1**.
- Three local initial-load samples per motion setting: normal FCP 76–108 ms, reduced FCP 100–140 ms; initial CLS **0** in all six samples. These warm local measurements show no repeatable motion regression; they are not production network or mobile performance benchmarks.
- Static checks passed: local asset/link resolution, French/Arabic attribute pairs, canonical/privacy footer links, original card counts, film loading policy, four sitemap entries and `.nojekyll`. `node --check script.js` and `git diff --check` passed.

## Cinematic motion follow-up

The previous fade-and-rise implementation could hide content after it had already painted. This version prepares the opening before paint, uses whole-text masks, and skips the opening if initialization exceeds 800 ms. The building stays visible immediately. Arabic text and language selection are prepared during parsing; the temporary language observer disconnects when shared behavior starts. The mobile menu remains usable while the shared script is delayed.

- Twelve cold-load profiles: French/Arabic at 390 and 1440 px in normal, reduced and throttled conditions (150 ms latency, approximately 1.6 Mbps download, 4× CPU). Frame samples confirmed fully opaque text, monotonic opening masks and no visible → hidden → visible replay. Filmstrips are in `/tmp/cinema-filmstrip-*` for this run.
- Normal/reduced cold CLS ranged from approximately **0.0002 to 0.0026**; throttled CLS remained approximately **0.0005 to 0.0022**. Recorded sources were font metric changes, also present with reduced motion. The earlier header fallback shift and late French-to-Arabic text change were corrected; no zero-CLS claim is made for cold external-font loading.
- Candidates decode before an 850 ms transition over the opaque outgoing image. The outgoing camera frame is preserved until covered. Delayed decode races, failed images, rapid navigation, clicking the initial dot before decode completes, and partial animation failures passed.
- A real script request held past the startup deadline left Arabic text visible and the mobile menu usable. Continuing the request preserved the open menu and did not replay the heading animation. Unsupported animation calls failed open without disabling the inquiry form.
- Real headless Chrome tab switching suspended the progress clock; Pause/resume and reduced-motion changes passed. Reduced motion clears prepared masks and cancels camera/progress animations immediately.
- Reveals observe unmasked containers so clipped headings and images cannot suppress their own intersections. Nearby media prepare after the first hero decodes. Photo masks begin after decode, fail open after 1500 ms, and immediately clear for keyboard focus or reduced motion. Hover zoom uses a separate transform from the settling scale.
- Four-page French/Arabic viewport, gallery and isolated-form regression checks remain the same scenarios listed above. Real 200% zoom and physical mobile Safari remain owner/device checks; the desktop reflow equivalent, URL history, subdirectory refresh and JavaScript-disabled rendering were checked locally.

- The final regression pass covered all **40** page/language/viewport combinations, every gallery filter, wrapping, rapid lightbox navigation, Escape/focus and both forms’ isolated success/failure/timeout paths. All passed. Screenshots were taken after images decoded and non-hero reveal animations settled.
- A separate scroll pass across all eight page/language combinations confirmed every heading/photo mask cleared and never returned on revisiting the section.
- First-paint timings initially varied with resource/cache state. A repeated controlled warm comparison measured normal-motion FCP **112–156 ms** (median **120 ms**) versus reduced **116–132 ms** (median **128 ms**), with no repeatable motion regression. These local samples are not production/mobile benchmarks.
- Delayed-script, animation-API failure and partial caption-animation failure tests passed. Actual headless Chrome tab activation paused the clock. Initial-dot decoding races, desktop reflow at the 200% equivalent, URL validation/history/draft, subdirectory refresh and no-JavaScript fallback passed.

- Pointer hit-testing and actual mouse press/release events passed at 320, 390 and 1440 px in both languages, including manual navigation while paused. The slide container creates a stacking context so crossfade layers cannot cover the shade, text or controls; hero focus outlines use white.
- Camera contrast was sampled at the start, middle and end on all three slides, both languages and five widths (90 background captures). The identified worst case was rechecked with the strengthened shade and measured **4.97:1**. The stronger black shade also improves the other previously passing contexts. Text remains fully opaque; the foreground stays above every crossfade layer.
- A stalled automatic image decode retained completed progress across background/foreground changes and resumed the expected next slide once ready.

Shared CSS/JavaScript URLs use the consistent `cinema-20261008` cache stamp in all four pages. The cinematic follow-up is locally verified. Publishing uses an ordinary commit/push; the final deployed-file comparison is recorded in the completion message and `/tmp/djouri-cinema-deployment.json` for this run.

## Publishing and owner sign-off

Implementation committed as `183b250` with an ordinary commit. The owner completed the push after the initial Git authentication failure. Production Home HTML, CSS and JavaScript were downloaded and matched that release byte for byte. A subsequent all-slide hero contrast measurement identified small-text contrast on light image regions; the shared image shade was strengthened in a follow-up change. After the follow-up push, all four pages, CSS, JavaScript, sitemap and robots were downloaded and matched release `9804990` byte for byte. Published history has not been rewritten.

The following remain owner/device checks; local simulations cannot establish them:

1. Submit one identifiable live inquiry, confirm receipt in Formspree, and verify notification delivery to **djouridesigne@gmail.com** (including spam). Verify the dashboard recipient and Turnstile secret configuration there. The website only confirms the Formspree acknowledgement, never inbox delivery.
2. Smoke-test on a real mobile Safari device: French/Arabic layout, menu, touch interactions, lightbox, Turnstile, films and form recovery; check real browser zoom and tab suspension.
3. Review hero text against each image on real screens and test on the owner’s mobile connection.

Production sign-off remains pending these owner/device checks. Social destinations and expanded business/case-study sections remain deferred.

## Contact QR addition

- Added a prominent Contact QR section with French/Arabic labels and a native download link. The local SVG and high-resolution 1480 × 1840 PNG both independently decoded to `https://djouri.raystate.com/`. The downloaded image includes “SCAN ME”, the studio name and address.
- Chrome checks passed at 320, 390, 640, 900 and 1440 CSS px in both languages: no horizontal overflow, QR width 250–296 px, translated labels and correct PNG content. Fresh screenshots were inspected at 390 and 1440 px. Shared asset cache stamps were updated consistently on all four pages.
- The native browser download produced a byte-for-byte match of the local PNG. Live language switching updated the QR labels; the image and download remained available with JavaScript disabled. No scanning service or browser QR library was added to the site.

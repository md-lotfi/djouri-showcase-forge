# Release checks — 2026-10-08

This release remains four static HTML pages with shared CSS/JavaScript. No dependencies, framework or build were added. Original assets, contact icons, films, Formspree endpoint, Turnstile site key and the map coordinates are preserved.

## Local verification

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

## Publishing and owner sign-off

Implementation committed as `183b250` with an ordinary commit. The owner completed the push after the initial Git authentication failure. Production Home HTML, CSS and JavaScript were downloaded and matched that release byte for byte. A subsequent all-slide hero contrast measurement identified small-text contrast on light image regions; the shared image shade was strengthened in a follow-up change. Final publishing parity is recorded below. Published history has not been rewritten.

The following remain owner/device checks; local simulations cannot establish them:

1. Submit one identifiable live inquiry, confirm receipt in Formspree, and verify notification delivery to **djouridesigne@gmail.com** (including spam). Verify the dashboard recipient and Turnstile secret configuration there. The website only confirms the Formspree acknowledgement, never inbox delivery.
2. Smoke-test on a real mobile Safari device: French/Arabic layout, menu, touch interactions, lightbox, Turnstile, films and form recovery; check real browser zoom and tab suspension.
3. Review hero text against each image on real screens and test on the owner’s mobile connection.

Production sign-off remains pending these owner/device checks. Social destinations and expanded business/case-study sections remain deferred.

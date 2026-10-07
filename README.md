# DJOURI DESIGNE

A bilingual French/Arabic architecture portfolio made with plain HTML, CSS, and JavaScript. The React, TanStack, Tailwind, Vite, and npm build stack has been removed. No installation or build is needed.

## Publish on GitHub Pages

1. Commit these files and push them to the repository's `main` branch.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select **main** and **/ (root)**, then save.
5. Once GitHub finishes publishing, visit <https://md-lotfi.github.io/djouri-showcase-forge/>.

`.nojekyll` tells GitHub Pages to serve the static files directly. All internal links and assets use relative paths, so the same files also work on another repository or a custom domain. No GitHub Actions build workflow is required.

For the official instructions, see [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Preview locally

Open `index.html` directly in a modern browser, or start a local static server:

```sh
python3 -m http.server 8080
```

Then visit <http://localhost:8080/>. Python is only an optional preview tool; it is not needed for hosting.

## Files and editing

| File | Purpose |
| --- | --- |
| `index.html` | Home page, carousel, selected projects, living spaces, studio, short film, inquiry form |
| `projets/index.html` | 13 project studies, category filters and lightbox |
| `atelier/index.html` | Studio presentation, expertise and portrait architectural film |
| `contact/index.html` | Inquiry form, contact channels and location map |
| `styles.css` | Shared responsive styles and RTL layout |
| `script.js` | Language switching, mobile menu, carousel, filters, lightbox, Formspree submissions |
| `assets/` | Original logo, optimized project images, film posters, local MP4 films and favicon |

Edit the HTML directly. French text appears in the markup; translated elements also have `data-fr` and `data-ar` attributes. Update both attributes and the default French text together. Translated image alt text, accessible button labels, placeholders, and metadata use corresponding `data-alt-*`, `data-aria-label-*`, `data-placeholder-*`, and `data-content-*` attributes. The map iframe title uses `data-title-fr` and `data-title-ar`.

The header, footer, and some sections are repeated across pages. Apply shared content changes to every applicable HTML file. Project cards are the source for the lightbox, so their titles, captions, and image paths need no separate JavaScript data list.

## Language and interactions

- French is the default. `?lang=ar` selects Arabic and RTL; any other value falls back to French.
- Navigation retains the selected language. Switching languages updates the current URL without losing an inquiry draft. Browser Back/Forward restores the language from the URL.
- Each page has its own title and description. JavaScript updates metadata in Arabic; preview crawlers that do not execute JavaScript see the French metadata.
- The carousel changes slides every eight seconds and supports pause, arrows, and dots. Reduced-motion preferences disable automatic playback. Background tabs suspend playback.
- The lightbox supports Previous/Next, keyboard arrow keys, Escape, focus trapping, and returning focus to the project button.
- Contact details on the homepage and Contact page link to **0671 56 77 38**, **0671 62 58 15**, and **djouridesigne@gmail.com**. Phone links use international `+213` dialing; values remain left-to-right in Arabic layouts.
- Both inquiry forms validate their fields and submit directly to **https://formspree.io/f/moejelao** using native JavaScript AJAX (`fetch` with `Accept: application/json`). Fields are `name`, `email`, `projectType`, and `message`. A successful JSON acknowledgement displays a French/Arabic receipt message and clears the form. Errors preserve the draft and offer direct contact alternatives. The website does not confirm notification email delivery. There is no email-draft or text-download workflow.
- The Contact page has a lazy-loaded Google Maps section at **36.8019335, 5.7445404**, plus a direct link to the supplied Djouri design business listing. The homepage’s **Nous trouver / موقعنا** link retains the current language and jumps to this section. The direct listing link remains available if Google Maps embedding is blocked.

### Formspree setup

This static GitHub Pages site uses the [Vanilla JavaScript AJAX approach](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/), tailored to the existing bilingual UI using browser-native `fetch`. No installation, build step, or API key is required for Formspree. Cloudflare’s Turnstile script loads separately for bot verification. Both forms have `action="https://formspree.io/f/moejelao"` and `method="POST"`; JavaScript keeps visitors on the current page.

In Formspree, link and verify **djouridesigne@gmail.com**, then select it as the form notification recipient in **Workflow → Email → Settings**. See [Changing a form email address](https://help.formspree.io/articles/form-and-project-settings/changing-a-form-email-address). The recipient is controlled in the dashboard, not by the website code. Keep the visitor's `email` field for replies.

Both forms use Cloudflare Turnstile public site key **0x4AAAAAABDo3LD4GLKBstnv**. In Cloudflare, allow the production hostnames (`djouri.raystate.com` and `md-lotfi.github.io` if both are used), plus `localhost` and `127.0.0.1` for local testing. In Formspree form **moejelao**, enable CAPTCHA, choose **Cloudflare Turnstile**, and save its **secret key only in Formspree**. Never commit that secret. See [Formspree's Turnstile guide](https://help.formspree.io/articles/form-and-project-settings/protecting-your-forms-with-cloudflare-turnstile).

Use the HTTP preview server rather than opening `index.html` via `file://` when testing forms. The widget follows French/Arabic language selection. Submissions require a fresh token sent as `cf-turnstile-response`; Formspree performs server-side verification. Tokens reset after each request. Script failures, verification errors, and expired challenges preserve the draft and provide a retry control. The widget uses compact sizing on narrow forms.

Internet access is required for submissions and verification. After publishing, submit one identifiable test inquiry, verify it in Formspree's submission inbox, and check the Djouri notification inbox (including spam). Dashboard configuration and inbox receipt cannot be verified from local browser simulations.

All logo and project images are local assets. The original portfolio media came from the Lovable preview; seven additional renderings and two films came from the supplied Djouri-Design folder. Added renderings use optimized WebP images and responsive thumbnails; originals remain untouched. The two alternate gold logo artworks are also available in `assets/` without changing the existing site identity. Films use H.264/AAC MP4 with fast-start metadata, native controls, posters, and `preload="none"`; they never autoplay. Asset provenance and checksums are recorded in [assets/README.md](assets/README.md). Google Fonts and the Contact page’s Google Maps iframe are external resources. System fonts are used if Google Fonts is unavailable, and the map section retains a direct Google Maps link.

## Verify a change

Check all four pages on desktop and mobile, including direct visits and refreshes. Check French/Arabic content, menu controls, project filters, lightbox keyboard controls, reduced-motion behavior, form validation, submission loading/success/error states, duplicate prevention, and the Google Maps location/link. When testing deployment, also check the site under a repository subdirectory rather than only at `/`.

This repository was originally created with Lovable. Keep its published git history intact: do not force push or rewrite pushed commits. Subsequent Lovable edits could reintroduce framework files; maintain this static version directly in the repository.

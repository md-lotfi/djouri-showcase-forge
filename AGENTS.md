<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The user has replaced the React/Lovable build stack with plain static HTML, CSS, and JavaScript. Do not reintroduce a framework, package installation, or build requirement.
- The four pages live at `index.html`, `projets/index.html`, `atelier/index.html`, and `contact/index.html`. Shared styles and behavior live in `styles.css` and `script.js`; shared HTML is repeated across pages and must be kept consistent.
- Language comes from the validated `lang` search parameter (`ar` selects Arabic; all other values default to French), and navigation retains it. Arabic uses RTL. Maintain translated text, accessible labels, alt text, placeholders, and page metadata.
- Use relative page and asset paths so direct visits and refreshes work on GitHub Pages under a repository subdirectory. Publish from the repository root with `.nojekyll` and no build step.
- Original project media are local optimized WebP files in `assets/`; preserve them and their provenance. Do not use Lovable asset pointers or substitute stock images.
- The Projects page includes 13 studies; the home page features six original projects and three living-space studies. Lightbox entries and counters derive from the actual project cards. Keep film playback user initiated, with local posters and `preload="none"`.
- Contact channels are `0671 56 77 38`, `0671 62 58 15`, and `djouridesigne@gmail.com`; phone links use Algeria’s +213 country code. Do not assume WhatsApp availability or invent a street address.
- Inquiry forms POST to `https://formspree.io/f/moejelao` via native JavaScript AJAX, with `name`, `email`, `projectType`, and `message` fields. Preserve bilingual loading/success/error states and drafts on failure. No client-side API keys, Forminit SDK, email-draft composition, or text-download fallback. Confirm receipt only after a successful JSON acknowledgement; never claim notification email delivery. Formspree dashboard notification recipient must be `djouridesigne@gmail.com`.
- Both inquiry forms require Cloudflare Turnstile public site key `0x4AAAAAABDo3LD4GLKBstnv`. Send a fresh `cf-turnstile-response` to Formspree and reset verification after every request. Keep the secret exclusively in Formspree; preserve bilingual retry/error states and responsive widget sizing.
- The Contact page embeds Google Maps at `36.8019335, 5.7445404`, with a direct link to the supplied Djouri design business listing. Keep its title/labels bilingual and its iframe lazy-loaded.
- Motion uses CSS, native Web Animations, and IntersectionObserver only. Keep content visible without JS, whole Arabic heading blocks, one-time reveals, fine-pointer hover and keyboard equivalents. Pause/reduced motion/background tabs must control hero camera movement. Cancel entrance effects when reduced-motion changes.
- Bound submission and JSON parsing with a 30-second AbortController deadline. Never auto-retry uncertain requests; preserve text on failure, restore controls, and reset Turnstile after every attempt. Keep loading/awaiting/verified/expired/unavailable states distinct.
- Lightbox collections come from currently visible cards; disable Previous/Next for one item, discard stale image loads, and close immediately with focus restored.
- Keep bilingual privacy notices beside both forms and Contact’s expandable `#confidentialite` section linked from every footer. Do not invent retention periods or legal assurances.
- Canonicals, sharing URLs, sitemap and robots use `https://djouri.raystate.com/`. Sharing uses the original 1280 × 720 residence poster. Initial French HTML metadata is translated at runtime; document the crawler limitation.
- Record release verification truthfully in `release-checks.md`. Owner-controlled Formspree inbox/notification delivery and real mobile Safari cannot be certified by local mocks.

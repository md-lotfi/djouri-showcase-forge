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
- Inquiry forms open an email draft addressed to `djouridesigne@gmail.com`; sending is completed by the visitor in their email application. Keep the validated local text-download fallback and never claim automatic delivery or that a message was sent. No backend email service is configured.
- The Contact page embeds Google Maps at `36.8019335, 5.7445404`, with a direct link to the supplied Djouri design business listing. Keep its title/labels bilingual and its iframe lazy-loaded.

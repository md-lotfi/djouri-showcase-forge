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

- Shared portfolio presentation and bilingual language state live in `src/components/atelier`; content pages use TanStack file routes so each page has its own share metadata.
- Language is represented by the validated `lang` search parameter and retained in navigation, allowing Arabic RTL and metadata to render consistently on direct visits.
- Uploaded project media use CDN asset pointers and optimized WebP variants to keep the repository light.
- Inquiry delivery remains disabled until an actual recipient is supplied; the form exports a local text request without pretending to send it.

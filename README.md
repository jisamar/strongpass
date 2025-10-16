# StrongPass.pro — Strong Password Generator

A fast, privacy‑friendly password and passphrase generator. 100% client‑side using Web Crypto. Mobile‑first UI, one‑click copy, presets, passphrase mode, and bulk generation.

## Features
- Instant generation (Web Crypto) — no server roundtrips
- Strength meter (zxcvbn with graceful fallback)
- Presets for Microsoft, Apple, Banking
- Advanced rules: exclude similar, require each type, no repeated adjacent
- Passphrase mode (wordlist+pronounceable filter, separators, case styles)
- Bulk generation (copy all, download .txt)
- SEO pages: How‑To, Security Guide, Common Mistakes
- Accessibility: ARIA live region, proper labels and focus states

## Local development
Because the app fetches a local wordlist file, run a local server instead of opening index.html directly.

Python:
```bash
python -m http.server 5173
# open http://127.0.0.1:5173/
```
Node (serve):
```bash
npx serve -l 5173
```

## Deployment
Any static host works (Netlify, Vercel, Cloudflare Pages, GitHub Pages). Ensure the site is served over HTTPS for the Clipboard API.

## Article publishing convention (/guide/)
All public articles live under the `guide/` directory and use canonical URLs at `/guide/<slug>.html`.

- Existing legacy copies remain under `pages/` but should have a canonical tag pointing to the `/guide/` URL.
- Internal navigation and homepage cards should link to `/guide/` URLs.
- Sitemap entries must list the `/guide/` URL with an updated `lastmod`.
- For new articles:
  1. Put the public page at `guide/<slug>.html`.
  2. If a legacy `pages/` version exists, keep it but set `<link rel="canonical" href="https://strongpass.pro/guide/<slug>.html">` and update any cross‑links to `/guide/`.
  3. Update `index.html` cards/nav to point to `/guide/`.
  4. Add the `/guide/` URL to `sitemap.xml` with the current timestamp.
  5. Ensure SEO: `og:url`, Twitter, and JSON‑LD `mainEntityOfPage.@id` and `url` use the `/guide/` URL.

### Google AdSense
1. Deploy the site and verify ownership in Google AdSense.
2. Once approved, paste your `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_ID" crossorigin="anonymous"></script>` in `index.html` head where the placeholder comment is.
3. Add ad units in strategic but user‑friendly positions (e.g., below the generator card and in content pages). Keep a clean experience.

## Privacy
All generation happens in the browser. No analytics or tracking by default. If you add analytics, please provide a privacy notice and ensure compliance.

## License
MIT

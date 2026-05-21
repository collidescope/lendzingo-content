# Lendzingo Content Site

Editorial content site for `content.lendzingo.com`, built with Next.js 14 (App Router) and Tailwind CSS.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/home-equity`.

## Deployment (Vercel)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Framework is auto-detected as Next.js — click **Deploy**
4. Note the `.vercel.app` preview URL

## Connecting `content.lendzingo.com`

After the first deploy:

1. In the Vercel project → **Settings → Domains** → add `content.lendzingo.com`
2. Vercel will show a CNAME record like:
   ```
   Type:  CNAME
   Name:  content
   Value: cname.vercel-dns.com
   ```
3. Log in to GoDaddy (or wherever `lendzingo.com` DNS is managed)
4. Add the CNAME record above under **DNS Management**
5. DNS propagates within minutes to a few hours

## Brand Colors

Defined in `tailwind.config.js` under the `lendzingo` namespace. Update these if the brand evolves:

| Token | Hex | Usage |
|---|---|---|
| `lendzingo-green` | `#1B6B45` | CTAs, accents, active states |
| `lendzingo-green-dark` | `#144F33` | Hover states |
| `lendzingo-green-light` | `#E6F4EC` | Callout backgrounds, pill tags |
| `lendzingo-ink` | `#12201A` | Body text, headings |
| `lendzingo-muted` | `#6B7280` | Secondary text |
| `lendzingo-bg` | `#F9FAFB` | Page backgrounds |
| `lendzingo-footer-bg` | `#0F1F14` | Footer |

## Fonts

- **Serif (headings):** Lora via `next/font/google`
- **Sans (body):** Inter via `next/font/google`

To match the exact fonts from `lendzingo.com`, inspect the live site with browser DevTools → Elements → Computed → `font-family`, then update `lib/fonts.ts`.

## Project Structure

```
app/
  layout.tsx           ← shared header + footer
  page.tsx             ← redirects to /home-equity
  home-equity/
    page.tsx           ← main content page

components/
  Header.tsx
  Footer.tsx
  ProductCard.tsx
  RelatedArticleCard.tsx
  ProductNavBar.tsx    ← sticky section nav with IntersectionObserver
  CalloutBox.tsx
  SolutionSection.tsx
  RelatedArticlesGrid.tsx

lib/
  fonts.ts
```

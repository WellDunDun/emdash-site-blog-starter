# EmDash Marketing + Blog Template (Cloudflare)

A combined SaaS landing page and blog template built with [EmDash](https://github.com/emdash-cms/emdash), Astro, and Cloudflare Workers. It merges the EmDash marketing and blog Cloudflare templates into one deployable site with D1, R2, CMS-managed pages, posts, search, RSS, and modular marketing blocks.

## What's Included

- Marketing homepage with hero, feature, testimonial, pricing, and FAQ blocks
- Pricing and contact pages
- Blog landing page, post archive, individual posts, category and tag archives
- Full-text search and RSS feed
- CMS-managed pages, posts, menus, taxonomies, bylines, widgets, and sections
- Cloudflare Workers runtime with D1 database and R2 media storage
- Dark/light mode

## Routes

| Page | Route |
|---|---|
| Homepage | `/` |
| Blog landing | `/blog` |
| All posts | `/posts` |
| Post detail | `/posts/[slug]` |
| Categories | `/category/[slug]` |
| Tags | `/tag/[slug]` |
| CMS pages | `/pages/[slug]` |
| Pricing | `/pricing` |
| Contact | `/contact` |
| Search | `/search` |
| RSS | `/rss.xml` |
| Admin | `/_emdash/admin` |

## Local Development

```bash
pnpm install
pnpm bootstrap
pnpm dev
```

## Cloudflare

`wrangler.jsonc` defines:

- Worker name: `saas-landing-page`
- D1 binding: `DB`
- R2 binding: `MEDIA`
- Worker loader binding: `LOADER`

Create/update the matching Cloudflare resources for your account, then deploy:

```bash
pnpm deploy
```

## Customization

- Theme variables live in `src/styles/theme.css`.
- Shared layout, search, footer, and global controls live in `src/layouts/Base.astro`.
- Marketing block renderers live in `src/components/blocks/`.
- Blog components live in `src/components/PostCard.astro` and `src/components/TagList.astro`.

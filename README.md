# SaaS Site + Blog Template (Cloudflare)

A combined SaaS site and blog template built with [EmDash](https://github.com/emdash-cms/emdash), Astro, and Cloudflare Workers. It merges the EmDash marketing and blog Cloudflare templates into one deployable site with D1, R2, CMS-managed pages, posts, search, RSS, and modular marketing blocks.

## What's Included

- Marketing homepage with hero, feature, testimonial, pricing, and FAQ blocks
- Pricing and contact pages
- Blog home, post archive, individual posts, category and tag archives
- Full-text search and RSS feed
- CMS-managed pages, posts, menus, taxonomies, bylines, widgets, and sections
- Cloudflare Workers runtime with D1 database and R2 media storage
- Dark/light mode

## Routes

| Page | Route |
|---|---|
| Homepage | `/` |
| Blog home | `/blog` |
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
pnpm dev -- --host 127.0.0.1
```

## Creating a New SaaS Project

Create a repo from this template, then run the initializer once:

```bash
gh repo create acme-analytics --template WellDunDun/saas-landing-page --private --clone
cd acme-analytics
pnpm install
pnpm init:project acme-analytics --title "Acme Analytics" --tagline "Operational analytics for SaaS teams"
```

The initializer updates `package.json`, `wrangler.jsonc`, `seed/seed.json`, and the README heading with project-specific names.

## Copy-Paste Agent Prompt

Use this prompt when handing a newly-created repo to a coding agent:

```text
Set up this repo as a new SaaS site + blog from the template.

Project slug: acme-analytics
Display title: Acme Analytics
Tagline: Operational analytics for SaaS teams

Do the full setup:
1. Run pnpm install.
2. Run pnpm init:project acme-analytics --title "Acme Analytics" --tagline "Operational analytics for SaaS teams".
3. Create/update Cloudflare resources with Wrangler:
   - pnpm exec wrangler d1 create acme-analytics --binding DB --update-config
   - pnpm exec wrangler r2 bucket create acme-analytics-media --binding MEDIA --update-config
4. Confirm wrangler.jsonc still has the DB binding, MEDIA binding, LOADER worker loader, nodejs_compat flag, and src/worker.ts entrypoint.
5. Run pnpm typecheck and pnpm build.
6. Start pnpm dev -- --host 127.0.0.1 and smoke test /, /blog, /posts, /pricing, /contact, /search, and /rss.xml.
7. Replace placeholder copy/assets only where needed for the product, then commit the setup changes.
```

## Cloudflare

`wrangler.jsonc` defines:

- Worker name: `saas-site-blog`
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

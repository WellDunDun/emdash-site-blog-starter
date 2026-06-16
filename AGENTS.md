This is a combined SaaS site + blog built with EmDash and Astro for Cloudflare Workers.

## Commands

```bash
pnpm install
npx emdash dev        # Start dev server, run migrations/seeding, generate types
npx emdash types      # Regenerate TypeScript types from schema
pnpm build            # Build for Cloudflare Workers
pnpm deploy           # Build and deploy with Wrangler
pnpm init:project     # Rename a generated project from this template
pnpm setup:cloudflare # Create D1/R2 resources with Wrangler
pnpm smoke:test       # Check key public routes against a running dev/prod URL
```

The admin UI is at `http://localhost:4321/_emdash/admin`.

## Runtime

- Adapter: `@astrojs/cloudflare`
- Database: Cloudflare D1 via binding `DB`
- Media storage: Cloudflare R2 via binding `MEDIA`
- Plugin sandbox loader: binding `LOADER`
- Worker entrypoint: `src/worker.ts`
- Wrangler config: `wrangler.jsonc`

## Key Files

| File | Purpose |
| --- | --- |
| `astro.config.mjs` | Astro + EmDash config, D1/R2 bindings, marketing blocks plugin, forms/webhook plugins |
| `seed/seed.json` | Combined schema and demo content for pages, posts, taxonomies, menus, widgets, sections, bylines |
| `src/live.config.ts` | EmDash live collection loader registration |
| `src/layouts/Base.astro` | Shared shell with menus, live search, SEO, widgets, theme controls, EmDash page hooks |
| `src/components/blocks/` | Marketing Portable Text block renderers |
| `src/components/PostCard.astro` | Blog post card renderer |
| `src/pages/` | Server-rendered Astro routes |
| `src/styles/theme.css` | User-facing theme override file |

## Skills

Agent skills are in `.agents/skills/`. Load them when working on specific tasks:

- **building-emdash-site** -- Querying content, rendering Portable Text, schema design, seed files, menus, widgets, search, SEO, comments, bylines.
- **creating-plugins** -- Building EmDash plugins with hooks, storage, admin UI, API routes, and Portable Text block types.
- **emdash-cli** -- CLI commands for content management, seeding, type generation, and visual editing flow.

## Documentation

The EmDash docs are available as an MCP server at `https://docs.emdashcms.com/mcp`. Astro docs are available at `https://mcp.docs.astro.build/mcp`. When verifying CMS APIs, hooks, config options, field types, routes, server rendering, assets, integrations, or Cloudflare behavior, use the relevant live documentation rather than relying on memory.

This template ships with `.codex/config.toml`, `.mcp.json`, `.cursor/mcp.json`, and `.vscode/mcp.json` so Codex, Claude Code style workflows, Cursor, and VS Code can discover the docs servers.

## Content Model

- `pages`: marketing/CMS pages with `title` and Portable Text `content`; supports drafts, revisions, search, and SEO.
- `posts`: blog posts with `title`, `featured_image`, `content`, and `excerpt`; supports drafts, revisions, search, SEO, comments, taxonomies, and bylines.
- Taxonomies: `category` and `tag` apply to posts.
- Menus: `primary`, `footer_product`, `footer_company`, `footer_support`.
- Widget areas: `sidebar` and `footer`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Marketing homepage from the `home` page content |
| `/blog` | Blog home with featured/latest posts |
| `/posts` | Full post archive |
| `/posts/[slug]` | Post detail with comments, sidebar widgets, TOC, related posts |
| `/category/[slug]` | Category archive |
| `/tag/[slug]` | Tag archive |
| `/pages/[slug]` | CMS-managed static pages |
| `/pricing` | Marketing pricing page |
| `/contact` | Marketing contact page |
| `/search` | Search page |
| `/rss.xml` | RSS feed |

## Rules

- All content pages must stay server-rendered with `output: "server"`; do not add `getStaticPaths()` for CMS content.
- Image fields are objects; use `<Image image={...} />` from `emdash/ui`.
- `entry.id` is the slug for URLs. `entry.data.id` is the database ULID for APIs such as `getTermsForEntries`.
- Call `Astro.cache.set(cacheHint)` on GET pages that query content, defensively if the route also handles non-GET methods.
- Taxonomy names in queries must match seed names exactly: `category`, `tag`.
- Marketing blocks are registered by `src/plugins/marketing-blocks/` and rendered through `MarketingBlocks.astro`.

# EmDash Site + Blog Starter

An AI-ready site and blog starter built with [EmDash](https://github.com/emdash-cms/emdash), Astro, and Cloudflare Workers. It merges the EmDash marketing and blog Cloudflare templates into one deployable foundation for SaaS products, agencies, services businesses, and content-led launches with D1, R2, CMS-managed pages, posts, search, RSS, and modular marketing blocks.

## What's Included

- Marketing homepage with hero, feature, testimonial, pricing, and FAQ blocks
- Pricing and contact pages
- Blog home, post archive, individual posts, category and tag archives
- Full-text search and RSS feed
- CMS-managed pages, posts, menus, taxonomies, bylines, widgets, and sections
- Cloudflare Workers runtime with D1 database and R2 media storage
- AI-ready agent prompts and MCP configs for EmDash and Astro docs
- Project initializer, Cloudflare setup helper, route smoke test, CI workflow, and launch issue template
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

In another terminal, smoke test the running site:

```bash
pnpm smoke:test
```

## Creating a New Project

Create a repo from this template, then run the initializer once:

```bash
gh repo create brightline-studio --template WellDunDun/emdash-site-blog-starter --private --clone
cd brightline-studio
pnpm install
pnpm init:project brightline-studio --title "Brightline Studio" --tagline "Launch-ready websites for ambitious teams"
pnpm setup:cloudflare brightline-studio
```

The initializer updates `package.json`, `wrangler.jsonc`, `seed/seed.json`, and the README heading with project-specific names.
The Cloudflare setup helper creates D1/R2 resources with Wrangler and updates `wrangler.jsonc`; review the config after it runs.

## Agent Docs, Skill, and Prompts

This template ships MCP configs for agents that support repo-local MCP:

- EmDash Docs: `https://docs.emdashcms.com/mcp`
- Astro Docs: `https://mcp.docs.astro.build/mcp`

Configured files:

- `.codex/config.toml` for Codex CLI and the Codex IDE extension in trusted projects
- `.mcp.json` for tools that read root MCP config, including Claude Code style workflows
- `.cursor/mcp.json` for Cursor
- `.vscode/mcp.json` for VS Code

Use the repo-local interview skill when the agent supports skills:

- `.agents/skills/emdash-site-blog-starter/SKILL.md` interviews for the project brief, then drives setup, content customization, image direction, Cloudflare readiness, and launch checks.

Reusable fallback prompts live in `docs/prompts/`:

- `new-project-agent.md` for complete project setup
- `content-customization.md` for rewriting seeded product, service, or agency content
- `og-image.md` for generating a production Open Graph image

## Copy-Paste Agent Prompt

Use this prompt when handing a newly-created repo to a coding agent that cannot load repo skills, or use `docs/prompts/new-project-agent.md` for the longer version:

```text
Set up this repo as a new AI-ready site + blog from the template.

If you can load repo skills, use .agents/skills/emdash-site-blog-starter/SKILL.md first and interview me for missing project details before editing.

Project slug: brightline-studio
Display title: Brightline Studio
Tagline: Launch-ready websites for ambitious teams

Do the full setup:
1. Run pnpm install.
2. Run pnpm init:project brightline-studio --title "Brightline Studio" --tagline "Launch-ready websites for ambitious teams".
3. Create/update Cloudflare resources with pnpm setup:cloudflare brightline-studio.
4. Confirm wrangler.jsonc still has the DB binding, MEDIA binding, LOADER worker loader, nodejs_compat flag, and src/worker.ts entrypoint.
5. Run pnpm typecheck and pnpm build.
6. Start pnpm dev -- --host 127.0.0.1 and run pnpm smoke:test.
7. Use docs/prompts/og-image.md to create a 1200x630 Open Graph image.
8. Replace placeholder copy/assets only where needed for the project, then commit the setup changes.
```

## Cloudflare

`wrangler.jsonc` defines:

- Worker name: `emdash-site-blog-starter`
- D1 binding: `DB`
- R2 binding: `MEDIA`
- Worker loader binding: `LOADER`

Create/update the matching Cloudflare resources for your account, then deploy:

```bash
pnpm deploy
```

## Go-Live Checklist

Use this before pointing production traffic at a new site + blog.

### Product and Content

- Replace placeholder product copy across the homepage, pricing page, contact page, and seeded blog posts.
- Update site title, tagline, menus, footer links, contact email addresses, and social/RSS references.
- Replace the default hero artwork, favicon, logo, Open Graph image, and any placeholder media.
- Add real legal/support pages: privacy policy, terms, security, status, docs, and support/contact routes as needed.
- Review pricing tiers, CTA URLs, and forms so every conversion path goes to a real destination.

### Cloudflare

- Create the production D1 database and R2 bucket, then confirm `wrangler.jsonc` has the production `database_id`, `DB` binding, `MEDIA` binding, and `LOADER` worker loader.
- Confirm Worker name, compatibility date, `nodejs_compat`, and `src/worker.ts` entrypoint are correct.
- Configure production secrets and vars with Wrangler or the Cloudflare dashboard.
- Deploy once with `pnpm deploy`, then verify the Worker URL before adding a custom domain.
- Add the custom domain, DNS records, redirects, and canonical host policy.

### CMS and Data

- Open `/_emdash/admin` on production and confirm the admin loads.
- Confirm seed content, collections, taxonomies, bylines, menus, widgets, and sections are present.
- Create production admin users and remove or rotate any local/test credentials.
- Upload at least one media item to verify R2 storage and public media URLs.
- Decide how production data will be backed up or exported before launch.

### Quality

- Run `pnpm typecheck` and `pnpm build`.
- Smoke test `/`, `/blog`, `/posts`, `/pricing`, `/contact`, `/search`, `/rss.xml`, and `/_emdash/admin`.
- Test light mode, dark mode, mobile navigation, search, RSS, post pages, category/tag archives, comments, forms, and 404 handling.
- Check metadata for title tags, descriptions, canonical URLs, robots directives, sitemap/feed expectations, and social previews.
- Run a quick accessibility pass for keyboard navigation, focus states, labels, contrast, and heading order.
- Run a quick performance pass on the homepage and a post page, especially images, fonts, and Worker response time.

### Launch

- Deploy production and verify the custom domain over HTTPS.
- Submit or update search console properties and analytics if used.
- Send test form submissions and verify notification/webhook delivery.
- Monitor Worker logs, failed requests, form errors, and CMS auth issues after launch.
- Tag the release or record the deployed commit SHA so rollback is straightforward.

## Useful Next Additions

- A real Open Graph image generator script that emits PNG/JPG from the project title, tagline, and brand colors.
- A sitemap route and robots policy tuned for production.
- Optional analytics, product-event, and email provider adapters that can be enabled per project.
- A stronger `setup:cloudflare` flow that detects existing D1/R2 resources and can configure custom domains.
- A release script that creates a go-live issue, deploys, smoke tests production, and records the deployed commit SHA.

## Customization

- Theme variables live in `src/styles/theme.css`.
- Shared layout, search, footer, and global controls live in `src/layouts/Base.astro`.
- Marketing block renderers live in `src/components/blocks/`.
- Blog components live in `src/components/PostCard.astro` and `src/components/TagList.astro`.
- Prompt templates live in `docs/prompts/`.

## License

MIT

# New Project Agent Prompt

```text
Set up this repo as a new SaaS site + blog from the template.

Project slug: acme-analytics
Display title: Acme Analytics
Tagline: Operational analytics for SaaS teams
Audience: B2B SaaS founders and operators
Primary CTA: Book a demo
Secondary CTA: Read the blog

Use the configured MCP docs before changing framework or CMS code:
- EmDash Docs for CMS schema, content, plugins, widgets, media, search, and admin behavior.
- Astro Docs for Astro routing, server rendering, assets, fonts, integrations, and Cloudflare deployment behavior.

Do the full setup:
1. Run pnpm install.
2. Run pnpm init:project acme-analytics --title "Acme Analytics" --tagline "Operational analytics for SaaS teams".
3. Create/update Cloudflare resources with pnpm setup:cloudflare acme-analytics.
4. Confirm wrangler.jsonc still has the DB binding, MEDIA binding, LOADER worker loader, nodejs_compat flag, and src/worker.ts entrypoint.
5. Replace placeholder homepage, pricing, contact, and seeded blog content with product-specific content.
6. Create or request an Open Graph image using docs/prompts/og-image.md, then wire it into the site metadata/media as appropriate.
7. Run pnpm typecheck and pnpm build.
8. Start pnpm dev -- --host 127.0.0.1 and smoke test /, /blog, /posts, /pricing, /contact, /search, and /rss.xml.
9. Open a go-live checklist issue from .github/ISSUE_TEMPLATE/go-live-checklist.md.
10. Commit the setup changes.
```

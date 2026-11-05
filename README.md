# EmDash Site + Blog Starter

A reusable website and blog built with Astro 7, EmDash 1, Tailwind 4, and Cloudflare Workers. Includes CMS-managed marketing blocks, posts, search, RSS, automatic sitemaps, light/dark themes, and a component reference.

## Start locally

Requires Node 22.16 or newer and Corepack.

```bash
corepack enable
pnpm install
pnpm dev --host 127.0.0.1
```

In another terminal, initialize the optional local demo content and development admin:

```bash
pnpm setup:dev
```

Open `http://127.0.0.1:4321`. The CMS is at `/_emdash/admin`. `setup:dev` only accepts loopback URLs and uses EmDash's development-only setup endpoint. Production uses the normal account setup wizard. An empty first page before setup is expected; the runtime seeds the schema first, and sample content is applied during setup.

## Create your project

```bash
gh repo create my-site --template WellDunDun/emdash-site-blog-starter --private --clone
cd my-site
pnpm install
pnpm init:project my-site --title "My Site" --tagline "What your site is for" --site https://your-domain.com --email hello@your-domain.com
pnpm exec playwright install chromium
pnpm generate:og
```

The initializer updates the package/Worker/resource names, seed identity, public URL, contact address, and README heading. Run it before first setup. Updating a seed file does not overwrite an existing CMS database. Use the CMS or an explicit migration for an existing site.

`site.config.json` holds public configuration. The URL is used by Astro, EmDash, canonical links, feeds, and sitemaps. `SITE_URL` can override it at build time. The component reference and sites without a public URL are marked `noindex` in page metadata.

## Styling

- `src/styles/tokens.css`: default colors, typography, spacing, shape, and light/dark modes.
- `src/styles/theme.css`: project brand overrides.
- `src/styles/global.css`: Tailwind integration, semantic utilities, focus, and reduced motion.
- `/design-system`: working component reference.

Use semantic utilities such as `bg-canvas`, `bg-surface`, `text-foreground`, `text-muted`, `text-brand`, and `rounded-control`. Existing CMS blocks use the same runtime tokens. Tailwind Preflight is omitted to preserve the CMS-aware reset. See [the design-system guide](docs/design-system.md).

## Routes

| Route | Purpose |
| --- | --- |
| `/` | CMS marketing homepage |
| `/pricing` | Clearly labeled sample pricing layout |
| `/contact` | Contact page with configurable webhook delivery |
| `/blog` | Featured and recent posts |
| `/posts` | Post archive |
| `/posts/[slug]` | Post, bylines, taxonomy, comments, related content |
| `/category/[slug]`, `/tag/[slug]` | Taxonomy archives |
| `/pages/[slug]` | CMS pages |
| `/search` | Full-text search |
| `/rss.xml` | RSS |
| `/sitemap.xml`, `/sitemap-posts.xml` | EmDash-generated sitemaps |
| `/robots.txt` | EmDash-generated robots policy |
| `/design-system` | Component reference, excluded from indexing |
| `/_emdash/admin` | CMS admin |

## Contact delivery

The form is unavailable until `CONTACT_WEBHOOK_URL` is configured. It never logs a message or reports successful delivery without an accepting receiver.

For development, copy `.dev.vars.example` to `.dev.vars` and set your local receiver. For production:

```bash
pnpm exec wrangler secret put CONTACT_WEBHOOK_URL
pnpm exec wrangler secret put CONTACT_WEBHOOK_TOKEN
```

The token is optional. The receiver must accept a JSON POST containing `name`, `email`, `company`, and `message`, and return a 2xx status only after accepting it. Configure your receiver to persist messages or send email. This starter does not configure an email provider. Production requires HTTPS and rejects redirects; delivery has a ten-second timeout. Requests are checked for same-origin submission, bounded size, valid fields, honeypot spam, and the Cloudflare rate limit. No submission content is logged by the handler.

See [launch configuration](docs/launch.md) for bindings and live verification.

## Verification

```bash
pnpm test
pnpm typecheck
pnpm build
pnpm smoke:test
pnpm exec playwright install chromium
pnpm test:browser
```

`test` exercises validation and real HTTP webhook acceptance/rejection. Browser tests initialize local sample content, check rendered content and mobile overflow, run WCAG A/AA scans across eight routes in light/dark modes at 375px/1280px, and check themes, keyboard access, reduced motion, feeds, and 404s. Run against disposable local state. Set `PLAYWRIGHT_CHANNEL=chrome` to use an installed Chrome instead of Playwright Chromium.

CI runs the unit tests, typecheck, build, and browser checks. Automated scans do not replace manual accessibility or production checks.

## Cloudflare

```bash
pnpm setup:cloudflare my-site
pnpm check:launch
pnpm deploy
```

The helper creates D1/R2 resources and updates Wrangler configuration. For resources you already created, supply the bindings/IDs in `wrangler.jsonc` and use `--skip-d1` or `--skip-r2` as appropriate. Review the config before deploying.

The Worker uses D1 `DB`, R2 `MEDIA`, the `LOADER` sandbox loader, and `CONTACT_RATE_LIMITER`. The Astro adapter adds `SESSION`, `IMAGES`, and `ASSETS`. The official EmDash Worker entry and a minute cron trigger run scheduled publishing and maintenance.

`deploy` first checks public launch configuration. The generic template intentionally fails that check until initialized. Read the [launch checklist](docs/launch.md) before directing production traffic to a new site.

## Agent setup

`AGENTS.md`, `.agents/skills/`, and `docs/prompts/` describe setup and content workflows. Repository-local MCP configs support Codex, Claude-style clients, Cursor, and VS Code:

- EmDash docs: `https://docs.emdashcms.com/mcp`
- Astro docs: `https://mcp.docs.astro.build/mcp`

Start with `.agents/skills/emdash-site-blog-starter/SKILL.md` when configuring a business site. Use real offers, links, pricing, and proof. The seed contains example content, not customer claims.

## License

MIT

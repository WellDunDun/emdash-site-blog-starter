# Launch a generated site

This repository ships a template. Each generated site needs its own public URL, content, account configuration, and delivery destination.

1. Run `init:project` with the real title, tagline, `--site` HTTPS origin, and `--email`. Replace sample prices, posts, bylines, artwork, and any example widgets. Add legal/support pages appropriate to your project; do not publish invented legal terms or proof.
2. Override design tokens in `theme.css`. Check both modes at `/design-system`. Update the favicon and run `pnpm generate:og` after changing site identity. Replace the generated image with branded artwork if needed.
3. Create D1/R2 resources using `setup:cloudflare`, or configure existing resource IDs yourself. Keep `DB`, `MEDIA`, `LOADER`, the rate-limit binding, and the cron trigger. The rate-limit key includes the site origin, so sites do not share counters even if they reuse the sample namespace. Use a unique namespace ID if your account requires isolated configuration.
4. Configure `CONTACT_WEBHOOK_URL` and optionally `CONTACT_WEBHOOK_TOKEN` as Wrangler secrets. The receiver owns message persistence and email delivery. Test a real submission and confirm it appears at the receiver. Check failure feedback too. The default limit is five attempts per minute per IP in each Cloudflare location; shared networks may reach it together.
5. Run tests, typecheck, build, and browser checks. `wrangler deploy --dry-run` validates the bundle without creating a deployment. Public configuration must pass `pnpm check:launch` before `pnpm deploy`.
6. Deploy to the Worker URL first. Complete the production account setup wizard. Verify authenticated admin access, a media upload and its served URL, published content, search, comments, and contact delivery. Production passkeys require the account owner; local dev bypass is not proof of production sign-in.
7. Add the custom domain, DNS, HTTPS, and host redirect policy in Cloudflare. Build with the final public URL. Verify canonical tags, social preview PNG, robots.txt, sitemap.xml and per-collection sitemaps, RSS URLs, and 404 status codes. Search and the component reference should stay out of indexing.
8. Set up D1 backups/exports and media retention. Record the deployed commit and Worker version. Inspect Worker errors and submission failures after launch.

## Existing deployments

Back up the database and media before upgrading an existing site. EmDash's migration manifest is tracked in `.emdash/migrations.json`; deploy the manifest with the updated code. See the official [schema evolution guide](https://docs.emdashcms.com/deployment/schema-evolution/). Seed changes apply to new setups and do not replace existing content automatically. The template's checks do not constitute a migration or verification of any existing production database.

## Runtime references

- [Cloudflare deployment and scheduled publishing](https://docs.emdashcms.com/deployment/cloudflare/)
- [Cloudflare rate-limit binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Astro 7 migration](https://docs.astro.build/en/guides/upgrade-to/v7/)
- [Tailwind with Astro](https://tailwindcss.com/docs/installation/framework-guides/astro)

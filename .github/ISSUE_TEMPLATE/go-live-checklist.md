---
name: Go-live checklist
about: Track production launch readiness for a generated site + blog
title: "Go live: "
labels: launch
assignees: ""
---

## Product and Content

- [ ] Replace placeholder product copy across homepage, pricing, contact, and seeded blog posts.
- [ ] Update site title, tagline, menus, footer links, contact email addresses, and social/RSS references.
- [ ] Replace default hero artwork, favicon, logo, Open Graph image, and placeholder media.
- [ ] Add real legal/support pages: privacy policy, terms, security, status, docs, and support/contact routes as needed.
- [ ] Review pricing tiers, CTA URLs, and forms so every conversion path goes to a real destination.

## Cloudflare

- [ ] Create production D1 database and R2 bucket.
- [ ] Confirm `wrangler.jsonc` has the production `database_id`, `DB` binding, `MEDIA` binding, and `LOADER` worker loader.
- [ ] Confirm Worker name, compatibility date, `nodejs_compat`, and `src/worker.ts` entrypoint are correct.
- [ ] Configure production secrets and vars.
- [ ] Deploy once with `pnpm deploy` and verify the Worker URL.
- [ ] Add custom domain, DNS records, redirects, and canonical host policy.

## CMS and Data

- [ ] Open `/_emdash/admin` on production and confirm the admin loads.
- [ ] Confirm seed content, collections, taxonomies, bylines, menus, widgets, and sections are present.
- [ ] Create production admin users and remove or rotate local/test credentials.
- [ ] Upload at least one media item to verify R2 storage and public media URLs.
- [ ] Decide how production data will be backed up or exported.

## Quality

- [ ] Run `pnpm typecheck`.
- [ ] Run `pnpm build`.
- [ ] Smoke test `/`, `/blog`, `/posts`, `/pricing`, `/contact`, `/search`, `/rss.xml`, and `/_emdash/admin`.
- [ ] Test light mode, dark mode, mobile navigation, search, RSS, post pages, category/tag archives, comments, forms, and 404 handling.
- [ ] Check title tags, descriptions, canonical URLs, robots directives, sitemap/feed expectations, and social previews.
- [ ] Run a quick accessibility pass for keyboard navigation, focus states, labels, contrast, and heading order.
- [ ] Run a quick performance pass on the homepage and a post page.

## Launch

- [ ] Deploy production and verify the custom domain over HTTPS.
- [ ] Submit or update search console properties and analytics if used.
- [ ] Send test form submissions and verify notification/webhook delivery.
- [ ] Monitor Worker logs, failed requests, form errors, and CMS auth issues after launch.
- [ ] Tag the release or record the deployed commit SHA.

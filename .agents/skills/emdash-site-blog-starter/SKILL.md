---
name: emdash-site-blog-starter
description: Interview users and configure EmDash Site + Blog Starter projects end to end. Use when starting or customizing a project from this starter, gathering launch information, generating project setup prompts, planning Open Graph/blog images, or preparing an AI-ready site and blog for Cloudflare.
---

# EmDash Site + Blog Starter

Use this skill to turn a rough project idea into a configured, AI-ready EmDash site and blog. Interview first, then execute.

## When To Interview

Interview the user when any of these are missing and the task depends on them:

- Project slug, display title, and tagline.
- Project type: product, SaaS, agency, service business, portfolio, publication, or other.
- Audience, problem, desired outcome, and differentiator.
- Primary CTA, secondary CTA, and real destinations for forms or links.
- Core offers, services, features, pricing model, or case-study needs.
- Tone, brand references, colors, logo/media availability, and visual constraints.
- Blog strategy: categories, first three post angles, author/byline expectations.
- Cloudflare intent: local only, preview deploy, production deploy, custom domain, D1/R2 names.

Ask a compact batch of questions instead of one question at a time unless one answer blocks all progress. If the user only has a rough idea, ask for the minimum viable brief: name, audience, offer/outcome, CTA, and tone. Make reasonable assumptions for the rest and label them clearly.

## Intake Questions

Use or adapt this interview:

1. What is the project name, preferred slug, and one-sentence tagline?
2. What kind of site is this: product, SaaS, agency, service business, portfolio, publication, or something else?
3. Who is the primary audience, and what problem or desired outcome should the homepage speak to?
4. What are the main offers, services, features, or proof points that must appear on the site?
5. What should the primary and secondary CTAs say, and where should they go?
6. What tone should the copy use? Share reference brands/sites if useful.
7. Do you have brand colors, logo, hero media, or should the agent choose temporary defaults?
8. What should the blog cover? Give three starter post topics if you have them.
9. Are we setting up Cloudflare now? If yes, provide desired Worker/D1/R2 names and any custom domain.
10. Should the agent create an Open Graph image prompt, generate image assets, or leave image generation as a follow-up?

## Execution Workflow

1. Summarize the brief back to the user before making broad content changes.
2. Use the configured EmDash and Astro MCP docs before changing CMS schema, Portable Text assumptions, Astro routing, server rendering, assets, or Cloudflare behavior.
3. Run pnpm install if dependencies are missing.
4. Run pnpm init:project <slug> --title "<Title>" --tagline "<Tagline>" --site https://<domain> --email <contact-email> for fresh projects. Apply local sample content with pnpm setup:dev after starting pnpm dev.
5. Run pnpm setup:cloudflare <slug> only when the user wants Cloudflare resources created or updated.
6. Customize seeded homepage, pricing/contact pages, menus, metadata, and the first blog posts using the approved brief.
7. Prepare Open Graph/blog image direction from the visual brief. Use docs/prompts/og-image.md as the fallback template.
8. Verify with pnpm test, pnpm typecheck, pnpm build, pnpm test:browser, and pnpm smoke:test. Browser checks operate on disposable local state. Read docs/launch.md before production setup.
9. Open or update a go-live checklist issue from .github/ISSUE_TEMPLATE/go-live-checklist.md when launch preparation is in scope.
10. Commit setup changes only when asked, or when the surrounding task already includes committing/pushing as the expected workflow.

## Output Shape

After the interview, produce a concise project brief with these fields:

- Name / slug
- Site type
- Audience
- Promise
- Offers / proof
- CTAs
- Tone
- Blog topics
- Visual direction
- Cloudflare/deploy notes
- Assumptions

Then state the exact commands and files the agent will touch. Keep the user-facing setup prompt copy-pasteable when handing work to another agent.

## Guardrails

- Do not assume the site is SaaS-only; agencies, services, portfolios, and publications are first-class use cases.
- Do not invent final legal, pricing, analytics, or domain details. Mark placeholders that need owner review.
- Keep content pages server-rendered and respect the EmDash image-field/object rules from the building-emdash-site skill.
- Preserve Cloudflare bindings: DB, MEDIA, LOADER, nodejs_compat, and src/worker.ts.

# Design system

The site uses Tailwind 4 through the Vite plugin. Preflight is omitted to preserve the existing CMS-aware reset. Existing marketing blocks keep their semantic CSS.

- `src/styles/tokens.css` owns shared defaults and system/explicit dark colors.
- `src/styles/theme.css` owns project brand overrides.
- `src/styles/global.css` declares layer order, Tailwind utilities, token mappings, focus, and reduced motion.
- `/design-system` demonstrates shared colors, actions, and a responsive card.

Use `bg-canvas`, `bg-surface`, `text-foreground`, `text-muted`, `text-brand`, `border-border`, and `rounded-control` rather than hard-coded brand values. Brand overrides are unlayered and win over defaults. Component styles may still win over utilities where Astro emits unlayered scoped CSS. Prefer utilities on new markup rather than fighting a component's own styles.

The existing mode switch sets `.light` or `.dark`. Semantic utilities read the current color tokens automatically. The `dark:` variant follows the explicit `.dark` class; use semantic colors for system preference support.

For a mode-specific override, cover both `:root.dark` and `@media (prefers-color-scheme: dark) { :root:not(.light) { ... } }`. A plain `:root` override applies to both modes.

Before release inspect `/design-system`, home, blog, a post, search, and contact at mobile and desktop widths, in both modes. Check keyboard focus, contrast, form validation, navigation, and reduced motion. This reference page is a starting component guide, not evidence that every page passes an accessibility audit.

## HeyAgents comparison, 2026-11-05

Compared with the local `agent-friends/apps/marketing` source. Live site access was unavailable during this audit.

HeyAgents uses a separate tokens file, brand overrides, CMS blocks, custom artwork, and custom CSS. It does not declare Tailwind. Its package manifest uses Astro 7, EmDash 0.37, and Cloudflare adapter 14. The updated starter uses Astro 7.4.5, EmDash 1.4.0, and adapter 14.4.4. It also includes the official scheduled Worker entry and cron trigger.

Do not copy HeyAgents' product-specific auth, download flows, floral artwork, or accumulated CSS overrides into a general starter. Reuse its separation of defaults from brand choices.

The starter includes canonical host configuration, built-in EmDash sitemaps/robots, configurable webhook contact delivery, default social preview assets, and repeatable browser checks. Each generated site still needs its actual content, Cloudflare resources, domain, and webhook receiver. See `docs/launch.md`.

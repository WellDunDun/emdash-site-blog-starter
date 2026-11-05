import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeAll(async ({ request }) => {
  test.setTimeout(120000);
  const setup = await request.get("/_emdash/api/setup/dev-bypass?redirect=/");
  expect(setup.ok()).toBe(true);
});

for (const mode of ["light", "dark"]) {
  for (const width of [375, 1280]) {
    test(`${mode} at ${width}px: shared routes, accessibility, and layout`, async ({ page, context }) => {
      await context.addCookies([{ name: "theme", value: mode, url: "http://127.0.0.1:4321" }]);
      await page.setViewportSize({ width, height: 900 });
      for (const route of ["/", "/design-system", "/pricing", "/blog", "/posts", "/posts/building-for-the-long-term", "/search", "/contact"]) {
        const response = await page.goto(route);
        expect(response.status(), route).toBe(200);
        if (route === "/") await expect(page.getByRole("heading", { name: "Your website. Your publishing workflow." })).toBeVisible();
        if (route === "/posts/building-for-the-long-term") await expect(page.getByRole("heading", { name: "Building for the Long Term", exact: true })).toBeVisible();
        expect(await page.locator("html").getAttribute("class")).toContain(mode);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
        const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
        expect(audit.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target) })), route).toEqual([]);
      }
      await page.goto("/design-system");
      const card = page.getByText("Canvas", { exact: true });
      expect(await card.evaluate(el => getComputedStyle(el).backgroundColor)).toBe(mode === "dark" ? "rgb(13, 13, 13)" : "rgb(255, 255, 255)");
      await page.keyboard.press("Tab");
      await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator("#main-content")).toBeInViewport();
    });
  }
}

test("missing content returns 404, previews stay unindexed, feeds resolve", async ({ request }) => {
  for (const route of ["/missing-page", "/posts/missing-post", "/pages/missing-page"]) expect((await request.get(route)).status()).toBe(404);
  const gallery = await request.get("/design-system");
  expect(await gallery.text()).toContain("noindex");
  for (const route of ["/rss.xml", "/sitemap.xml", "/sitemap-posts.xml", "/robots.txt", "/favicon.svg", "/og-image.png"]) expect((await request.get(route)).status(), route).toBe(200);
});

test("theme controls persist and reduced-motion is respected", async ({ page }) => {
  await page.goto("/design-system");
  await page.getByRole("button", { name: "Dark mode", exact: true }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Light mode", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/light/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.locator("html").evaluate(el => getComputedStyle(el).scrollBehavior)).toBe("auto");
});

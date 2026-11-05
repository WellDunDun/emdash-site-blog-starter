#!/usr/bin/env node
const baseUrl = process.env.SMOKE_BASE_URL || process.argv[2] || "http://127.0.0.1:4321";
const routes = ["/", "/blog", "/posts", "/pricing", "/contact", "/search", "/design-system", "/rss.xml", "/sitemap.xml", "/robots.txt", "/favicon.svg", "/og-image.png"];
let failed = false;
for (const route of [...routes, "/this-route-does-not-exist"]) {
  const url = new URL(route, baseUrl);
  try {
    const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000) });
    const expected = route === "/this-route-does-not-exist" ? 404 : 200;
    const ok = response.status === expected;
    await response.body?.cancel();
    console.log(`${ok ? "OK  " : "FAIL"} ${response.status} ${url.href}`);
    if (!ok) failed = true;
  } catch (error) {
    failed = true;
    console.log(`FAIL ERR ${url.href}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
if (failed) process.exitCode = 1;

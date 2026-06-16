#!/usr/bin/env node

const baseUrl = process.env.SMOKE_BASE_URL || process.argv[2] || "http://localhost:4321";
const routes = [
	"/",
	"/blog",
	"/posts",
	"/pricing",
	"/contact",
	"/search",
	"/rss.xml",
];

let failed = false;

for (const route of routes) {
	const url = new URL(route, baseUrl);

	try {
		const response = await fetch(url, { redirect: "manual" });
		const status = response.status;
		const ok = status >= 200 && status < 400;
		console.log((ok ? "OK   " : "FAIL ") + status + " " + url.href);

		if (!ok) failed = true;
	} catch (error) {
		failed = true;
		console.log("FAIL ERR " + url.href);
		console.log(error instanceof Error ? error.message : String(error));
	}
}

if (failed) {
	process.exit(1);
}

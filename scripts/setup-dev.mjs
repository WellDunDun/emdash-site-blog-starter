#!/usr/bin/env node
const base = new URL(process.argv[2] || "http://127.0.0.1:4321");
if (!["127.0.0.1", "localhost", "[::1]"].includes(base.hostname)) throw new Error("setup:dev only accepts loopback URLs.");
const response = await fetch(new URL("/_emdash/api/setup/dev-bypass?redirect=/", base));
if (!response.ok) throw new Error(`Local setup failed with HTTP ${response.status}. Start pnpm dev first.`);
console.log("Local demo content and dev admin are ready. Open /_emdash/admin on the local site.");

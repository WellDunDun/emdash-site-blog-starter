#!/usr/bin/env node
import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync("site.config.json", "utf8"));
const failures = [];
try {
  const url = new URL(process.env.SITE_URL || config.url);
  if (url.protocol !== "https:" || url.hostname.endsWith(".example") || ["localhost", "example.com"].includes(url.hostname)) failures.push("Set a real HTTPS site URL with init:project --site.");
} catch { failures.push("Set the public site URL with init:project --site."); }
if (!config.contactEmail || config.contactEmail.endsWith(".example") || config.contactEmail.endsWith("@example.com")) failures.push("Set your contact address with init:project --email.");
const seed = JSON.parse(readFileSync("seed/seed.json", "utf8"));
if (seed.settings.title === "EmDash Starter") failures.push("Initialize the site name and customize sample content before launch.");
if (failures.length) {
  failures.forEach(message => console.error("FAIL " + message));
  process.exitCode = 1;
} else {
  console.log("Public configuration checks passed. Verify Cloudflare bindings, secrets, legal content, and delivery using docs/launch.md before directing traffic here.");
}

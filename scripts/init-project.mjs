#!/usr/bin/env node

import fs from "node:fs";

const args = process.argv.slice(2);
const projectName = args[0];

if (!projectName || projectName === "--help" || projectName === "-h") {
	printHelp();
	process.exit(projectName ? 0 : 1);
}

const options = parseOptions(args.slice(1));
const slug = slugify(projectName);
const title = options.title || humanize(projectName);
const tagline = options.tagline || "A website and blog you can make your own.";
let siteUrl;
if (options.site) {
  const parsed = new URL(options.site);
  if (parsed.protocol !== "https:" || parsed.pathname !== "/" || parsed.search || parsed.hash || parsed.username || parsed.password) throw new Error("--site must be an HTTPS origin, such as https://example.com");
  siteUrl = parsed.origin;
}
if (options.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(options.email)) throw new Error("--email must be a valid contact address");

if (!slug) {
	console.error("Project name must contain at least one letter or number.");
	process.exit(1);
}

updateJson("package.json", (pkg) => {
	pkg.name = slug;
});

updateJson("seed/seed.json", (seed) => {
	seed.meta = {
		...seed.meta,
		name: title + " Site + Blog Starter",
		description: "AI-ready site and blog starter content for " + title,
	};
	seed.settings = {
		...seed.settings,
		title,
		tagline,
    ...(siteUrl ? { url: siteUrl } : {}),
	};
});

updateJson("site.config.json", (config) => {
  if (siteUrl) config.url = siteUrl;
  if (options.email) config.contactEmail = options.email;
});

updateWrangler(slug);
updateReadme(title);

console.log("Initialized project: " + title);
console.log("Package/Worker name: " + slug);
console.log("Next steps:");
console.log("  pnpm install");
console.log("  pnpm dev --host 127.0.0.1");
console.log("  Create matching Cloudflare D1/R2 resources before deploy.");

function parseOptions(optionArgs) {
	const parsed = {};

	for (let index = 0; index < optionArgs.length; index += 1) {
		const arg = optionArgs[index];

    const match = arg.match(/^--(title|tagline|site|email)(?:=(.*))?$/);
    if (!match) throw new Error("Unknown option: " + arg);
    const value = match[2] ?? optionArgs[++index];
    if (!value || value.startsWith("--")) throw new Error("Missing value for " + match[1]);
    parsed[match[1]] = value;

	}

	return parsed;
}

function slugify(value) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 63);
}

function humanize(value) {
	return value
		.replace(/[-_]+/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function updateJson(filePath, updater) {
	const value = JSON.parse(fs.readFileSync(filePath, "utf8"));
	updater(value);
	fs.writeFileSync(filePath, JSON.stringify(value, null, "\t") + "\n");
}

function updateWrangler(slugValue) {
	const filePath = "wrangler.jsonc";
	let source = fs.readFileSync(filePath, "utf8");

	source = replaceJsoncString(source, "name", slugValue);
	source = replaceJsoncString(source, "database_name", slugValue);
	source = replaceJsoncString(source, "bucket_name", slugValue + "-media");

	fs.writeFileSync(filePath, source);
}

function replaceJsoncString(source, key, value) {
	const pattern = new RegExp("(\"" + key + "\"\\s*:\\s*)\"[^\"]*\"");
	return source.replace(pattern, "$1\"" + value + "\"");
}

function updateReadme(titleValue) {
	const filePath = "README.md";
	const source = fs.readFileSync(filePath, "utf8");
	fs.writeFileSync(filePath, source.replace(/^# .+$/m, "# " + titleValue));
}

function printHelp() {
	console.log(`Usage: pnpm init:project <project-name> [--title "Display Name"] [--tagline "Tagline"] [--site https://example.com] [--email hello@example.com]

Examples:
  pnpm init:project brightline-studio
  pnpm init:project brightline-studio --title "Brightline Studio" --tagline "Launch-ready websites for ambitious teams"

This updates:
  package.json
  wrangler.jsonc
  seed/seed.json
  site.config.json
  README.md`);
}

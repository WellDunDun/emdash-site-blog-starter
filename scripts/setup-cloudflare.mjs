#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";

const args = process.argv.slice(2);
const options = parseOptions(args);
const projectSlug = options.slug || readWorkerName() || readPackageName();

if (!projectSlug || options.help) {
	printHelp();
	process.exit(options.help ? 0 : 1);
}

const mediaBucket = options.mediaBucket || projectSlug + "-media";
const locationArgs = options.location ? ["--location", options.location] : [];

console.log("Setting up Cloudflare resources for " + projectSlug);

if (!options.skipD1) {
	run("pnpm", [
		"exec",
		"wrangler",
		"d1",
		"create",
		projectSlug,
		"--binding",
		"DB",
		"--update-config",
		...locationArgs,
	]);
}

if (!options.skipR2) {
	run("pnpm", [
		"exec",
		"wrangler",
		"r2",
		"bucket",
		"create",
		mediaBucket,
		"--binding",
		"MEDIA",
		"--update-config",
		...locationArgs,
	]);
}

console.log("Cloudflare setup command finished.");
console.log("Review wrangler.jsonc before deploy.");

function parseOptions(optionArgs) {
	const parsed = {};

	for (let index = 0; index < optionArgs.length; index += 1) {
		const arg = optionArgs[index];

		if (arg === "--help" || arg === "-h") {
			parsed.help = true;
			continue;
		}

		if (arg === "--skip-d1") {
			parsed.skipD1 = true;
			continue;
		}

		if (arg === "--skip-r2") {
			parsed.skipR2 = true;
			continue;
		}

		if (arg.startsWith("--location=")) {
			parsed.location = arg.slice("--location=".length);
			continue;
		}

		if (arg === "--location") {
			parsed.location = optionArgs[index + 1];
			index += 1;
			continue;
		}

		if (arg.startsWith("--media-bucket=")) {
			parsed.mediaBucket = arg.slice("--media-bucket=".length);
			continue;
		}

		if (arg === "--media-bucket") {
			parsed.mediaBucket = optionArgs[index + 1];
			index += 1;
			continue;
		}

		if (!parsed.slug) {
			parsed.slug = arg;
		}
	}

	return parsed;
}

function readWorkerName() {
	if (!fs.existsSync("wrangler.jsonc")) return null;

	const source = fs.readFileSync("wrangler.jsonc", "utf8");
	const match = source.match(/"name"\s*:\s*"([^"]+)"/);
	return match?.[1] ?? null;
}

function readPackageName() {
	if (!fs.existsSync("package.json")) return null;

	const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
	return typeof pkg.name === "string" ? pkg.name.split("/").at(-1) : null;
}

function run(command, commandArgs) {
	console.log("$ " + [command, ...commandArgs].join(" "));

	const result = spawnSync(command, commandArgs, {
		stdio: "inherit",
		shell: false,
	});

	if (result.error) {
		console.error(result.error.message);
		process.exit(1);
	}

	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}

function printHelp() {
	console.log(`Usage: pnpm setup:cloudflare [project-slug] [options]

Options:
  --location <code>       Cloudflare location hint, such as enam, wnam, weur, eeur, apac, oc
  --media-bucket <name>   Override the R2 bucket name
  --skip-d1              Do not create D1
  --skip-r2              Do not create R2

Examples:
  pnpm setup:cloudflare brightline-studio
  pnpm setup:cloudflare brightline-studio --location enam

This runs Wrangler resource creation commands with --update-config. Review wrangler.jsonc after it completes.`);
}

import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

test("initializer sets public identity and rejects invalid options before changing files", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "emdash-init-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(join(dir, "seed"));
  for (const file of ["package.json", "wrangler.jsonc", "README.md", "seed/seed.json", "site.config.json"]) copyFileSync(file, join(dir, file));
  const script = resolve("scripts/init-project.mjs");
  const run = args => spawnSync(process.execPath, [script, ...args], { cwd: dir, encoding: "utf8" });
  const before = readFileSync(join(dir, "package.json"), "utf8");
  assert.notEqual(run(["sample", "--site", "http://bad.example"]).status, 0);
  assert.notEqual(run(["sample", "--unknown"]).status, 0);
  assert.equal(readFileSync(join(dir, "package.json"), "utf8"), before);
  const args = ["sample-project", "--title", "Sample Project", "--tagline", "A specific offer", "--site", "https://sample.test", "--email", "hello@sample.test"];
  assert.equal(run(args).status, 0);
  assert.equal(run(args).status, 0);
  assert.deepEqual(JSON.parse(readFileSync(join(dir, "site.config.json"), "utf8")), { url: "https://sample.test", contactEmail: "hello@sample.test" });
  const seed = JSON.parse(readFileSync(join(dir, "seed/seed.json"), "utf8"));
  assert.equal(seed.settings.title, "Sample Project");
  assert.equal(seed.settings.url, "https://sample.test");
  assert.match(readFileSync(join(dir, "wrangler.jsonc"), "utf8"), /sample-project-media/);
});

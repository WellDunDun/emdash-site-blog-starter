#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const { settings } = JSON.parse(readFileSync("seed/seed.json", "utf8"));
const escape = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box}body{margin:0;background:#111827;color:#fff;font-family:Arial,sans-serif}
    main{height:630px;padding:74px 80px;display:flex;flex-direction:column;justify-content:space-between;background:radial-gradient(circle at 95% 0%,#4338ca 0,transparent 60%)}
    .mark{width:72px;height:72px;display:grid;place-items:center;border-radius:18px;background:#a5b4fc;color:#111827;font-size:48px}
    h1{font-size:76px;line-height:1.05;margin:0 0 24px;letter-spacing:-3px;max-width:1000px;overflow-wrap:anywhere}
    p{font-size:30px;line-height:1.4;color:#d1d5db;max-width:940px;margin:0}
    footer{font-size:18px;letter-spacing:3px;text-transform:uppercase;color:#c7d2fe}
    </style></head><body><main><div class="mark">&mdash;</div><div><h1>${escape(settings.title)}</h1><p>${escape(settings.tagline)}</p></div><footer>Website + blog</footer></main></body></html>`);
  await page.screenshot({ path: "public/og-image.png" });
  console.log("Generated public/og-image.png at 1200 × 630.");
} finally { await browser.close(); }

import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { submitContact } from "../src/server/contact.ts";

const origin = "https://starter.example";
const options = { publicOrigin: origin, rateLimiter: { limit: async () => ({ success: true }) } };
const request = (data = {}, headers = {}) => new Request(`${origin}/contact`, {
  method: "POST", headers: { origin, "content-type": "application/x-www-form-urlencoded", ...headers },
  body: new URLSearchParams({ name: "Test Reader", email: "reader@example.com", message: "A local verification message.", ...data }),
});

test("rejects invalid input, cross-site requests, spam, and missing delivery configuration", async () => {
  assert.equal((await submitContact(request({}, { origin: "https://elsewhere.example" }), options)).status, 403);
  assert.equal((await submitContact(request({ name: " " }), options)).status, 400);
  assert.equal((await submitContact(request({ email: "not-an-email" }), options)).status, 400);
  assert.equal((await submitContact(request({ website: "bot" }), options)).status, 400);
  assert.equal((await submitContact(request({ message: "x".repeat(20000) }), options)).status, 413);
  assert.equal((await submitContact(request(), options)).status, 503);
  assert.equal((await submitContact(request(), { ...options, rateLimiter: { limit: async () => ({ success: false }) } })).status, 429);
});

test("only reports success after an actual HTTP receiver accepts the message", async (t) => {
  const received = [];
  const server = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    received.push({ body: JSON.parse(body), auth: req.headers.authorization });
    if (req.url === "/redirect") { res.writeHead(307, { Location: "/accept" }).end(); return; }
    res.writeHead(req.url === "/fail" ? 500 : 204).end();
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => { server.closeAllConnections(); server.close(); });
  const endpoint = `http://127.0.0.1:${server.address().port}`;
  const delivery = { ...options, allowLocalWebhook: true, webhookUrl: endpoint, webhookToken: "local-test-token" };
  assert.equal((await submitContact(request(), delivery)).status, 200);
  assert.equal(received[0].body.email, "reader@example.com");
  assert.equal(received[0].auth, "Bearer local-test-token");
  assert.equal((await submitContact(request(), { ...delivery, webhookUrl: endpoint + "/fail" })).status, 502);
  assert.equal((await submitContact(request(), { ...delivery, allowLocalWebhook: false })).status, 503);
  const beforeRedirect = received.length;
  assert.equal((await submitContact(request(), { ...delivery, webhookUrl: endpoint + "/redirect" })).status, 502);
  assert.equal(received.length, beforeRedirect + 1, "must not forward payload across a redirect");
});

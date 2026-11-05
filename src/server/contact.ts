export interface ContactOptions {
  webhookUrl?: string;
  webhookToken?: string;
  publicOrigin: string;
  allowLocalWebhook?: boolean;
  rateLimiter: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

type ContactResult = { status: number; message: string };

export async function submitContact(request: Request, options: ContactOptions): Promise<ContactResult> {
  const error = (status: number, message: string) => ({ status, message });
  if (request.headers.get("origin") !== options.publicOrigin) {
    return error(403, "Please submit the form from this website.");
  }
  const { success } = await options.rateLimiter.limit({
    key: `${options.publicOrigin}:contact:${request.headers.get("cf-connecting-ip") || "local"}`,
  });
  if (!success) return error(429, "Too many attempts. Please try again in a minute.");
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) {
    return error(415, "Please use the contact form to send your message.");
  }
  // Bound the stream before parsing, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return error(400, "Please fill in all required fields.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    size += part.value.byteLength;
    if (size > 16384) {
      await reader.cancel();
      return error(413, "Your message is too long.");
    }
    chunks.push(part.value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  const data = new URLSearchParams(new TextDecoder().decode(bytes));
  if (data.get("website")) return error(400, "Unable to accept this submission.");
  const payload = {
    name: (data.get("name") || "").trim(),
    email: (data.get("email") || "").trim(),
    company: (data.get("company") || "").trim(),
    message: (data.get("message") || "").trim(),
  };
  if (!payload.name || !payload.email || !payload.message) {
    return error(400, "Please fill in all required fields.");
  }
  if (payload.name.length > 100 || payload.company.length > 200 || payload.message.length > 5000) {
    return error(400, "Please shorten your name, company, or message.");
  }
  if (payload.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return error(400, "Please enter a valid email address.");
  }
  if (!options.webhookUrl) return error(503, "Contact delivery is unavailable. Please try again later.");
  try {
    const target = new URL(options.webhookUrl);
    if (target.protocol !== "https:" && !(options.allowLocalWebhook && target.protocol === "http:" && ["localhost", "127.0.0.1"].includes(target.hostname))) {
      return error(503, "Contact delivery is unavailable. Please try again later.");
    }
    const response = await fetch(target, {
      method: "POST",
      redirect: "manual",
      signal: AbortSignal.timeout(10000),
      headers: {
        "Content-Type": "application/json",
        ...(options.webhookToken ? { Authorization: `Bearer ${options.webhookToken}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    await response.body?.cancel();
    if (!response.ok) return error(502, "Your message could not be delivered. Please try again later.");
    return { status: 200, message: "Your message was delivered. Thank you for getting in touch." };
  } catch {
    return error(502, "Your message could not be delivered. Please try again later.");
  }
}

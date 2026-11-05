/// <reference types="@cloudflare/workers-types" />
declare namespace Cloudflare {
  interface Env {
    CONTACT_WEBHOOK_URL?: string;
    CONTACT_WEBHOOK_TOKEN?: string;
    CONTACT_RATE_LIMITER: RateLimit;
  }
}

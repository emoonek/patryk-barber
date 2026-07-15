import { headers } from "next/headers";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

export class RateLimitError extends Error {
  constructor() {
    super("Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.");
  }
}

function cleanup(now: number) {
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export async function requestRateLimitKey(scope: string, identifier?: string) {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headerStore.get("x-real-ip")?.trim();
  const ip = forwardedFor || realIp || "local";

  return [scope, ip, identifier?.trim().toLowerCase()].filter(Boolean).join(":");
}

export function assertRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  cleanup(now);

  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return;
  }

  if (entry.count >= limit) {
    throw new RateLimitError();
  }

  entry.count += 1;
}

// MVP/dev implementation: in-memory limits reset with the server process.
// For production with multiple instances, replace this with Redis/Upstash.

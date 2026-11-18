export const RATE_LIMIT_MAX_REQUESTS = 10;
export const RATE_LIMIT_WINDOW_MS = 60_000;
const STORAGE_KEY = 'scam_sos_check_timestamps_v1';

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimiterStore {
  getTimestamps(): number[];
  setTimestamps(timestamps: number[]): void;
}

export function createBrowserStore(): RateLimiterStore {
  return {
    getTimestamps() {
      try {
        if (typeof window === 'undefined' || !window.sessionStorage) return [];
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed)
          ? parsed.filter((n): n is number => typeof n === 'number' && Number.isFinite(n))
          : [];
      } catch {
        return [];
      }
    },
    setTimestamps(timestamps: number[]) {
      try {
        if (typeof window === 'undefined' || !window.sessionStorage) return;
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(timestamps));
      } catch {
        // Ignore storage quota / privacy mode failures
      }
    },
  };
}

export function createMemoryStore(initial: number[] = []): RateLimiterStore {
  let data = [...initial];
  return {
    getTimestamps: () => [...data],
    setTimestamps: (next) => {
      data = [...next];
    },
  };
}

export function checkClientRateLimit(
  store: RateLimiterStore,
  now: number = Date.now(),
  maxRequests: number = RATE_LIMIT_MAX_REQUESTS,
  windowMs: number = RATE_LIMIT_WINDOW_MS
): RateLimitStatus {
  const cutoff = now - windowMs;
  const recent = store.getTimestamps().filter((ts) => ts > cutoff && ts <= now);
  store.setTimestamps(recent);

  if (recent.length >= maxRequests) {
    const oldest = Math.min(...recent);
    const retryAfterMs = Math.max(1000, oldest + windowMs - now);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - recent.length,
    retryAfterSeconds: 0,
  };
}

export function recordClientCheck(
  store: RateLimiterStore,
  now: number = Date.now(),
  maxRequests: number = RATE_LIMIT_MAX_REQUESTS,
  windowMs: number = RATE_LIMIT_WINDOW_MS
): RateLimitStatus {
  const status = checkClientRateLimit(store, now, maxRequests, windowMs);
  if (!status.allowed) {
    return status;
  }

  const cutoff = now - windowMs;
  const recent = store.getTimestamps().filter((ts) => ts > cutoff && ts <= now);
  recent.push(now);
  store.setTimestamps(recent);

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - recent.length),
    retryAfterSeconds: 0,
  };
}

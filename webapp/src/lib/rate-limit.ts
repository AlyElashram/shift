const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

const attempts = new Map<string, RateLimitEntry>();

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    const isLockExpired = entry.lockedUntil && now > entry.lockedUntil;
    const isStale = now - entry.firstAttempt > LOCKOUT_DURATION_MS;
    if (isLockExpired || (isStale && !entry.lockedUntil)) {
      attempts.delete(key);
    }
  }
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  cleanup();

  const entry = attempts.get(ip);

  if (!entry) {
    return { allowed: true };
  }

  if (entry.lockedUntil) {
    const now = Date.now();
    if (now < entry.lockedUntil) {
      const retryAfterSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
      return { allowed: false, retryAfterSeconds };
    }
    // Lock expired — clear and allow
    attempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip: string): { locked: boolean; retryAfterSeconds?: number } {
  cleanup();

  const entry = attempts.get(ip) ?? { count: 0, firstAttempt: Date.now(), lockedUntil: null };
  entry.count += 1;

  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    attempts.set(ip, entry);
    return { locked: true, retryAfterSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000) };
  }

  attempts.set(ip, entry);
  return { locked: false };
}

export function clearRateLimit(ip: string) {
  attempts.delete(ip);
}

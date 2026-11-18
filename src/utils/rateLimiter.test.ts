import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkClientRateLimit,
  createMemoryStore,
  RATE_LIMIT_MAX_REQUESTS,
  recordClientCheck,
} from './rateLimiter';

test('rateLimiter allows up to 10 checks in 60 seconds and blocks the 11th', () => {
  const store = createMemoryStore();
  const baseTime = 1_700_000_000_000;

  for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
    const status = recordClientCheck(store, baseTime + i * 1000);
    assert.equal(status.allowed, true);
    assert.equal(status.remaining, RATE_LIMIT_MAX_REQUESTS - 1 - i);
  }

  const blocked = recordClientCheck(store, baseTime + 15_000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
  assert.ok(blocked.retryAfterSeconds > 0);

  // After 61 seconds from baseTime, the oldest timestamps expire
  const afterWindow = checkClientRateLimit(store, baseTime + 61_000);
  assert.equal(afterWindow.allowed, true);
  assert.ok(afterWindow.remaining >= 1);
});

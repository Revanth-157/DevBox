import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('auth service fallback mode', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    delete process.env.DATABASE_URL;
  });

  afterEach(() => {
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    } else {
      delete process.env.DATABASE_URL;
    }
  });

  it('registers a user when no database is configured', async () => {
    const { registerUser } = await import('./services/authService.js');

    const result = await registerUser({
      name: 'Fallback User',
      email: 'fallback@example.com',
      password: 'Password123!',
    });

    expect(result.user.email).toBe('fallback@example.com');
    expect(result.user.name).toBe('Fallback User');
    expect(result.token).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
  });
});

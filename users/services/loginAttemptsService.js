// In-memory storage for login attempts
// In production, use Redis or database
const loginAttempts = new Map();

const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const recordFailedAttempt = (email) => {
  const now = Date.now();

  if (!loginAttempts.has(email)) {
    loginAttempts.set(email, {
      attempts: 1,
      lastAttempt: now,
      blockedUntil: null,
    });
    return { blocked: false, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  const record = loginAttempts.get(email);

  // Check if user is currently blocked
  if (record.blockedUntil && now < record.blockedUntil) {
    const hoursLeft = Math.ceil((record.blockedUntil - now) / (60 * 60 * 1000));
    return {
      blocked: true,
      message: `Account is blocked. Try again in ${hoursLeft} hours.`,
      blockedUntil: record.blockedUntil,
    };
  }

  // Reset if block period has passed
  if (record.blockedUntil && now >= record.blockedUntil) {
    loginAttempts.set(email, {
      attempts: 1,
      lastAttempt: now,
      blockedUntil: null,
    });
    return { blocked: false, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  // Increment attempts
  record.attempts += 1;
  record.lastAttempt = now;

  // Block if reached max attempts
  if (record.attempts >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION;
    loginAttempts.set(email, record);
    return {
      blocked: true,
      message: "Too many failed login attempts. Account blocked for 24 hours.",
      blockedUntil: record.blockedUntil,
    };
  }

  loginAttempts.set(email, record);
  return {
    blocked: false,
    remainingAttempts: MAX_ATTEMPTS - record.attempts,
  };
};

export const resetLoginAttempts = (email) => {
  loginAttempts.delete(email);
};

export const isBlocked = (email) => {
  const now = Date.now();
  const record = loginAttempts.get(email);

  if (!record || !record.blockedUntil) {
    return { blocked: false };
  }

  if (now < record.blockedUntil) {
    const hoursLeft = Math.ceil((record.blockedUntil - now) / (60 * 60 * 1000));
    return {
      blocked: true,
      message: `Account is blocked. Try again in ${hoursLeft} hours.`,
    };
  }

  // Block period has passed
  loginAttempts.delete(email);
  return { blocked: false };
};

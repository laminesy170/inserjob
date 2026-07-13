import crypto from 'crypto';

export function generateRandomToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function hashToken(token: string, pepper?: string): string {
  const peppered = pepper ? `${token}:${pepper}` : token;
  return crypto.createHash('sha256').update(peppered).digest('hex');
}

export function verifyToken(token: string, hash: string, pepper?: string): boolean {
  const computedHash = hashToken(token, pepper);
  return crypto.timingSafeEqual(
    Buffer.from(computedHash),
    Buffer.from(hash)
  );
}

export function generateInvitationToken(): {
  token: string;
  hash: string;
} {
  const token = generateRandomToken();
  const hash = hashToken(token, process.env.INVITATION_TOKEN_PEPPER);
  return { token, hash };
}

export function verifyInvitationToken(token: string, hash: string): boolean {
  try {
    return verifyToken(token, hash, process.env.INVITATION_TOKEN_PEPPER);
  } catch {
    return false;
  }
}

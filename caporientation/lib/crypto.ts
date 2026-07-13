import { createHash } from 'crypto';

export function hashToken(token: string, pepper: string): string {
  return createHash('sha256')
    .update(`${token}:${pepper}`)
    .digest('hex');
}

import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  createInvitationSchema,
  submitAnswersSchema,
} from '@/lib/validation/schemas';

describe('Validation schemas', () => {
  describe('loginSchema', () => {
    it('should accept valid login', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'ValidPassword123!',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid',
        password: 'ValidPassword123!',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'short',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createInvitationSchema', () => {
    it('should accept valid invitation', () => {
      const result = createInvitationSchema.safeParse({
        beneficiaryDisplayName: 'Camille',
        beneficiaryEmail: 'camille@example.com',
        internalReference: 'DOSSIER-123',
        questionnaireId: '550e8400-e29b-41d4-a716-446655440000',
        expiresAt: '2026-08-31T23:59:59+02:00',
        language: 'fr',
        reportToBeneficiary: true,
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = createInvitationSchema.safeParse({
        beneficiaryDisplayName: 'Camille',
        beneficiaryEmail: 'invalid',
        questionnaireId: '550e8400-e29b-41d4-a716-446655440000',
        expiresAt: '2026-08-31T23:59:59+02:00',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid UUID', () => {
      const result = createInvitationSchema.safeParse({
        beneficiaryDisplayName: 'Camille',
        beneficiaryEmail: 'camille@example.com',
        questionnaireId: 'not-a-uuid',
        expiresAt: '2026-08-31T23:59:59+02:00',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('submitAnswersSchema', () => {
    it('should accept valid answers', () => {
      const result = submitAnswersSchema.safeParse({
        answers: [
          { questionId: 'Q1', value: 4 },
          { questionId: 'Q2', value: 3 },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('should reject value out of range', () => {
      const result = submitAnswersSchema.safeParse({
        answers: [{ questionId: 'Q1', value: 10 }],
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty answers', () => {
      const result = submitAnswersSchema.safeParse({
        answers: [],
      });
      expect(result.success).toBe(false);
    });

    it('should accept value 1', () => {
      const result = submitAnswersSchema.safeParse({
        answers: [{ questionId: 'Q1', value: 1 }],
      });
      expect(result.success).toBe(true);
    });

    it('should accept value 5', () => {
      const result = submitAnswersSchema.safeParse({
        answers: [{ questionId: 'Q1', value: 5 }],
      });
      expect(result.success).toBe(true);
    });
  });
});

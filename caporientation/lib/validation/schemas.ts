import { z } from 'zod';

// Auth
export const loginSchema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().min(8, 'Mot de passe obligatoire'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Invitations
export const createInvitationSchema = z.object({
  beneficiaryDisplayName: z.string().min(1, 'Nom obligatoire').max(255),
  beneficiaryEmail: z.string().email('Adresse e-mail invalide'),
  internalReference: z.string().max(255).optional(),
  questionnaireId: z.string().uuid('ID de questionnaire invalide'),
  expiresAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Date invalide'),
  language: z.enum(['fr', 'en']).default('fr'),
  reportToBeneficiary: z.boolean().default(false),
});

export type CreateInvitationInput = z.infer<
  typeof createInvitationSchema
>;

// Assessment answers
export const answerSchema = z.object({
  questionId: z.string().min(1),
  value: z.number().int().min(1).max(5),
});

export const submitAnswersSchema = z.object({
  answers: z.array(answerSchema).min(1),
});

export type SubmitAnswersInput = z.infer<typeof submitAnswersSchema>;

// Counselor notes
export const createNoteSchema = z.object({
  content: z.string().min(1).max(5000),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

// Admin
export const publishQuestionnaireSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  status: z.enum(['PUBLISHED']),
});

export type PublishQuestionnaireInput = z.infer<
  typeof publishQuestionnaireSchema
>;

export const dataSubjectExportSchema = z.object({
  email: z.string().email(),
});

export const dataSubjectDeleteSchema = z.object({
  email: z.string().email(),
  anonymize: z.boolean().default(true),
});

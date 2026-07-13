/* eslint-disable @typescript-eslint/no-explicit-any */

export interface QuestionnaireSchema {
  schemaVersion: string;
  questionnaire: {
    id: string;
    version: string;
    status: 'draft' | 'published';
    title: string;
    description: string;
    language: 'fr' | 'en';
    estimatedDurationMinutes: number;
    scale: {
      min: number;
      max: number;
      labels: Record<string, string>;
    };
    dimensions: DimensionConfig[];
  };
}

export interface DimensionConfig {
  id: string;
  label: string;
  weight: number;
  description: string;
  questions: QuestionConfig[];
}

export interface QuestionConfig {
  id: string;
  text: string;
  reverse?: boolean;
  weight?: number;
}

export interface ScoringRules {
  version: string;
  thresholds: Record<
    string,
    {
      min: number;
      max: number;
    }
  >;
  interpretations: Record<
    string,
    Record<
      string,
      {
        summary: string;
        strengths: string[];
        developmentAreas: string[];
        recommendedActions: string[];
      }
    >
  >;
}

// Database types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'INACTIVE';
  logo_url: string | null;
  contact_email: string;
  data_controller_name: string;
  privacy_contact: string;
  legal_basis: string;
  retention_days: number;
  beneficiary_report_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  organization_id: string;
  role: 'ADMIN' | 'COUNSELOR';
  first_name: string;
  last_name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface Questionnaire {
  id: string;
  public_id: string;
  version: string;
  status: 'DRAFT' | 'PUBLISHED';
  title: string;
  language: 'fr' | 'en';
  schema_json: QuestionnaireSchema;
  scoring_version: string;
  published_at: string | null;
  created_by: string;
  created_at: string;
}

export interface Invitation {
  id: string;
  organization_id: string;
  counselor_id: string;
  questionnaire_id: string;
  beneficiary_display_name: string;
  beneficiary_email: string;
  internal_reference: string | null;
  token_hash: string;
  token_expires_at: string;
  status: InvitationStatus;
  report_to_beneficiary: boolean;
  last_email_sent_at: string | null;
  reminder_count: number;
  created_at: string;
  opened_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  archived_at: string | null;
}

export type InvitationStatus =
  | 'BROUILLON'
  | 'INVITATION_ENVOYEE'
  | 'CONSULTEE'
  | 'EN_COURS'
  | 'TERMINEE'
  | 'RAPPORT_GENERE'
  | 'ANALYSEE'
  | 'ARCHIVEE'
  | 'EXPIREE'
  | 'ANNULEE';

export interface AssessmentSession {
  id: string;
  invitation_id: string;
  questionnaire_id: string;
  questionnaire_snapshot_json: QuestionnaireSchema;
  scoring_snapshot_json: ScoringRules;
  status: 'DRAFT' | 'IN_PROGRESS' | 'SUBMITTED';
  progress_percent: number;
  started_at: string | null;
  last_saved_at: string | null;
  submitted_at: string | null;
  client_fingerprint_hash: string | null;
  created_at: string;
}

export interface Answer {
  id: string;
  session_id: string;
  question_id: string;
  raw_value: number;
  effective_value: number;
  answered_at: string;
  updated_at: string;
}

export interface AssessmentResult {
  id: string;
  session_id: string;
  questionnaire_version: string;
  scoring_version: string;
  overall_score: number;
  result_json: any;
  generated_at: string;
}

export interface DimensionResult {
  id: string;
  result_id: string;
  dimension_id: string;
  raw_score: number;
  normalized_score: number;
  level_id: string;
  interpretation_json: any;
}

export interface Report {
  id: string;
  session_id: string;
  report_type: 'BENEFICIARY_SUMMARY' | 'COUNSELOR_REPORT';
  storage_path: string;
  checksum: string;
  generated_at: string;
  deleted_at: string | null;
}

export interface CounselorNote {
  id: string;
  invitation_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface EmailOutbox {
  id: string;
  organization_id: string;
  invitation_id: string | null;
  message_type: string;
  recipient: string;
  template_data_json: any;
  idempotency_key: string;
  status: 'PENDING' | 'PROCESSING' | 'SENT' | 'FAILED' | 'CANCELLED';
  attempt_count: number;
  next_attempt_at: string | null;
  provider_message_id: string | null;
  last_error: string | null;
  created_at: string;
  sent_at: string | null;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  actor_type: 'USER' | 'SYSTEM';
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata_json: any | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      organizations: { Row: Organization; Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Organization, 'id' | 'created_at'>> };
      profiles: { Row: Profile; Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Profile, 'id' | 'created_at'>> };
      questionnaires: { Row: Questionnaire; Insert: Omit<Questionnaire, 'id' | 'created_at'>; Update: Partial<Omit<Questionnaire, 'id' | 'created_at'>> };
      invitations: { Row: Invitation; Insert: Omit<Invitation, 'id' | 'created_at'>; Update: Partial<Omit<Invitation, 'id' | 'created_at'>> };
      assessment_sessions: { Row: AssessmentSession; Insert: Omit<AssessmentSession, 'id' | 'created_at'>; Update: Partial<Omit<AssessmentSession, 'id' | 'created_at'>> };
      answers: { Row: Answer; Insert: Omit<Answer, 'id' | 'answered_at'>; Update: Partial<Omit<Answer, 'id'>> };
      assessment_results: { Row: AssessmentResult; Insert: Omit<AssessmentResult, 'id' | 'generated_at'>; Update: Partial<Omit<AssessmentResult, 'id'>> };
      dimension_results: { Row: DimensionResult; Insert: Omit<DimensionResult, 'id'>; Update: Partial<Omit<DimensionResult, 'id'>> };
      reports: { Row: Report; Insert: Omit<Report, 'id' | 'generated_at'>; Update: Partial<Omit<Report, 'id'>> };
      counselor_notes: { Row: CounselorNote; Insert: Omit<CounselorNote, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<CounselorNote, 'id' | 'created_at'>> };
      email_outbox: { Row: EmailOutbox; Insert: Omit<EmailOutbox, 'id' | 'created_at'>; Update: Partial<Omit<EmailOutbox, 'id' | 'created_at'>> };
      audit_logs: { Row: AuditLog; Insert: Omit<AuditLog, 'id' | 'created_at'>; Update: never };
    };
  };
}

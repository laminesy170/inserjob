-- Organizations
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')) DEFAULT 'ACTIVE',
  logo_url TEXT,
  contact_email TEXT NOT NULL,
  data_controller_name TEXT NOT NULL,
  privacy_contact TEXT NOT NULL,
  legal_basis TEXT NOT NULL,
  retention_days INTEGER NOT NULL DEFAULT 730,
  beneficiary_report_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_organizations_slug ON public.organizations(slug);
CREATE INDEX idx_organizations_status ON public.organizations(status);

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'COUNSELOR')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Questionnaires
CREATE TABLE public.questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id TEXT NOT NULL UNIQUE,
  version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('DRAFT', 'PUBLISHED')) DEFAULT 'DRAFT',
  title TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('fr', 'en')),
  schema_json JSONB NOT NULL,
  scoring_version TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_questionnaires_public_id ON public.questionnaires(public_id);
CREATE INDEX idx_questionnaires_status ON public.questionnaires(status);
CREATE INDEX idx_questionnaires_version ON public.questionnaires(version);

-- Invitations
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  counselor_id UUID NOT NULL REFERENCES public.profiles(id),
  questionnaire_id UUID NOT NULL REFERENCES public.questionnaires(id),
  beneficiary_display_name TEXT NOT NULL,
  beneficiary_email TEXT NOT NULL,
  internal_reference TEXT,
  token_hash TEXT NOT NULL UNIQUE,
  token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN (
    'BROUILLON',
    'INVITATION_ENVOYEE',
    'CONSULTEE',
    'EN_COURS',
    'TERMINEE',
    'RAPPORT_GENERE',
    'ANALYSEE',
    'ARCHIVEE',
    'EXPIREE',
    'ANNULEE'
  )) DEFAULT 'BROUILLON',
  report_to_beneficiary BOOLEAN DEFAULT false,
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  reminder_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  opened_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  archived_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_invitations_organization_id ON public.invitations(organization_id);
CREATE INDEX idx_invitations_counselor_id ON public.invitations(counselor_id);
CREATE INDEX idx_invitations_token_hash ON public.invitations(token_hash);
CREATE INDEX idx_invitations_status ON public.invitations(status);
CREATE INDEX idx_invitations_beneficiary_email ON public.invitations(beneficiary_email);
CREATE INDEX idx_invitations_created_at ON public.invitations(created_at);

-- Assessment sessions
CREATE TABLE public.assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL UNIQUE REFERENCES public.invitations(id),
  questionnaire_id UUID NOT NULL REFERENCES public.questionnaires(id),
  questionnaire_snapshot_json JSONB NOT NULL,
  scoring_snapshot_json JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN (
    'DRAFT',
    'IN_PROGRESS',
    'SUBMITTED'
  )) DEFAULT 'DRAFT',
  progress_percent INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  last_saved_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  client_fingerprint_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_assessment_sessions_invitation_id ON public.assessment_sessions(invitation_id);
CREATE INDEX idx_assessment_sessions_status ON public.assessment_sessions(status);

-- Answers
CREATE TABLE public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.assessment_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  raw_value INTEGER NOT NULL CHECK (raw_value >= 1 AND raw_value <= 5),
  effective_value INTEGER NOT NULL CHECK (effective_value >= 1 AND effective_value <= 5),
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(session_id, question_id)
);

CREATE INDEX idx_answers_session_id ON public.answers(session_id);

-- Assessment results
CREATE TABLE public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL UNIQUE REFERENCES public.assessment_sessions(id),
  questionnaire_version TEXT NOT NULL,
  scoring_version TEXT NOT NULL,
  overall_score INTEGER NOT NULL,
  result_json JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_assessment_results_session_id ON public.assessment_results(session_id);

-- Dimension results
CREATE TABLE public.dimension_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  result_id UUID NOT NULL REFERENCES public.assessment_results(id) ON DELETE CASCADE,
  dimension_id TEXT NOT NULL,
  raw_score INTEGER NOT NULL,
  normalized_score INTEGER NOT NULL CHECK (normalized_score >= 0 AND normalized_score <= 100),
  level_id TEXT NOT NULL,
  interpretation_json JSONB NOT NULL
);

CREATE INDEX idx_dimension_results_result_id ON public.dimension_results(result_id);

-- Reports
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.assessment_sessions(id),
  report_type TEXT NOT NULL CHECK (report_type IN ('BENEFICIARY_SUMMARY', 'COUNSELOR_REPORT')),
  storage_path TEXT NOT NULL,
  checksum TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_reports_session_id ON public.reports(session_id);
CREATE INDEX idx_reports_report_type ON public.reports(report_type);

-- Counselor notes
CREATE TABLE public.counselor_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_counselor_notes_invitation_id ON public.counselor_notes(invitation_id);

-- Email outbox
CREATE TABLE public.email_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  invitation_id UUID REFERENCES public.invitations(id),
  message_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  template_data_json JSONB NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELLED')) DEFAULT 'PENDING',
  attempt_count INTEGER DEFAULT 0,
  next_attempt_at TIMESTAMP WITH TIME ZONE,
  provider_message_id TEXT,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_email_outbox_organization_id ON public.email_outbox(organization_id);
CREATE INDEX idx_email_outbox_status ON public.email_outbox(status);
CREATE INDEX idx_email_outbox_next_attempt_at ON public.email_outbox(next_attempt_at) WHERE status = 'PENDING';

-- Audit logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  actor_type TEXT NOT NULL CHECK (actor_type IN ('USER', 'SYSTEM')),
  actor_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_audit_logs_organization_id ON public.audit_logs(organization_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

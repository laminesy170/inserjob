-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dimension_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselor_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view their organization" ON public.organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organization_id = organizations.id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update their organization" ON public.organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organization_id = organizations.id
      AND profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organization_id =
        (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
      AND profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can view organization profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p2
      WHERE p2.id = auth.uid()
      AND p2.role = 'ADMIN'
      AND p2.organization_id = profiles.organization_id
    )
  );

-- Questionnaires policies
CREATE POLICY "Users can view published questionnaires" ON public.questionnaires
  FOR SELECT USING (
    status = 'PUBLISHED' OR
    created_by = auth.uid()
  );

CREATE POLICY "Admins can create questionnaires" ON public.questionnaires
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'ADMIN'
    )
  );

-- Invitations policies
CREATE POLICY "Counselors view their organization invitations" ON public.invitations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND organization_id = invitations.organization_id
      AND role IN ('ADMIN', 'COUNSELOR')
    )
  );

CREATE POLICY "Counselors create invitations" ON public.invitations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND organization_id = organization_id
      AND role IN ('ADMIN', 'COUNSELOR')
    )
    AND counselor_id = auth.uid()
  );

CREATE POLICY "Counselors update their invitations" ON public.invitations
  FOR UPDATE USING (
    counselor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND organization_id = invitations.organization_id
      AND role = 'ADMIN'
    )
  );

-- Assessment sessions policies
CREATE POLICY "Counselors view their invitations sessions" ON public.assessment_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invitations i
      WHERE i.id = invitation_id
      AND (
        i.counselor_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
          AND organization_id = i.organization_id
          AND role = 'ADMIN'
        )
      )
    )
  );

-- Answers policies
CREATE POLICY "Counselors view session answers" ON public.answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.assessment_sessions s
      WHERE s.id = session_id
      AND EXISTS (
        SELECT 1 FROM public.invitations i
        WHERE i.id = s.invitation_id
        AND (
          i.counselor_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND organization_id = i.organization_id
            AND role = 'ADMIN'
          )
        )
      )
    )
  );

-- Assessment results policies
CREATE POLICY "Counselors view their results" ON public.assessment_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.assessment_sessions s
      WHERE s.id = session_id
      AND EXISTS (
        SELECT 1 FROM public.invitations i
        WHERE i.id = s.invitation_id
        AND (
          i.counselor_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND organization_id = i.organization_id
            AND role = 'ADMIN'
          )
        )
      )
    )
  );

-- Dimension results policies
CREATE POLICY "Counselors view dimension results" ON public.dimension_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.assessment_results ar
      WHERE ar.id = result_id
      AND EXISTS (
        SELECT 1 FROM public.assessment_sessions s
        WHERE s.id = ar.session_id
        AND EXISTS (
          SELECT 1 FROM public.invitations i
          WHERE i.id = s.invitation_id
          AND (
            i.counselor_id = auth.uid() OR
            EXISTS (
              SELECT 1 FROM public.profiles
              WHERE id = auth.uid()
              AND organization_id = i.organization_id
              AND role = 'ADMIN'
            )
          )
        )
      )
    )
  );

-- Reports policies
CREATE POLICY "Counselors view session reports" ON public.reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.assessment_sessions s
      WHERE s.id = session_id
      AND EXISTS (
        SELECT 1 FROM public.invitations i
        WHERE i.id = s.invitation_id
        AND (
          i.counselor_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND organization_id = i.organization_id
            AND role = 'ADMIN'
          )
        )
      )
    )
  );

-- Counselor notes policies
CREATE POLICY "Counselors view notes on their invitations" ON public.counselor_notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invitations i
      WHERE i.id = invitation_id
      AND (
        i.counselor_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
          AND organization_id = i.organization_id
          AND role = 'ADMIN'
        )
      )
    )
  );

CREATE POLICY "Authors can update their notes" ON public.counselor_notes
  FOR UPDATE USING (author_id = auth.uid());

-- Email outbox policies
CREATE POLICY "Users view organization emails" ON public.email_outbox
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND organization_id = email_outbox.organization_id
      AND role = 'ADMIN'
    )
  );

-- Audit logs policies
CREATE POLICY "Admins view organization audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND organization_id = audit_logs.organization_id
      AND role = 'ADMIN'
    )
  );

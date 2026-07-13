# Deployment Guide — CapOrientation 360

## Quick Start (5 minutes)

### 1. Vercel Deployment
```bash
# Push to GitHub
git push origin main

# On Vercel dashboard
- Import project from GitHub
- Set environment variables (see below)
- Deploy
```

### 2. Environment Variables

Copy these to Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
INVITATION_TOKEN_PEPPER=<32+ character random string>
CRON_SECRET=<random token for cron jobs>
BREVO_API_KEY=xkeysib-...
NEXT_PUBLIC_APP_URL=https://caporientation.yourapp.com
```

### 3. Database Setup (Supabase)

```bash
# In Supabase SQL Editor, run:
1. db/migrations/001_initial_schema.sql
2. db/migrations/002_rls_policies.sql
```

### 4. Enable Email (Brevo)

1. Create account at https://www.brevo.com
2. Get API key from settings
3. Create email templates (IDs 1-4):
   - **ID 1**: Invitation
   - **ID 2**: Reminder
   - **ID 3**: Completion
   - **ID 4**: Cancellation

Template placeholders:
```
{{beneficiaryName}}, {{invitationLink}}, {{expiresAt}}, 
{{reportUrl}}, {{overallScore}}
```

### 5. Email Processing (Cron Job)

Set up external cron service (e.g., EasyCron, Uptime Robot):

```
POST https://your-app.vercel.app/api/email/process-outbox
Headers:
  Authorization: Bearer <CRON_SECRET>
Schedule: Every 5 minutes
```

Or use Vercel Cron (Premium):

```javascript
// api/cron/send-emails.ts
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'nodejs',
};

export async function POST(request: NextRequest) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  return fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/process-outbox`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
  });
}
```

## Step-by-Step Checklist

### Pre-Deployment
- [ ] All tests passing (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] Environment variables documented
- [ ] Git repository up-to-date

### Supabase Setup
- [ ] Create new Supabase project
- [ ] Run migration 001 (schema)
- [ ] Run migration 002 (RLS policies)
- [ ] Create test user (counselor role)
- [ ] Verify RLS is enabled

### Vercel Setup
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Add all environment variables
- [ ] Deploy
- [ ] Verify DNS/domain

### Email Setup
- [ ] Create Brevo account
- [ ] Create 4 email templates
- [ ] Get API key
- [ ] Set up cron job
- [ ] Test email flow (create invitation → check inbox)

### Security
- [ ] Change INVITATION_TOKEN_PEPPER (32+ chars, cryptographically random)
- [ ] Change CRON_SECRET (random)
- [ ] Enable HTTPS only (Vercel default)
- [ ] Configure CORS if needed
- [ ] Review RLS policies
- [ ] Disable database password (use Supabase auth only)

### Monitoring
- [ ] Set up error tracking (Sentry optional)
- [ ] Monitor Vercel logs
- [ ] Track email delivery (Brevo dashboard)
- [ ] Verify database performance

## Testing Before Production

### 1. Create Test Invitation
```bash
curl -X POST https://your-app.vercel.app/api/invitations \
  -H "Authorization: Bearer <SESSION_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "beneficiaryEmail": "test@example.com",
    "beneficiaryDisplayName": "Test User",
    "expiresAt": "2024-08-13T23:59:59Z"
  }'
```

### 2. Complete Assessment Flow
1. Visit `/public/assessment/[token]`
2. Accept GDPR terms
3. Complete all questions
4. Submit and verify results page
5. Test export (PDF, JSON, CSV)

### 3. Verify Email Delivery
1. Create invitation
2. Check email inbox
3. Click link in email
4. Complete assessment
5. Verify completion email sent

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
npm ci
npm run build
```

### "Cannot find module" errors
```bash
npm install
npm run build
```

### Database RLS errors
- Check RLS policies are created
- Verify user has correct role
- Check organization_id matching

### Email not sending
- Verify BREVO_API_KEY is set
- Check Brevo email templates exist
- Review email_outbox table status
- Check cron job execution logs

### Performance issues
- Check database indexes (created in migration)
- Monitor Supabase query performance
- Enable Vercel Analytics
- Consider database replication

## Post-Deployment

### Monitor
- Vercel dashboard (performance, errors)
- Supabase dashboard (connection count, storage)
- Brevo dashboard (email delivery rate)
- Application logs (real errors, warnings)

### Maintenance
- Update dependencies monthly (`npm audit`)
- Review and archive old assessments
- Monitor storage usage (Supabase)
- Backup database regularly

### Scale
- Enable database replication for multi-region
- Add CDN caching for static assets
- Consider read replicas for reporting
- Implement rate limiting if needed

## Database Backup

### Manual Backup (Supabase)
1. Dashboard → Settings → Database → Backups
2. Click "Create a backup now"
3. Download backup file

### Automatic Backups
- Included in Supabase Pro plan
- Daily backups retained for 7 days
- 30-day backups available

## Rollback Plan

If deployment fails:

1. **Vercel**: Revert to previous production deployment
2. **Database**: Restore from Supabase backup
3. **Code**: Git revert and redeploy

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Brevo Docs**: https://developers.brevo.com
- **Next.js Docs**: https://nextjs.org/docs

## Security Best Practices

✅ **Enabled by default**
- HTTPS everywhere (Vercel)
- Supabase RLS policies
- Password hashing (Supabase Auth)
- Input validation (Zod schemas)
- CSRF protection (Next.js)

⚠️ **You should configure**
- Email verification for new accounts
- Rate limiting for API endpoints
- Monitoring and alerting
- Log retention policies
- Encrypted environment variables

❌ **Never do**
- Commit environment variables to git
- Disable RLS policies
- Use weak INVITATION_TOKEN_PEPPER
- Expose service role key to client
- Skip database backups

---

**Status**: Ready for production deployment
**Last updated**: 2024-07-13
**Estimated deployment time**: 15-30 minutes

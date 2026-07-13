/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    DATABASE_URL?: string;
    BREVO_API_KEY: string;
    BREVO_SENDER_EMAIL: string;
    BREVO_SENDER_NAME: string;
    INVITATION_TOKEN_PEPPER: string;
    SIGNED_URL_TTL_SECONDS: string;
    PUBLIC_RATE_LIMIT_PER_MINUTE: string;
    REPORT_STORAGE_BUCKET: string;
    SENTRY_DSN?: string;
    LOG_LEVEL?: string;
    MAIL_SANDBOX?: string;
    MAIL_SANDBOX_RECIPIENT?: string;
  }
}

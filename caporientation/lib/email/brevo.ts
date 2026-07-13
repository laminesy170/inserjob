interface EmailTemplate {
  templateId: number;
  to: Array<{ email: string; name: string }>;
  params: Record<string, string | number>;
  replyTo?: { email: string; name: string };
}

interface EmailOptions {
  subject: string;
  html: string;
  to: { email: string; name?: string };
  from?: { email: string; name: string };
}

export class BrevoEmailService {
  private apiKey: string;
  private baseUrl = 'https://api.brevo.com/v3';

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY || '';
    if (!this.apiKey) {
      console.warn('BREVO_API_KEY not set. Email sending will not work.');
    }
  }

  async sendTemplateEmail(template: EmailTemplate): Promise<{ id: string }> {
    if (!this.apiKey) {
      console.warn('BREVO_API_KEY not configured. Skipping email send.');
      return { id: 'mock-' + Date.now() };
    }

    try {
      const response = await fetch(`${this.baseUrl}/smtp/email`, {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.templateId,
          to: template.to,
          params: template.params,
          replyTo: template.replyTo,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Brevo API error:', error);
        throw new Error(`Brevo API error: ${error.message}`);
      }

      const data = await response.json();
      return { id: data.messageId };
    } catch (error) {
      console.error('Failed to send Brevo template email:', error);
      throw error;
    }
  }

  async sendEmail(options: EmailOptions): Promise<{ id: string }> {
    if (!this.apiKey) {
      console.warn('BREVO_API_KEY not configured. Skipping email send.');
      return { id: 'mock-' + Date.now() };
    }

    try {
      const from = options.from || {
        email: 'noreply@caporientation.fr',
        name: 'CapOrientation 360',
      };

      const response = await fetch(`${this.baseUrl}/smtp/email`, {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: from,
          to: [options.to],
          subject: options.subject,
          htmlContent: options.html,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Brevo API error:', error);
        throw new Error(`Brevo API error: ${error.message}`);
      }

      const data = await response.json();
      return { id: data.messageId };
    } catch (error) {
      console.error('Failed to send Brevo email:', error);
      throw error;
    }
  }
}

export const brevoService = new BrevoEmailService();

import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

export interface EmailAttachment {
  filename: string;
  path?: string;
  content?: Buffer;
  contentType?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;
  private readonly fromAddress: string;
  private readonly isConfigured: boolean;

  constructor() {
    // Check if email is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    this.fromAddress = process.env.EMAIL_FROM || 'noreply@adonishealth.com';
    this.isConfigured = !!(smtpHost && smtpUser && smtpPass);

    if (this.isConfigured) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || '587', 10),
        secure: smtpPort === '465',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      this.logger.log('Email service configured with SMTP');
    } else {
      // Development mode - log emails instead of sending
      this.logger.warn(
        'Email service not configured. Emails will be logged to console. ' +
          'Set SMTP_HOST, SMTP_USER, SMTP_PASS to enable sending.',
      );
    }
  }

  /**
   * Send an email
   */
  async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string }> {
    const { to, subject, text, html, attachments } = options;

    if (!this.isConfigured) {
      // Development mode - log the email
      this.logger.log(`[DEV EMAIL] To: ${to}`);
      this.logger.log(`[DEV EMAIL] Subject: ${subject}`);
      this.logger.log(`[DEV EMAIL] Text: ${text?.substring(0, 200)}...`);
      if (attachments?.length) {
        this.logger.log(`[DEV EMAIL] Attachments: ${attachments.map((a) => a.filename).join(', ')}`);
      }
      return { success: true, messageId: `dev-${Date.now()}` };
    }

    try {
      const result = await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject,
        text,
        html,
        attachments,
      });

      this.logger.log(`Email sent to ${to}: ${result.messageId}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  /**
   * Send lab requisition email to patient
   */
  async sendLabRequisition(
    patientEmail: string,
    patientName: string,
    orderNumber: string,
    panelName: string,
    pdfPath: string,
    drawSiteAddress?: string,
    scheduledDate?: Date,
  ): Promise<{ success: boolean; messageId?: string }> {
    const subject = `Your Lab Requisition - ${orderNumber}`;

    const scheduledInfo = scheduledDate
      ? `<p><strong>Scheduled Date:</strong> ${scheduledDate.toLocaleDateString()}</p>`
      : '';

    const drawSiteInfo = drawSiteAddress
      ? `<p><strong>Draw Site:</strong> ${drawSiteAddress}</p>`
      : '';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a365d; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">ADONIS HEALTH</h1>
        </div>

        <div style="padding: 30px; background-color: #f7fafc;">
          <h2 style="color: #1a365d;">Hello ${patientName},</h2>

          <p>Your lab requisition is ready. Please find your requisition form attached to this email.</p>

          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Test Panel:</strong> ${panelName}</p>
            ${drawSiteInfo}
            ${scheduledInfo}
          </div>

          <h3 style="color: #1a365d;">What to do next:</h3>
          <ol>
            <li>Print the attached requisition form (or show it on your phone)</li>
            <li>Bring a valid photo ID to the draw site</li>
            <li>Check if fasting is required for your tests</li>
            <li>Results will be sent directly to your Adonis Health provider</li>
          </ol>

          <p style="margin-top: 30px;">If you have any questions, please contact us at <a href="mailto:support@adonishealth.com">support@adonishealth.com</a></p>
        </div>

        <div style="background-color: #e2e8f0; padding: 15px; text-align: center; font-size: 12px; color: #718096;">
          <p>Adonis Health | Premium Men's Health & Wellness</p>
          <p>This requisition is valid for 90 days from the date of issue.</p>
        </div>
      </div>
    `;

    const text = `
Hello ${patientName},

Your lab requisition is ready.

Order Number: ${orderNumber}
Test Panel: ${panelName}
${drawSiteAddress ? `Draw Site: ${drawSiteAddress}` : ''}
${scheduledDate ? `Scheduled Date: ${scheduledDate.toLocaleDateString()}` : ''}

What to do next:
1. Print the attached requisition form (or show it on your phone)
2. Bring a valid photo ID to the draw site
3. Check if fasting is required for your tests
4. Results will be sent directly to your Adonis Health provider

If you have any questions, please contact us at support@adonishealth.com

Adonis Health | Premium Men's Health & Wellness
This requisition is valid for 90 days from the date of issue.
    `.trim();

    // Read the PDF file
    const pdfBuffer = fs.readFileSync(pdfPath);

    return this.sendEmail({
      to: patientEmail,
      subject,
      text,
      html,
      attachments: [
        {
          filename: `requisition-${orderNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });
  }
}

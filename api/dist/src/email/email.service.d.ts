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
export declare class EmailService {
    private readonly logger;
    private transporter;
    private readonly fromAddress;
    private readonly isConfigured;
    constructor();
    sendEmail(options: SendEmailOptions): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    sendLabRequisition(patientEmail: string, patientName: string, orderNumber: string, panelName: string, pdfPath: string, drawSiteAddress?: string, scheduledDate?: Date): Promise<{
        success: boolean;
        messageId?: string;
    }>;
}

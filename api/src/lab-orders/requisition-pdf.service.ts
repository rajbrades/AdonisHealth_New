import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

export interface RequisitionData {
  orderNumber: string;
  panelName: string;
  panelCodes: string | null;
  labProvider: string;
  price: number;
  patientPay: boolean;
  drawSiteAddress: string | null;
  scheduledDrawDate: Date | null;
  notes: string | null;
  patient: {
    firstName: string;
    lastName: string;
    dob: Date;
    gender: string;
    phone: string | null;
    address: string | null;
    user: {
      email: string;
    };
  };
  orderingProvider: {
    firstName: string;
    lastName: string;
    specialty: string | null;
    deaNumber: string | null;
  } | null;
  createdAt: Date;
}

@Injectable()
export class RequisitionPdfService {
  private readonly outputDir: string;

  constructor() {
    // Create output directory for PDFs
    this.outputDir = path.join(process.cwd(), 'uploads', 'requisitions');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate a lab requisition PDF
   */
  async generateRequisition(data: RequisitionData): Promise<string> {
    const filename = `requisition-${data.orderNumber}.pdf`;
    const filepath = path.join(this.outputDir, filename);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Header
      this.drawHeader(doc, data);

      // Patient Information
      this.drawPatientInfo(doc, data);

      // Test Panel Information
      this.drawTestInfo(doc, data);

      // Provider Information
      this.drawProviderInfo(doc, data);

      // Draw Site / Instructions
      this.drawInstructions(doc, data);

      // Footer
      this.drawFooter(doc, data);

      doc.end();

      stream.on('finish', () => {
        resolve(filepath);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  }

  private drawHeader(doc: PDFKit.PDFDocument, data: RequisitionData): void {
    // Logo/Title area
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('ADONIS HEALTH', 50, 50, { align: 'center' })
      .fontSize(12)
      .font('Helvetica')
      .text('Laboratory Requisition Form', { align: 'center' })
      .moveDown(0.5);

    // Order number box
    const orderBoxY = 100;
    doc
      .rect(400, orderBoxY, 160, 40)
      .stroke()
      .fontSize(10)
      .text('Order Number:', 410, orderBoxY + 5)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(data.orderNumber, 410, orderBoxY + 20);

    // Date
    doc
      .font('Helvetica')
      .fontSize(10)
      .text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`, 50, orderBoxY + 10);

    doc.moveDown(3);
  }

  private drawPatientInfo(doc: PDFKit.PDFDocument, data: RequisitionData): void {
    const startY = 160;

    // Section header
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#1a365d')
      .text('PATIENT INFORMATION', 50, startY)
      .fillColor('black')
      .moveTo(50, startY + 18)
      .lineTo(560, startY + 18)
      .stroke();

    doc.font('Helvetica').fontSize(11);

    const col1X = 50;
    const col2X = 300;
    let y = startY + 30;

    // Row 1
    doc
      .font('Helvetica-Bold')
      .text('Name:', col1X, y)
      .font('Helvetica')
      .text(`${data.patient.firstName} ${data.patient.lastName}`, col1X + 50, y)
      .font('Helvetica-Bold')
      .text('DOB:', col2X, y)
      .font('Helvetica')
      .text(new Date(data.patient.dob).toLocaleDateString(), col2X + 35, y);

    y += 20;

    // Row 2
    doc
      .font('Helvetica-Bold')
      .text('Gender:', col1X, y)
      .font('Helvetica')
      .text(data.patient.gender, col1X + 50, y)
      .font('Helvetica-Bold')
      .text('Phone:', col2X, y)
      .font('Helvetica')
      .text(data.patient.phone || 'N/A', col2X + 45, y);

    y += 20;

    // Row 3
    doc
      .font('Helvetica-Bold')
      .text('Email:', col1X, y)
      .font('Helvetica')
      .text(data.patient.user.email, col1X + 50, y);

    y += 20;

    // Row 4 - Address
    if (data.patient.address) {
      doc
        .font('Helvetica-Bold')
        .text('Address:', col1X, y)
        .font('Helvetica')
        .text(data.patient.address, col1X + 55, y);
    }

    doc.moveDown(2);
  }

  private drawTestInfo(doc: PDFKit.PDFDocument, data: RequisitionData): void {
    const startY = 290;

    // Section header
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#1a365d')
      .text('TEST PANEL INFORMATION', 50, startY)
      .fillColor('black')
      .moveTo(50, startY + 18)
      .lineTo(560, startY + 18)
      .stroke();

    let y = startY + 30;

    // Panel name
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('Panel:', 50, y)
      .font('Helvetica')
      .text(data.panelName, 100, y);

    y += 25;

    // Lab provider
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('Lab Provider:', 50, y)
      .font('Helvetica')
      .text(data.labProvider, 130, y);

    y += 20;

    // Test codes if available
    if (data.panelCodes) {
      try {
        const codes = JSON.parse(data.panelCodes);
        if (Array.isArray(codes) && codes.length > 0) {
          doc
            .font('Helvetica-Bold')
            .text('Test Codes:', 50, y)
            .font('Helvetica')
            .text(codes.join(', '), 130, y);
          y += 20;
        }
      } catch {
        // Ignore parse errors
      }
    }

    // Payment info
    doc
      .font('Helvetica-Bold')
      .text('Payment:', 50, y)
      .font('Helvetica')
      .text(data.patientPay ? 'Patient Pay' : 'Clinic Pay', 115, y)
      .text(`Amount: $${data.price.toFixed(2)}`, 300, y);

    doc.moveDown(2);
  }

  private drawProviderInfo(doc: PDFKit.PDFDocument, data: RequisitionData): void {
    const startY = 420;

    // Section header
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#1a365d')
      .text('ORDERING PROVIDER', 50, startY)
      .fillColor('black')
      .moveTo(50, startY + 18)
      .lineTo(560, startY + 18)
      .stroke();

    let y = startY + 30;

    if (data.orderingProvider) {
      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .text('Provider:', 50, y)
        .font('Helvetica')
        .text(
          `${data.orderingProvider.firstName} ${data.orderingProvider.lastName}`,
          115,
          y,
        );

      y += 20;

      if (data.orderingProvider.specialty) {
        doc
          .font('Helvetica-Bold')
          .text('Specialty:', 50, y)
          .font('Helvetica')
          .text(data.orderingProvider.specialty, 115, y);
        y += 20;
      }

      if (data.orderingProvider.deaNumber) {
        doc
          .font('Helvetica-Bold')
          .text('DEA #:', 50, y)
          .font('Helvetica')
          .text(data.orderingProvider.deaNumber, 100, y);
      }
    } else {
      doc
        .font('Helvetica')
        .fontSize(11)
        .text('Provider information will be added by clinic staff.', 50, y);
    }

    doc.moveDown(2);
  }

  private drawInstructions(doc: PDFKit.PDFDocument, data: RequisitionData): void {
    const startY = 520;

    // Section header
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#1a365d')
      .text('DRAW SITE & INSTRUCTIONS', 50, startY)
      .fillColor('black')
      .moveTo(50, startY + 18)
      .lineTo(560, startY + 18)
      .stroke();

    let y = startY + 30;

    // Draw site
    if (data.drawSiteAddress) {
      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .text('Draw Site:', 50, y)
        .font('Helvetica')
        .text(data.drawSiteAddress, 120, y);
      y += 20;
    }

    // Scheduled date
    if (data.scheduledDrawDate) {
      doc
        .font('Helvetica-Bold')
        .text('Scheduled:', 50, y)
        .font('Helvetica')
        .text(new Date(data.scheduledDrawDate).toLocaleDateString(), 120, y);
      y += 20;
    }

    // Instructions box
    y += 10;
    doc
      .rect(50, y, 510, 80)
      .fillAndStroke('#f7fafc', '#e2e8f0');

    doc
      .fillColor('black')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('PATIENT INSTRUCTIONS:', 60, y + 10)
      .font('Helvetica')
      .fontSize(9)
      .text(
        '1. Bring this requisition form and a valid photo ID to the draw site.',
        60,
        y + 25,
      )
      .text(
        '2. Fasting may be required for certain tests. Please confirm with your provider.',
        60,
        y + 38,
      )
      .text(
        '3. Results will be sent directly to Adonis Health for review by your provider.',
        60,
        y + 51,
      )
      .text(
        '4. Contact support@adonishealth.com if you have questions.',
        60,
        y + 64,
      );

    // Notes if any
    if (data.notes) {
      doc
        .moveDown(2)
        .font('Helvetica-Bold')
        .fontSize(10)
        .text('Additional Notes:', 50)
        .font('Helvetica')
        .text(data.notes, 50);
    }
  }

  private drawFooter(doc: PDFKit.PDFDocument, data: RequisitionData): void {
    const pageHeight = doc.page.height;

    // Signature line
    doc
      .moveTo(50, pageHeight - 120)
      .lineTo(250, pageHeight - 120)
      .stroke()
      .fontSize(9)
      .text('Patient Signature', 50, pageHeight - 115)
      .moveTo(300, pageHeight - 120)
      .lineTo(450, pageHeight - 120)
      .stroke()
      .text('Date', 300, pageHeight - 115);

    // Footer text
    doc
      .fontSize(8)
      .fillColor('#718096')
      .text(
        'This requisition is valid for 90 days from the date of issue.',
        50,
        pageHeight - 80,
        { align: 'center' },
      )
      .text(
        'Adonis Health | www.adonishealth.com | support@adonishealth.com',
        50,
        pageHeight - 65,
        { align: 'center' },
      )
      .text(
        `Generated: ${new Date().toISOString()}`,
        50,
        pageHeight - 50,
        { align: 'center' },
      );
  }

  /**
   * Get the file path for a requisition
   */
  getRequisitionPath(orderNumber: string): string {
    return path.join(this.outputDir, `requisition-${orderNumber}.pdf`);
  }

  /**
   * Check if a requisition PDF exists
   */
  requisitionExists(orderNumber: string): boolean {
    const filepath = this.getRequisitionPath(orderNumber);
    return fs.existsSync(filepath);
  }

  /**
   * Delete a requisition PDF
   */
  deleteRequisition(orderNumber: string): void {
    const filepath = this.getRequisitionPath(orderNumber);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }

  /**
   * Get the relative storage key for the requisition
   */
  getStorageKey(orderNumber: string): string {
    return `requisitions/requisition-${orderNumber}.pdf`;
  }
}

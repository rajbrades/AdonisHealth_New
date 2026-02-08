"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequisitionPdfService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let RequisitionPdfService = class RequisitionPdfService {
    outputDir;
    constructor() {
        this.outputDir = path.join(process.cwd(), 'uploads', 'requisitions');
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }
    async generateRequisition(data) {
        const filename = `requisition-${data.orderNumber}.pdf`;
        const filepath = path.join(this.outputDir, filename);
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({
                size: 'LETTER',
                margins: { top: 50, bottom: 50, left: 50, right: 50 },
            });
            const stream = fs.createWriteStream(filepath);
            doc.pipe(stream);
            this.drawHeader(doc, data);
            this.drawPatientInfo(doc, data);
            this.drawTestInfo(doc, data);
            this.drawProviderInfo(doc, data);
            this.drawInstructions(doc, data);
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
    drawHeader(doc, data) {
        doc
            .fontSize(24)
            .font('Helvetica-Bold')
            .text('ADONIS HEALTH', 50, 50, { align: 'center' })
            .fontSize(12)
            .font('Helvetica')
            .text('Laboratory Requisition Form', { align: 'center' })
            .moveDown(0.5);
        const orderBoxY = 100;
        doc
            .rect(400, orderBoxY, 160, 40)
            .stroke()
            .fontSize(10)
            .text('Order Number:', 410, orderBoxY + 5)
            .fontSize(14)
            .font('Helvetica-Bold')
            .text(data.orderNumber, 410, orderBoxY + 20);
        doc
            .font('Helvetica')
            .fontSize(10)
            .text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`, 50, orderBoxY + 10);
        doc.moveDown(3);
    }
    drawPatientInfo(doc, data) {
        const startY = 160;
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
        doc
            .font('Helvetica-Bold')
            .text('Email:', col1X, y)
            .font('Helvetica')
            .text(data.patient.user.email, col1X + 50, y);
        y += 20;
        if (data.patient.address) {
            doc
                .font('Helvetica-Bold')
                .text('Address:', col1X, y)
                .font('Helvetica')
                .text(data.patient.address, col1X + 55, y);
        }
        doc.moveDown(2);
    }
    drawTestInfo(doc, data) {
        const startY = 290;
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
        doc
            .font('Helvetica-Bold')
            .fontSize(12)
            .text('Panel:', 50, y)
            .font('Helvetica')
            .text(data.panelName, 100, y);
        y += 25;
        doc
            .font('Helvetica-Bold')
            .fontSize(11)
            .text('Lab Provider:', 50, y)
            .font('Helvetica')
            .text(data.labProvider, 130, y);
        y += 20;
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
            }
            catch {
            }
        }
        doc
            .font('Helvetica-Bold')
            .text('Payment:', 50, y)
            .font('Helvetica')
            .text(data.patientPay ? 'Patient Pay' : 'Clinic Pay', 115, y)
            .text(`Amount: $${data.price.toFixed(2)}`, 300, y);
        doc.moveDown(2);
    }
    drawProviderInfo(doc, data) {
        const startY = 420;
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
                .text(`${data.orderingProvider.firstName} ${data.orderingProvider.lastName}`, 115, y);
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
        }
        else {
            doc
                .font('Helvetica')
                .fontSize(11)
                .text('Provider information will be added by clinic staff.', 50, y);
        }
        doc.moveDown(2);
    }
    drawInstructions(doc, data) {
        const startY = 520;
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
        if (data.drawSiteAddress) {
            doc
                .font('Helvetica-Bold')
                .fontSize(11)
                .text('Draw Site:', 50, y)
                .font('Helvetica')
                .text(data.drawSiteAddress, 120, y);
            y += 20;
        }
        if (data.scheduledDrawDate) {
            doc
                .font('Helvetica-Bold')
                .text('Scheduled:', 50, y)
                .font('Helvetica')
                .text(new Date(data.scheduledDrawDate).toLocaleDateString(), 120, y);
            y += 20;
        }
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
            .text('1. Bring this requisition form and a valid photo ID to the draw site.', 60, y + 25)
            .text('2. Fasting may be required for certain tests. Please confirm with your provider.', 60, y + 38)
            .text('3. Results will be sent directly to Adonis Health for review by your provider.', 60, y + 51)
            .text('4. Contact support@adonishealth.com if you have questions.', 60, y + 64);
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
    drawFooter(doc, data) {
        const pageHeight = doc.page.height;
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
        doc
            .fontSize(8)
            .fillColor('#718096')
            .text('This requisition is valid for 90 days from the date of issue.', 50, pageHeight - 80, { align: 'center' })
            .text('Adonis Health | www.adonishealth.com | support@adonishealth.com', 50, pageHeight - 65, { align: 'center' })
            .text(`Generated: ${new Date().toISOString()}`, 50, pageHeight - 50, { align: 'center' });
    }
    getRequisitionPath(orderNumber) {
        return path.join(this.outputDir, `requisition-${orderNumber}.pdf`);
    }
    requisitionExists(orderNumber) {
        const filepath = this.getRequisitionPath(orderNumber);
        return fs.existsSync(filepath);
    }
    deleteRequisition(orderNumber) {
        const filepath = this.getRequisitionPath(orderNumber);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    }
    getStorageKey(orderNumber) {
        return `requisitions/requisition-${orderNumber}.pdf`;
    }
};
exports.RequisitionPdfService = RequisitionPdfService;
exports.RequisitionPdfService = RequisitionPdfService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RequisitionPdfService);
//# sourceMappingURL=requisition-pdf.service.js.map
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { UpdateLabOrderDto, UpdateLabOrderStatusDto } from './dto/update-lab-order.dto';
import { RequisitionPdfService } from './requisition-pdf.service';
import { EmailService } from '../email/email.service';
export declare enum LabOrderStatus {
    PENDING = "PENDING",
    REQUISITION_READY = "REQUISITION_READY",
    SENT_TO_PATIENT = "SENT_TO_PATIENT",
    SAMPLE_COLLECTED = "SAMPLE_COLLECTED",
    PROCESSING = "PROCESSING",
    RESULTS_RECEIVED = "RESULTS_RECEIVED",
    REVIEWED = "REVIEWED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class LabOrdersService {
    private prisma;
    private requisitionPdfService;
    private emailService;
    constructor(prisma: PrismaService, requisitionPdfService: RequisitionPdfService, emailService: EmailService);
    private generateOrderNumber;
    create(createLabOrderDto: CreateLabOrderDto): Promise<{
        patient: {
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
            shippingAddress: string | null;
            weight: number | null;
            weightUpdatedAt: Date | null;
        };
        orderingProvider: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            specialty: string | null;
            deaNumber: string | null;
        } | null;
    } & {
        id: string;
        labProvider: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        notes: string | null;
        patientId: string;
        status: string;
        panelName: string;
        panelCodes: string | null;
        patientPay: boolean;
        drawSiteAddress: string | null;
        scheduledDrawDate: Date | null;
        orderingProviderId: string | null;
        orderNumber: string;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
        actualDrawDate: Date | null;
        labPanelId: string | null;
    }>;
    findAll(filters?: {
        patientId?: string;
        status?: string;
        labProvider?: string;
    }): Promise<({
        patient: {
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
            shippingAddress: string | null;
            weight: number | null;
            weightUpdatedAt: Date | null;
        };
        labPanel: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            provider: string;
            metadata: string | null;
            panelName: string;
            labType: string;
            providerLabId: string | null;
            collectionDate: Date;
            receivedDate: Date | null;
            reportDate: Date | null;
            uploadedAt: Date;
            processingStatus: string | null;
            processingError: string | null;
            reviewedById: string | null;
            reviewedAt: Date | null;
            reviewNotes: string | null;
            originalFileId: string | null;
        } | null;
        orderingProvider: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            specialty: string | null;
            deaNumber: string | null;
        } | null;
    } & {
        id: string;
        labProvider: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        notes: string | null;
        patientId: string;
        status: string;
        panelName: string;
        panelCodes: string | null;
        patientPay: boolean;
        drawSiteAddress: string | null;
        scheduledDrawDate: Date | null;
        orderingProviderId: string | null;
        orderNumber: string;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
        actualDrawDate: Date | null;
        labPanelId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        patient: {
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
            shippingAddress: string | null;
            weight: number | null;
            weightUpdatedAt: Date | null;
        };
        labPanel: ({
            results: ({
                biomarker: {
                    genderSpecificRanges: string | null;
                    subcategory: string | null;
                    id: string;
                    code: string;
                    name: string;
                    category: string;
                    defaultUnit: string;
                    optimalRangeLow: number | null;
                    optimalRangeHigh: number | null;
                    refRangeLow: number | null;
                    refRangeHigh: number | null;
                    ageSpecificRanges: string | null;
                    description: string | null;
                    clinicalNotes: string | null;
                    displayOrder: number;
                    isActive: boolean;
                };
            } & {
                id: string;
                optimalRangeLow: number | null;
                optimalRangeHigh: number | null;
                refRangeLow: number | null;
                refRangeHigh: number | null;
                biomarkerId: string;
                createdAt: Date;
                labPanelId: string;
                rawValue: string;
                rawUnit: string | null;
                numericValue: number | null;
                normalizedUnit: string | null;
                flag: string | null;
                isManualEntry: boolean;
                extractionConfidence: number | null;
                providerNote: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            provider: string;
            metadata: string | null;
            panelName: string;
            labType: string;
            providerLabId: string | null;
            collectionDate: Date;
            receivedDate: Date | null;
            reportDate: Date | null;
            uploadedAt: Date;
            processingStatus: string | null;
            processingError: string | null;
            reviewedById: string | null;
            reviewedAt: Date | null;
            reviewNotes: string | null;
            originalFileId: string | null;
        }) | null;
        orderingProvider: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            specialty: string | null;
            deaNumber: string | null;
        } | null;
    } & {
        id: string;
        labProvider: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        notes: string | null;
        patientId: string;
        status: string;
        panelName: string;
        panelCodes: string | null;
        patientPay: boolean;
        drawSiteAddress: string | null;
        scheduledDrawDate: Date | null;
        orderingProviderId: string | null;
        orderNumber: string;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
        actualDrawDate: Date | null;
        labPanelId: string | null;
    }>;
    findByOrderNumber(orderNumber: string): Promise<{
        patient: {
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
            shippingAddress: string | null;
            weight: number | null;
            weightUpdatedAt: Date | null;
        };
        labPanel: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            provider: string;
            metadata: string | null;
            panelName: string;
            labType: string;
            providerLabId: string | null;
            collectionDate: Date;
            receivedDate: Date | null;
            reportDate: Date | null;
            uploadedAt: Date;
            processingStatus: string | null;
            processingError: string | null;
            reviewedById: string | null;
            reviewedAt: Date | null;
            reviewNotes: string | null;
            originalFileId: string | null;
        } | null;
        orderingProvider: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            specialty: string | null;
            deaNumber: string | null;
        } | null;
    } & {
        id: string;
        labProvider: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        notes: string | null;
        patientId: string;
        status: string;
        panelName: string;
        panelCodes: string | null;
        patientPay: boolean;
        drawSiteAddress: string | null;
        scheduledDrawDate: Date | null;
        orderingProviderId: string | null;
        orderNumber: string;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
        actualDrawDate: Date | null;
        labPanelId: string | null;
    }>;
    update(id: string, updateLabOrderDto: UpdateLabOrderDto): Promise<{
        patient: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
            shippingAddress: string | null;
            weight: number | null;
            weightUpdatedAt: Date | null;
        };
        labPanel: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            provider: string;
            metadata: string | null;
            panelName: string;
            labType: string;
            providerLabId: string | null;
            collectionDate: Date;
            receivedDate: Date | null;
            reportDate: Date | null;
            uploadedAt: Date;
            processingStatus: string | null;
            processingError: string | null;
            reviewedById: string | null;
            reviewedAt: Date | null;
            reviewNotes: string | null;
            originalFileId: string | null;
        } | null;
        orderingProvider: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            specialty: string | null;
            deaNumber: string | null;
        } | null;
    } & {
        id: string;
        labProvider: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        notes: string | null;
        patientId: string;
        status: string;
        panelName: string;
        panelCodes: string | null;
        patientPay: boolean;
        drawSiteAddress: string | null;
        scheduledDrawDate: Date | null;
        orderingProviderId: string | null;
        orderNumber: string;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
        actualDrawDate: Date | null;
        labPanelId: string | null;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateLabOrderStatusDto): Promise<{
        patient: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
            shippingAddress: string | null;
            weight: number | null;
            weightUpdatedAt: Date | null;
        };
        labPanel: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            provider: string;
            metadata: string | null;
            panelName: string;
            labType: string;
            providerLabId: string | null;
            collectionDate: Date;
            receivedDate: Date | null;
            reportDate: Date | null;
            uploadedAt: Date;
            processingStatus: string | null;
            processingError: string | null;
            reviewedById: string | null;
            reviewedAt: Date | null;
            reviewNotes: string | null;
            originalFileId: string | null;
        } | null;
        orderingProvider: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            specialty: string | null;
            deaNumber: string | null;
        } | null;
    } & {
        id: string;
        labProvider: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        notes: string | null;
        patientId: string;
        status: string;
        panelName: string;
        panelCodes: string | null;
        patientPay: boolean;
        drawSiteAddress: string | null;
        scheduledDrawDate: Date | null;
        orderingProviderId: string | null;
        orderNumber: string;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
        actualDrawDate: Date | null;
        labPanelId: string | null;
    }>;
    linkResults(labOrderId: string, labPanelId: string): Promise<{
        patient: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
            shippingAddress: string | null;
            weight: number | null;
            weightUpdatedAt: Date | null;
        };
        labPanel: ({
            results: ({
                biomarker: {
                    genderSpecificRanges: string | null;
                    subcategory: string | null;
                    id: string;
                    code: string;
                    name: string;
                    category: string;
                    defaultUnit: string;
                    optimalRangeLow: number | null;
                    optimalRangeHigh: number | null;
                    refRangeLow: number | null;
                    refRangeHigh: number | null;
                    ageSpecificRanges: string | null;
                    description: string | null;
                    clinicalNotes: string | null;
                    displayOrder: number;
                    isActive: boolean;
                };
            } & {
                id: string;
                optimalRangeLow: number | null;
                optimalRangeHigh: number | null;
                refRangeLow: number | null;
                refRangeHigh: number | null;
                biomarkerId: string;
                createdAt: Date;
                labPanelId: string;
                rawValue: string;
                rawUnit: string | null;
                numericValue: number | null;
                normalizedUnit: string | null;
                flag: string | null;
                isManualEntry: boolean;
                extractionConfidence: number | null;
                providerNote: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            provider: string;
            metadata: string | null;
            panelName: string;
            labType: string;
            providerLabId: string | null;
            collectionDate: Date;
            receivedDate: Date | null;
            reportDate: Date | null;
            uploadedAt: Date;
            processingStatus: string | null;
            processingError: string | null;
            reviewedById: string | null;
            reviewedAt: Date | null;
            reviewNotes: string | null;
            originalFileId: string | null;
        }) | null;
        orderingProvider: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            specialty: string | null;
            deaNumber: string | null;
        } | null;
    } & {
        id: string;
        labProvider: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        notes: string | null;
        patientId: string;
        status: string;
        panelName: string;
        panelCodes: string | null;
        patientPay: boolean;
        drawSiteAddress: string | null;
        scheduledDrawDate: Date | null;
        orderingProviderId: string | null;
        orderNumber: string;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
        actualDrawDate: Date | null;
        labPanelId: string | null;
    }>;
    cancel(id: string, reason?: string): Promise<{
        id: string;
        labProvider: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        notes: string | null;
        patientId: string;
        status: string;
        panelName: string;
        panelCodes: string | null;
        patientPay: boolean;
        drawSiteAddress: string | null;
        scheduledDrawDate: Date | null;
        orderingProviderId: string | null;
        orderNumber: string;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
        actualDrawDate: Date | null;
        labPanelId: string | null;
    }>;
    findByPatient(patientId: string): Promise<({
        patient: {
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
            shippingAddress: string | null;
            weight: number | null;
            weightUpdatedAt: Date | null;
        };
        labPanel: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            provider: string;
            metadata: string | null;
            panelName: string;
            labType: string;
            providerLabId: string | null;
            collectionDate: Date;
            receivedDate: Date | null;
            reportDate: Date | null;
            uploadedAt: Date;
            processingStatus: string | null;
            processingError: string | null;
            reviewedById: string | null;
            reviewedAt: Date | null;
            reviewNotes: string | null;
            originalFileId: string | null;
        } | null;
        orderingProvider: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            specialty: string | null;
            deaNumber: string | null;
        } | null;
    } & {
        id: string;
        labProvider: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        notes: string | null;
        patientId: string;
        status: string;
        panelName: string;
        panelCodes: string | null;
        patientPay: boolean;
        drawSiteAddress: string | null;
        scheduledDrawDate: Date | null;
        orderingProviderId: string | null;
        orderNumber: string;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
        actualDrawDate: Date | null;
        labPanelId: string | null;
    })[]>;
    findPendingOrders(): Promise<({
        patient: {
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
            shippingAddress: string | null;
            weight: number | null;
            weightUpdatedAt: Date | null;
        };
        labPanel: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            status: string;
            provider: string;
            metadata: string | null;
            panelName: string;
            labType: string;
            providerLabId: string | null;
            collectionDate: Date;
            receivedDate: Date | null;
            reportDate: Date | null;
            uploadedAt: Date;
            processingStatus: string | null;
            processingError: string | null;
            reviewedById: string | null;
            reviewedAt: Date | null;
            reviewNotes: string | null;
            originalFileId: string | null;
        } | null;
        orderingProvider: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            specialty: string | null;
            deaNumber: string | null;
        } | null;
    } & {
        id: string;
        labProvider: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        notes: string | null;
        patientId: string;
        status: string;
        panelName: string;
        panelCodes: string | null;
        patientPay: boolean;
        drawSiteAddress: string | null;
        scheduledDrawDate: Date | null;
        orderingProviderId: string | null;
        orderNumber: string;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
        actualDrawDate: Date | null;
        labPanelId: string | null;
    })[]>;
    findAwaitingResults(): Promise<({
        patient: {
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
            shippingAddress: string | null;
            weight: number | null;
            weightUpdatedAt: Date | null;
        };
        orderingProvider: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            specialty: string | null;
            deaNumber: string | null;
        } | null;
    } & {
        id: string;
        labProvider: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        notes: string | null;
        patientId: string;
        status: string;
        panelName: string;
        panelCodes: string | null;
        patientPay: boolean;
        drawSiteAddress: string | null;
        scheduledDrawDate: Date | null;
        orderingProviderId: string | null;
        orderNumber: string;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
        actualDrawDate: Date | null;
        labPanelId: string | null;
    })[]>;
    generateRequisition(id: string): Promise<{
        filepath: string;
        storageKey: string;
    }>;
    getRequisitionPath(orderNumber: string): string;
    requisitionExists(orderNumber: string): boolean;
    sendToPatient(id: string): Promise<{
        success: boolean;
        messageId?: string;
    }>;
}

import type { Response } from 'express';
import { LabOrdersService } from './lab-orders.service';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { UpdateLabOrderDto, UpdateLabOrderStatusDto } from './dto/update-lab-order.dto';
export declare class LabOrdersController {
    private readonly labOrdersService;
    constructor(labOrdersService: LabOrdersService);
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
        actualDrawDate: Date | null;
        labPanelId: string | null;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        orderNumber: string;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
    }>;
    findAll(patientId?: string, status?: string, labProvider?: string): Promise<({
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
        };
        labPanel: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            provider: string;
            metadata: string | null;
            status: string;
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
        actualDrawDate: Date | null;
        labPanelId: string | null;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        orderNumber: string;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
    })[]>;
    findPending(): Promise<({
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
        };
        labPanel: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            provider: string;
            metadata: string | null;
            status: string;
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
        actualDrawDate: Date | null;
        labPanelId: string | null;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        orderNumber: string;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
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
        actualDrawDate: Date | null;
        labPanelId: string | null;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        orderNumber: string;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
    })[]>;
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
        };
        labPanel: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            provider: string;
            metadata: string | null;
            status: string;
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
        actualDrawDate: Date | null;
        labPanelId: string | null;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        orderNumber: string;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
    })[]>;
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
        };
        labPanel: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            provider: string;
            metadata: string | null;
            status: string;
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
        actualDrawDate: Date | null;
        labPanelId: string | null;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        orderNumber: string;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
    }>;
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
            provider: string;
            metadata: string | null;
            status: string;
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
        actualDrawDate: Date | null;
        labPanelId: string | null;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        orderNumber: string;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
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
        };
        labPanel: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            provider: string;
            metadata: string | null;
            status: string;
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
        actualDrawDate: Date | null;
        labPanelId: string | null;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        orderNumber: string;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
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
        };
        labPanel: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            provider: string;
            metadata: string | null;
            status: string;
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
        actualDrawDate: Date | null;
        labPanelId: string | null;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        orderNumber: string;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
    }>;
    linkResults(id: string, labPanelId: string): Promise<{
        patient: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
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
            provider: string;
            metadata: string | null;
            status: string;
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
        actualDrawDate: Date | null;
        labPanelId: string | null;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        orderNumber: string;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
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
        actualDrawDate: Date | null;
        labPanelId: string | null;
        evexiaOrderId: string | null;
        evexiaStatus: string | null;
        orderNumber: string;
        requisitionPdfKey: string | null;
        requisitionSentAt: Date | null;
    }>;
    generateRequisition(id: string): Promise<{
        message: string;
        storageKey: string;
    }>;
    downloadRequisition(id: string, res: Response): Promise<void>;
    sendToPatient(id: string): Promise<{
        success: boolean;
        messageId?: string;
        message: string;
    }>;
}

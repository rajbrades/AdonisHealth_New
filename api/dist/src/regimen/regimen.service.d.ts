import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateRegimenDto } from './dto/create-regimen.dto';
import { UpdateRegimenDto, DiscontinueRegimenDto } from './dto/update-regimen.dto';
export declare class RegimenService {
    private prisma;
    private auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    create(userId: string, createDto: CreateRegimenDto): Promise<{
        changeHistory: {
            id: string;
            notes: string | null;
            createdAt: Date;
            userId: string | null;
            changeType: string;
            fieldChanged: string | null;
            oldValue: string | null;
            newValue: string | null;
            changedBy: string;
            reason: string | null;
            regimenId: string;
        }[];
    } & {
        id: string;
        name: string;
        dosage: string | null;
        frequency: string | null;
        type: string;
        source: string;
        active: boolean;
        startDate: Date | null;
        endDate: Date | null;
        notes: string | null;
        patientId: string;
        productId: string | null;
    }>;
    findAll(userId: string, activeOnly?: boolean): Promise<({
        changeHistory: {
            id: string;
            notes: string | null;
            createdAt: Date;
            userId: string | null;
            changeType: string;
            fieldChanged: string | null;
            oldValue: string | null;
            newValue: string | null;
            changedBy: string;
            reason: string | null;
            regimenId: string;
        }[];
    } & {
        id: string;
        name: string;
        dosage: string | null;
        frequency: string | null;
        type: string;
        source: string;
        active: boolean;
        startDate: Date | null;
        endDate: Date | null;
        notes: string | null;
        patientId: string;
        productId: string | null;
    })[]>;
    findOne(userId: string, regimenId: string): Promise<{
        patient: {
            user: {
                id: string;
                email: string;
                password: string;
                role: string;
                passwordChangedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
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
        };
    } & {
        id: string;
        name: string;
        dosage: string | null;
        frequency: string | null;
        type: string;
        source: string;
        active: boolean;
        startDate: Date | null;
        endDate: Date | null;
        notes: string | null;
        patientId: string;
        productId: string | null;
    }>;
    update(userId: string, regimenId: string, updateDto: UpdateRegimenDto): Promise<({
        patient: {
            user: {
                id: string;
                email: string;
                password: string;
                role: string;
                passwordChangedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
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
        };
    } & {
        id: string;
        name: string;
        dosage: string | null;
        frequency: string | null;
        type: string;
        source: string;
        active: boolean;
        startDate: Date | null;
        endDate: Date | null;
        notes: string | null;
        patientId: string;
        productId: string | null;
    }) | ({
        changeHistory: {
            id: string;
            notes: string | null;
            createdAt: Date;
            userId: string | null;
            changeType: string;
            fieldChanged: string | null;
            oldValue: string | null;
            newValue: string | null;
            changedBy: string;
            reason: string | null;
            regimenId: string;
        }[];
    } & {
        id: string;
        name: string;
        dosage: string | null;
        frequency: string | null;
        type: string;
        source: string;
        active: boolean;
        startDate: Date | null;
        endDate: Date | null;
        notes: string | null;
        patientId: string;
        productId: string | null;
    })>;
    discontinue(userId: string, regimenId: string, discontinueDto: DiscontinueRegimenDto): Promise<{
        changeHistory: {
            id: string;
            notes: string | null;
            createdAt: Date;
            userId: string | null;
            changeType: string;
            fieldChanged: string | null;
            oldValue: string | null;
            newValue: string | null;
            changedBy: string;
            reason: string | null;
            regimenId: string;
        }[];
    } & {
        id: string;
        name: string;
        dosage: string | null;
        frequency: string | null;
        type: string;
        source: string;
        active: boolean;
        startDate: Date | null;
        endDate: Date | null;
        notes: string | null;
        patientId: string;
        productId: string | null;
    }>;
    getHistory(userId: string, regimenId: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        userId: string | null;
        changeType: string;
        fieldChanged: string | null;
        oldValue: string | null;
        newValue: string | null;
        changedBy: string;
        reason: string | null;
        regimenId: string;
    }[]>;
}

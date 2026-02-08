import { RegimenService } from './regimen.service';
import { CreateRegimenDto } from './dto/create-regimen.dto';
import { UpdateRegimenDto, DiscontinueRegimenDto } from './dto/update-regimen.dto';
export declare class RegimenController {
    private readonly regimenService;
    constructor(regimenService: RegimenService);
    create(req: any, createDto: CreateRegimenDto): Promise<{
        changeHistory: {
            id: string;
            createdAt: Date;
            userId: string | null;
            notes: string | null;
            reason: string | null;
            changeType: string;
            fieldChanged: string | null;
            oldValue: string | null;
            newValue: string | null;
            changedBy: string;
            regimenId: string;
        }[];
    } & {
        id: string;
        name: string;
        type: string;
        dosage: string | null;
        frequency: string | null;
        source: string;
        active: boolean;
        startDate: Date | null;
        endDate: Date | null;
        notes: string | null;
        patientId: string;
        productId: string | null;
    }>;
    findAll(req: any, activeOnly?: string): Promise<({
        changeHistory: {
            id: string;
            createdAt: Date;
            userId: string | null;
            notes: string | null;
            reason: string | null;
            changeType: string;
            fieldChanged: string | null;
            oldValue: string | null;
            newValue: string | null;
            changedBy: string;
            regimenId: string;
        }[];
    } & {
        id: string;
        name: string;
        type: string;
        dosage: string | null;
        frequency: string | null;
        source: string;
        active: boolean;
        startDate: Date | null;
        endDate: Date | null;
        notes: string | null;
        patientId: string;
        productId: string | null;
    })[]>;
    findOne(req: any, id: string): Promise<{
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
            weight: number | null;
            weightUpdatedAt: Date | null;
        };
    } & {
        id: string;
        name: string;
        type: string;
        dosage: string | null;
        frequency: string | null;
        source: string;
        active: boolean;
        startDate: Date | null;
        endDate: Date | null;
        notes: string | null;
        patientId: string;
        productId: string | null;
    }>;
    update(req: any, id: string, updateDto: UpdateRegimenDto): Promise<({
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
            weight: number | null;
            weightUpdatedAt: Date | null;
        };
    } & {
        id: string;
        name: string;
        type: string;
        dosage: string | null;
        frequency: string | null;
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
            createdAt: Date;
            userId: string | null;
            notes: string | null;
            reason: string | null;
            changeType: string;
            fieldChanged: string | null;
            oldValue: string | null;
            newValue: string | null;
            changedBy: string;
            regimenId: string;
        }[];
    } & {
        id: string;
        name: string;
        type: string;
        dosage: string | null;
        frequency: string | null;
        source: string;
        active: boolean;
        startDate: Date | null;
        endDate: Date | null;
        notes: string | null;
        patientId: string;
        productId: string | null;
    })>;
    discontinue(req: any, id: string, discontinueDto: DiscontinueRegimenDto): Promise<{
        changeHistory: {
            id: string;
            createdAt: Date;
            userId: string | null;
            notes: string | null;
            reason: string | null;
            changeType: string;
            fieldChanged: string | null;
            oldValue: string | null;
            newValue: string | null;
            changedBy: string;
            regimenId: string;
        }[];
    } & {
        id: string;
        name: string;
        type: string;
        dosage: string | null;
        frequency: string | null;
        source: string;
        active: boolean;
        startDate: Date | null;
        endDate: Date | null;
        notes: string | null;
        patientId: string;
        productId: string | null;
    }>;
    getHistory(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        notes: string | null;
        reason: string | null;
        changeType: string;
        fieldChanged: string | null;
        oldValue: string | null;
        newValue: string | null;
        changedBy: string;
        regimenId: string;
    }[]>;
}

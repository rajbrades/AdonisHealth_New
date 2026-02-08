import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: CreateAppointmentDto, req: any): Promise<{
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
        provider: ({
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
            specialty: string | null;
            deaNumber: string | null;
        }) | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        notes: string | null;
        patientId: string;
        date: Date;
        title: string;
        status: string;
        duration: number;
        location: string | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        providerId: string | null;
        rescheduledFromId: string | null;
    }>;
    findAll(req: any): Promise<({
        provider: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            specialty: string | null;
            deaNumber: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        notes: string | null;
        patientId: string;
        date: Date;
        title: string;
        status: string;
        duration: number;
        location: string | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        providerId: string | null;
        rescheduledFromId: string | null;
    })[]>;
    findOne(id: string): Promise<({
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
        };
        provider: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            specialty: string | null;
            deaNumber: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        notes: string | null;
        patientId: string;
        date: Date;
        title: string;
        status: string;
        duration: number;
        location: string | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        providerId: string | null;
        rescheduledFromId: string | null;
    }) | null>;
    cancel(id: string, reason: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        notes: string | null;
        patientId: string;
        date: Date;
        title: string;
        status: string;
        duration: number;
        location: string | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        providerId: string | null;
        rescheduledFromId: string | null;
    }>;
    reschedule(id: string, newDate?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        notes: string | null;
        patientId: string;
        date: Date;
        title: string;
        status: string;
        duration: number;
        location: string | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        providerId: string | null;
        rescheduledFromId: string | null;
    }>;
}

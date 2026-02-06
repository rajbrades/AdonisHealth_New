export declare class CreateLabOrderDto {
    patientId: string;
    panelName: string;
    panelCodes?: string;
    labProvider?: string;
    price: number;
    patientPay?: boolean;
    drawSiteAddress?: string;
    scheduledDrawDate?: string;
    orderingProviderId?: string;
    notes?: string;
}

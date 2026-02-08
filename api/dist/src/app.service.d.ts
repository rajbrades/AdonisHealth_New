export declare class AppService {
    getHello(): {
        name: string;
        version: string;
        description: string;
        status: string;
        endpoints: {
            auth: string;
            patients: string;
            quotes: string;
            labOrders: string;
            labs: string;
            concierge: string;
        };
        documentation: string;
    };
}

import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
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

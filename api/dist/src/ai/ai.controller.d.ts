import { BriefingService } from './briefing.service';
export declare class AiController {
    private readonly briefingService;
    constructor(briefingService: BriefingService);
    generateBriefing(id: string): Promise<any>;
}

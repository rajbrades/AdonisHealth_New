
import { Controller, Post, Param, Get } from '@nestjs/common';
import { BriefingService } from './briefing.service';

@Controller('ai')
export class AiController {
    constructor(private readonly briefingService: BriefingService) { }

    @Post('appointments/:id/briefing')
    async generateBriefing(@Param('id') id: string) {
        return this.briefingService.generateBriefingForAppointment(id);
    }
}

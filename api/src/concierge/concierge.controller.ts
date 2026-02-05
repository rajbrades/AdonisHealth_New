import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConciergeService } from './concierge.service';
import { CreateCheckInDto } from './dto/create-checkin.dto';

@Controller('concierge')
export class ConciergeController {
    constructor(private readonly conciergeService: ConciergeService) { }

    @Post('checkin')
    createCheckIn(@Body() dto: CreateCheckInDto) {
        return this.conciergeService.createCheckIn(dto);
    }

    @Get('patient/:id/trends')
    getTrends(@Param('id') id: string) {
        return this.conciergeService.getPatientTrends(id);
    }

    @Get('patient/:id/timeline')
    getTimeline(@Param('id') id: string) {
        return this.conciergeService.getPatientTimeline(id);
    }
}

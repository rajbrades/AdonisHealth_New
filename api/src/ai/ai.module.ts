
import { Module } from '@nestjs/common';
import { BriefingService } from './briefing.service';
import { AiController } from './ai.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AiController],
    providers: [BriefingService],
    exports: [BriefingService],
})
export class AiModule { }

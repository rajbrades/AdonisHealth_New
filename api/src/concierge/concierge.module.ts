import { Module } from '@nestjs/common';
import { ConciergeService } from './concierge.service';
import { ConciergeController } from './concierge.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ConciergeController],
    providers: [ConciergeService],
})
export class ConciergeModule { }

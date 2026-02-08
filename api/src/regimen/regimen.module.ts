import { Module } from '@nestjs/common';
import { RegimenController } from './regimen.controller';
import { RegimenService } from './regimen.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
    imports: [PrismaModule, AuditModule],
    controllers: [RegimenController],
    providers: [RegimenService],
    exports: [RegimenService],
})
export class RegimenModule { }

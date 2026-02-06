import { Module } from '@nestjs/common';
import { LabOrdersController } from './lab-orders.controller';
import { LabOrdersService } from './lab-orders.service';
import { RequisitionPdfService } from './requisition-pdf.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LabOrdersController],
  providers: [LabOrdersService, RequisitionPdfService],
  exports: [LabOrdersService, RequisitionPdfService],
})
export class LabOrdersModule {}

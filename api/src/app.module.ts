import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { QuotesModule } from './quotes/quotes.module';
import { ConciergeModule } from './concierge/concierge.module';
import { AuditModule } from './audit/audit.module';
import { LabsModule } from './labs/labs.module';
import { LabOrdersModule } from './lab-orders/lab-orders.module';
import { EmailModule } from './email/email.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { RegimenModule } from './regimen/regimen.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, AuthModule, PatientsModule, QuotesModule, ConciergeModule, AuditModule, LabsModule, LabOrdersModule, EmailModule, AppointmentsModule, RegimenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

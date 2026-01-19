import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { QuotesModule } from './quotes/quotes.module';
import { ConciergeModule } from './concierge/concierge.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [PrismaModule, AuthModule, PatientsModule, QuotesModule, ConciergeModule, AuditModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

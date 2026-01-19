import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AuditInterceptor } from '../audit/audit.interceptor';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) { }

    @Get()
    @Roles('PROVIDER', 'CONCIERGE', 'ADMIN')
    findAll() {
        return this.patientsService.findAll();
    }

    @Get(':id')
    @Roles('PROVIDER', 'CONCIERGE', 'ADMIN')
    findOne(@Param('id') id: string) {
        return this.patientsService.findOne(id);
    }
}

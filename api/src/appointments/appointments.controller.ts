import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto, @Req() req: any) {
    return this.appointmentsService.create(createAppointmentDto, req.user.userId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.appointmentsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Body('reason') reason: string) {
    return this.appointmentsService.cancel(id, reason || 'No reason provided');
  }

  @Post(':id/reschedule')
  reschedule(@Param('id') id: string, @Body('newDate') newDate?: string) {
    const date = newDate ? new Date(newDate) : undefined;
    return this.appointmentsService.reschedule(id, date);
  }
}

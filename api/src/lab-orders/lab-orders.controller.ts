import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Res,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'fs';
import { LabOrdersService } from './lab-orders.service';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { UpdateLabOrderDto, UpdateLabOrderStatusDto } from './dto/update-lab-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('lab-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LabOrdersController {
  constructor(private readonly labOrdersService: LabOrdersService) {}

  /**
   * Create a new lab order
   * POST /lab-orders
   */
  @Post()
  @Roles('ADMIN', 'PROVIDER', 'CONCIERGE')
  create(@Body() createLabOrderDto: CreateLabOrderDto) {
    return this.labOrdersService.create(createLabOrderDto);
  }

  /**
   * Get all lab orders with optional filters
   * GET /lab-orders?patientId=...&status=...&labProvider=...
   */
  @Get()
  @Roles('ADMIN', 'PROVIDER', 'CONCIERGE')
  findAll(
    @Query('patientId') patientId?: string,
    @Query('status') status?: string,
    @Query('labProvider') labProvider?: string,
  ) {
    return this.labOrdersService.findAll({ patientId, status, labProvider });
  }

  /**
   * Get pending orders (queue for requisition generation)
   * GET /lab-orders/pending
   */
  @Get('pending')
  @Roles('ADMIN', 'PROVIDER', 'CONCIERGE')
  findPending() {
    return this.labOrdersService.findPendingOrders();
  }

  /**
   * Get orders awaiting results
   * GET /lab-orders/awaiting-results
   */
  @Get('awaiting-results')
  @Roles('ADMIN', 'PROVIDER', 'CONCIERGE')
  findAwaitingResults() {
    return this.labOrdersService.findAwaitingResults();
  }

  /**
   * Get lab orders for a specific patient
   * GET /lab-orders/patient/:patientId
   */
  @Get('patient/:patientId')
  @Roles('ADMIN', 'PROVIDER', 'CONCIERGE', 'PATIENT')
  findByPatient(@Param('patientId') patientId: string) {
    return this.labOrdersService.findByPatient(patientId);
  }

  /**
   * Get a lab order by order number
   * GET /lab-orders/order-number/:orderNumber
   */
  @Get('order-number/:orderNumber')
  @Roles('ADMIN', 'PROVIDER', 'CONCIERGE', 'PATIENT')
  findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.labOrdersService.findByOrderNumber(orderNumber);
  }

  /**
   * Get a single lab order
   * GET /lab-orders/:id
   */
  @Get(':id')
  @Roles('ADMIN', 'PROVIDER', 'CONCIERGE', 'PATIENT')
  findOne(@Param('id') id: string) {
    return this.labOrdersService.findOne(id);
  }

  /**
   * Update a lab order
   * PATCH /lab-orders/:id
   */
  @Patch(':id')
  @Roles('ADMIN', 'PROVIDER', 'CONCIERGE')
  update(@Param('id') id: string, @Body() updateLabOrderDto: UpdateLabOrderDto) {
    return this.labOrdersService.update(id, updateLabOrderDto);
  }

  /**
   * Update lab order status (with workflow validation)
   * PATCH /lab-orders/:id/status
   */
  @Patch(':id/status')
  @Roles('ADMIN', 'PROVIDER', 'CONCIERGE')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateLabOrderStatusDto,
  ) {
    return this.labOrdersService.updateStatus(id, updateStatusDto);
  }

  /**
   * Link lab results to an order
   * POST /lab-orders/:id/link-results
   */
  @Post(':id/link-results')
  @Roles('ADMIN', 'PROVIDER', 'CONCIERGE')
  linkResults(
    @Param('id') id: string,
    @Body('labPanelId') labPanelId: string,
  ) {
    return this.labOrdersService.linkResults(id, labPanelId);
  }

  /**
   * Cancel a lab order
   * DELETE /lab-orders/:id
   */
  @Delete(':id')
  @Roles('ADMIN', 'PROVIDER', 'CONCIERGE')
  cancel(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.labOrdersService.cancel(id, reason);
  }

  /**
   * Generate a requisition PDF for a lab order
   * POST /lab-orders/:id/generate-requisition
   */
  @Post(':id/generate-requisition')
  @Roles('ADMIN', 'PROVIDER', 'CONCIERGE')
  async generateRequisition(@Param('id') id: string) {
    const result = await this.labOrdersService.generateRequisition(id);
    return {
      message: 'Requisition generated successfully',
      storageKey: result.storageKey,
    };
  }

  /**
   * Download a requisition PDF
   * GET /lab-orders/:id/requisition
   */
  @Get(':id/requisition')
  @Roles('ADMIN', 'PROVIDER', 'CONCIERGE', 'PATIENT')
  async downloadRequisition(@Param('id') id: string, @Res() res: Response) {
    const labOrder = await this.labOrdersService.findOne(id);

    if (!labOrder.requisitionPdfKey) {
      throw new NotFoundException('Requisition not yet generated for this order');
    }

    const filepath = this.labOrdersService.getRequisitionPath(labOrder.orderNumber);

    if (!this.labOrdersService.requisitionExists(labOrder.orderNumber)) {
      throw new NotFoundException('Requisition PDF file not found');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="requisition-${labOrder.orderNumber}.pdf"`,
    );

    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
  }

  /**
   * Send requisition to patient via email
   * POST /lab-orders/:id/send-to-patient
   */
  @Post(':id/send-to-patient')
  @Roles('ADMIN', 'PROVIDER', 'CONCIERGE')
  async sendToPatient(@Param('id') id: string) {
    const result = await this.labOrdersService.sendToPatient(id);
    return {
      message: 'Requisition sent to patient successfully',
      ...result,
    };
  }
}

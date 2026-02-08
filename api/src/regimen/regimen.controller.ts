import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RegimenService } from './regimen.service';
import { CreateRegimenDto } from './dto/create-regimen.dto';
import { UpdateRegimenDto, DiscontinueRegimenDto } from './dto/update-regimen.dto';

@Controller('regimen')
@UseGuards(JwtAuthGuard)
export class RegimenController {
    constructor(private readonly regimenService: RegimenService) { }

    @Post()
    async create(@Req() req: any, @Body() createDto: CreateRegimenDto) {
        const userId = req.user.userId;
        return this.regimenService.create(userId, createDto);
    }

    @Get()
    async findAll(@Req() req: any, @Query('activeOnly') activeOnly?: string) {
        const userId = req.user.userId;
        const active = activeOnly === 'true';
        return this.regimenService.findAll(userId, active);
    }

    @Get(':id')
    async findOne(@Req() req: any, @Param('id') id: string) {
        const userId = req.user.userId;
        return this.regimenService.findOne(userId, id);
    }

    @Patch(':id')
    async update(@Req() req: any, @Param('id') id: string, @Body() updateDto: UpdateRegimenDto) {
        const userId = req.user.userId;
        return this.regimenService.update(userId, id, updateDto);
    }

    @Delete(':id')
    async discontinue(@Req() req: any, @Param('id') id: string, @Body() discontinueDto: DiscontinueRegimenDto) {
        const userId = req.user.userId;
        return this.regimenService.discontinue(userId, id, discontinueDto);
    }

    @Get(':id/history')
    async getHistory(@Req() req: any, @Param('id') id: string) {
        const userId = req.user.userId;
        return this.regimenService.getHistory(userId, id);
    }
}

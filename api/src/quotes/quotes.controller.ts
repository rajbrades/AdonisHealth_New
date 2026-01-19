import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('quotes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuotesController {
    constructor(private readonly quotesService: QuotesService) { }

    @Post()
    @Roles('CONCIERGE', 'ADMIN')
    create(@Body() createQuoteDto: any, @Request() req: any) {
        // req.user is populated by JwtStrategy (has userId)
        return this.quotesService.create(createQuoteDto, req.user.userId);
    }

    @Get()
    @Roles('CONCIERGE', 'PROVIDER', 'ADMIN')
    findAll() {
        return this.quotesService.findAll();
    }

    @Get(':id')
    @Roles('CONCIERGE', 'PROVIDER', 'ADMIN', 'PATIENT')
    findOne(@Param('id') id: string) {
        return this.quotesService.findOne(id);
    }
}

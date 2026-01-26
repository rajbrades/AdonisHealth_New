import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LabsService } from './labs.service';

@Controller('labs')
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  @Post('extract')
  @UseInterceptors(FileInterceptor('file'))
  async extractFromPdf(
    @UploadedFile() file: Express.Multer.File,
    @Body('provider') provider: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!provider) {
      throw new BadRequestException('Provider is required (QUEST, LABCORP, ACCESS_MEDICAL)');
    }

    const validProviders = ['QUEST', 'LABCORP', 'ACCESS_MEDICAL'];
    const normalizedProvider = provider.toUpperCase();

    if (!validProviders.includes(normalizedProvider)) {
      throw new BadRequestException(`Invalid provider. Must be one of: ${validProviders.join(', ')}`);
    }

    try {
      const result = await this.labsService.processLabPdf(
        file.buffer,
        normalizedProvider,
      );
      return result;
    } catch (error) {
      throw new BadRequestException(`Extraction failed: ${error.message}`);
    }
  }

  @Get('catalog')
  async getCatalog() {
    return this.labsService.getBiomarkerCatalog();
  }

  @Get('stats')
  async getStats() {
    return this.labsService.getAliasStats();
  }

  @Post('alias')
  async addAlias(
    @Body('biomarkerCode') biomarkerCode: string,
    @Body('labProvider') labProvider: string,
    @Body('aliasName') aliasName: string,
  ) {
    if (!biomarkerCode || !labProvider || !aliasName) {
      throw new BadRequestException('biomarkerCode, labProvider, and aliasName are required');
    }

    try {
      return this.labsService.addAlias(biomarkerCode, labProvider, aliasName);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

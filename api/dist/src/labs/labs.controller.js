"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const labs_service_1 = require("./labs.service");
let LabsController = class LabsController {
    labsService;
    constructor(labsService) {
        this.labsService = labsService;
    }
    async extractFromPdf(file, provider) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        if (!provider) {
            throw new common_1.BadRequestException('Provider is required (QUEST, LABCORP, ACCESS_MEDICAL)');
        }
        const validProviders = ['QUEST', 'LABCORP', 'ACCESS_MEDICAL'];
        const normalizedProvider = provider.toUpperCase();
        if (!validProviders.includes(normalizedProvider)) {
            throw new common_1.BadRequestException(`Invalid provider. Must be one of: ${validProviders.join(', ')}`);
        }
        try {
            const result = await this.labsService.processLabPdf(file.buffer, normalizedProvider);
            return result;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Extraction failed: ${error.message}`);
        }
    }
    async getCatalog() {
        return this.labsService.getBiomarkerCatalog();
    }
    async getStats() {
        return this.labsService.getAliasStats();
    }
    async addAlias(biomarkerCode, labProvider, aliasName) {
        if (!biomarkerCode || !labProvider || !aliasName) {
            throw new common_1.BadRequestException('biomarkerCode, labProvider, and aliasName are required');
        }
        try {
            return this.labsService.addAlias(biomarkerCode, labProvider, aliasName);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.LabsController = LabsController;
__decorate([
    (0, common_1.Post)('extract'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "extractFromPdf", null);
__decorate([
    (0, common_1.Get)('catalog'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "getCatalog", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('alias'),
    __param(0, (0, common_1.Body)('biomarkerCode')),
    __param(1, (0, common_1.Body)('labProvider')),
    __param(2, (0, common_1.Body)('aliasName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "addAlias", null);
exports.LabsController = LabsController = __decorate([
    (0, common_1.Controller)('labs'),
    __metadata("design:paramtypes", [labs_service_1.LabsService])
], LabsController);
//# sourceMappingURL=labs.controller.js.map
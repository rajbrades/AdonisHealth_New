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
exports.RegimenController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const regimen_service_1 = require("./regimen.service");
const create_regimen_dto_1 = require("./dto/create-regimen.dto");
const update_regimen_dto_1 = require("./dto/update-regimen.dto");
let RegimenController = class RegimenController {
    regimenService;
    constructor(regimenService) {
        this.regimenService = regimenService;
    }
    async create(req, createDto) {
        const userId = req.user.userId;
        return this.regimenService.create(userId, createDto);
    }
    async findAll(req, activeOnly) {
        const userId = req.user.userId;
        const active = activeOnly === 'true';
        return this.regimenService.findAll(userId, active);
    }
    async findOne(req, id) {
        const userId = req.user.userId;
        return this.regimenService.findOne(userId, id);
    }
    async update(req, id, updateDto) {
        const userId = req.user.userId;
        return this.regimenService.update(userId, id, updateDto);
    }
    async discontinue(req, id, discontinueDto) {
        const userId = req.user.userId;
        return this.regimenService.discontinue(userId, id, discontinueDto);
    }
    async getHistory(req, id) {
        const userId = req.user.userId;
        return this.regimenService.getHistory(userId, id);
    }
};
exports.RegimenController = RegimenController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_regimen_dto_1.CreateRegimenDto]),
    __metadata("design:returntype", Promise)
], RegimenController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('activeOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RegimenController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RegimenController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_regimen_dto_1.UpdateRegimenDto]),
    __metadata("design:returntype", Promise)
], RegimenController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_regimen_dto_1.DiscontinueRegimenDto]),
    __metadata("design:returntype", Promise)
], RegimenController.prototype, "discontinue", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RegimenController.prototype, "getHistory", null);
exports.RegimenController = RegimenController = __decorate([
    (0, common_1.Controller)('regimen'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [regimen_service_1.RegimenService])
], RegimenController);
//# sourceMappingURL=regimen.controller.js.map
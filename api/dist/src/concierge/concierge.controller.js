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
exports.ConciergeController = void 0;
const common_1 = require("@nestjs/common");
const concierge_service_1 = require("./concierge.service");
const create_checkin_dto_1 = require("./dto/create-checkin.dto");
let ConciergeController = class ConciergeController {
    conciergeService;
    constructor(conciergeService) {
        this.conciergeService = conciergeService;
    }
    createCheckIn(dto) {
        return this.conciergeService.createCheckIn(dto);
    }
    getTrends(id) {
        return this.conciergeService.getPatientTrends(id);
    }
    getTimeline(id) {
        return this.conciergeService.getPatientTimeline(id);
    }
};
exports.ConciergeController = ConciergeController;
__decorate([
    (0, common_1.Post)('checkin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_checkin_dto_1.CreateCheckInDto]),
    __metadata("design:returntype", void 0)
], ConciergeController.prototype, "createCheckIn", null);
__decorate([
    (0, common_1.Get)('patient/:id/trends'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConciergeController.prototype, "getTrends", null);
__decorate([
    (0, common_1.Get)('patient/:id/timeline'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConciergeController.prototype, "getTimeline", null);
exports.ConciergeController = ConciergeController = __decorate([
    (0, common_1.Controller)('concierge'),
    __metadata("design:paramtypes", [concierge_service_1.ConciergeService])
], ConciergeController);
//# sourceMappingURL=concierge.controller.js.map
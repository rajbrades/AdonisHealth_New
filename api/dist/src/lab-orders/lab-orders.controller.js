"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabOrdersController = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const lab_orders_service_1 = require("./lab-orders.service");
const create_lab_order_dto_1 = require("./dto/create-lab-order.dto");
const update_lab_order_dto_1 = require("./dto/update-lab-order.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let LabOrdersController = class LabOrdersController {
    labOrdersService;
    constructor(labOrdersService) {
        this.labOrdersService = labOrdersService;
    }
    create(createLabOrderDto) {
        return this.labOrdersService.create(createLabOrderDto);
    }
    findAll(patientId, status, labProvider) {
        return this.labOrdersService.findAll({ patientId, status, labProvider });
    }
    findPending() {
        return this.labOrdersService.findPendingOrders();
    }
    findAwaitingResults() {
        return this.labOrdersService.findAwaitingResults();
    }
    findByPatient(patientId) {
        return this.labOrdersService.findByPatient(patientId);
    }
    findByOrderNumber(orderNumber) {
        return this.labOrdersService.findByOrderNumber(orderNumber);
    }
    findOne(id) {
        return this.labOrdersService.findOne(id);
    }
    update(id, updateLabOrderDto) {
        return this.labOrdersService.update(id, updateLabOrderDto);
    }
    updateStatus(id, updateStatusDto) {
        return this.labOrdersService.updateStatus(id, updateStatusDto);
    }
    linkResults(id, labPanelId) {
        return this.labOrdersService.linkResults(id, labPanelId);
    }
    cancel(id, reason) {
        return this.labOrdersService.cancel(id, reason);
    }
    async generateRequisition(id) {
        const result = await this.labOrdersService.generateRequisition(id);
        return {
            message: 'Requisition generated successfully',
            storageKey: result.storageKey,
        };
    }
    async downloadRequisition(id, res) {
        const labOrder = await this.labOrdersService.findOne(id);
        if (!labOrder.requisitionPdfKey) {
            throw new common_1.NotFoundException('Requisition not yet generated for this order');
        }
        const filepath = this.labOrdersService.getRequisitionPath(labOrder.orderNumber);
        if (!this.labOrdersService.requisitionExists(labOrder.orderNumber)) {
            throw new common_1.NotFoundException('Requisition PDF file not found');
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="requisition-${labOrder.orderNumber}.pdf"`);
        const fileStream = fs.createReadStream(filepath);
        fileStream.pipe(res);
    }
    async sendToPatient(id) {
        const result = await this.labOrdersService.sendToPatient(id);
        return {
            message: 'Requisition sent to patient successfully',
            ...result,
        };
    }
};
exports.LabOrdersController = LabOrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN', 'PROVIDER', 'CONCIERGE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lab_order_dto_1.CreateLabOrderDto]),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('ADMIN', 'PROVIDER', 'CONCIERGE'),
    __param(0, (0, common_1.Query)('patientId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('labProvider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)('ADMIN', 'PROVIDER', 'CONCIERGE'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "findPending", null);
__decorate([
    (0, common_1.Get)('awaiting-results'),
    (0, roles_decorator_1.Roles)('ADMIN', 'PROVIDER', 'CONCIERGE'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "findAwaitingResults", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, roles_decorator_1.Roles)('ADMIN', 'PROVIDER', 'CONCIERGE', 'PATIENT'),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "findByPatient", null);
__decorate([
    (0, common_1.Get)('order-number/:orderNumber'),
    (0, roles_decorator_1.Roles)('ADMIN', 'PROVIDER', 'CONCIERGE', 'PATIENT'),
    __param(0, (0, common_1.Param)('orderNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "findByOrderNumber", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN', 'PROVIDER', 'CONCIERGE', 'PATIENT'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN', 'PROVIDER', 'CONCIERGE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_lab_order_dto_1.UpdateLabOrderDto]),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)('ADMIN', 'PROVIDER', 'CONCIERGE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_lab_order_dto_1.UpdateLabOrderStatusDto]),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/link-results'),
    (0, roles_decorator_1.Roles)('ADMIN', 'PROVIDER', 'CONCIERGE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('labPanelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "linkResults", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN', 'PROVIDER', 'CONCIERGE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/generate-requisition'),
    (0, roles_decorator_1.Roles)('ADMIN', 'PROVIDER', 'CONCIERGE'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabOrdersController.prototype, "generateRequisition", null);
__decorate([
    (0, common_1.Get)(':id/requisition'),
    (0, roles_decorator_1.Roles)('ADMIN', 'PROVIDER', 'CONCIERGE', 'PATIENT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LabOrdersController.prototype, "downloadRequisition", null);
__decorate([
    (0, common_1.Post)(':id/send-to-patient'),
    (0, roles_decorator_1.Roles)('ADMIN', 'PROVIDER', 'CONCIERGE'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabOrdersController.prototype, "sendToPatient", null);
exports.LabOrdersController = LabOrdersController = __decorate([
    (0, common_1.Controller)('lab-orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [lab_orders_service_1.LabOrdersService])
], LabOrdersController);
//# sourceMappingURL=lab-orders.controller.js.map
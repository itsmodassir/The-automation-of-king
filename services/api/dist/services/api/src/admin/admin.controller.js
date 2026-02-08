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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const admin_guard_1 = require("./guards/admin.guard");
const admin_service_1 = require("./admin.service");
const update_tenant_status_dto_1 = require("./dto/update-tenant-status.dto");
const update_plan_dto_1 = require("./dto/update-plan.dto");
const rotate_token_dto_1 = require("./dto/rotate-token.dto");
const create_tenant_dto_1 = require("./dto/create-tenant.dto");
let AdminController = class AdminController {
    constructor(service) {
        this.service = service;
    }
    getOverview(req) {
        return this.service.getAnalytics(req.user);
    }
    getLogs() {
        return this.service.getAuditLogs();
    }
    getTenants(req) {
        return this.service.getTenants(req.user);
    }
    createTenant(req, dto) {
        return this.service.createTenant(dto, req.user);
    }
    updateTenantStatus(tenantId, dto) {
        return this.service.updateTenantStatus(tenantId, dto.status);
    }
    updatePlan(tenantId, dto) {
        return this.service.updatePlan(tenantId, dto);
    }
    getUsage(tenantId) {
        return this.service.getUsage(tenantId);
    }
    getMetaTokens() {
        return this.service.getMetaTokens();
    }
    rotateMetaToken(dto) {
        return this.service.rotateMetaToken(dto);
    }
    getWhatsappAccounts() {
        return this.service.getWhatsappAccounts();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('analytics/overview'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)('tenants'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getTenants", null);
__decorate([
    (0, common_1.Post)('tenants'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_tenant_dto_1.CreateTenantDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createTenant", null);
__decorate([
    (0, common_1.Patch)('tenants/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tenant_status_dto_1.UpdateTenantStatusDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateTenantStatus", null);
__decorate([
    (0, common_1.Patch)('tenants/:id/plan'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_plan_dto_1.UpdatePlanDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Get)('tenants/:id/usage'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUsage", null);
__decorate([
    (0, common_1.Get)('meta/tokens'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getMetaTokens", null);
__decorate([
    (0, common_1.Post)('meta/tokens/rotate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rotate_token_dto_1.RotateTokenDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rotateMetaToken", null);
__decorate([
    (0, common_1.Get)('whatsapp/accounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getWhatsappAccounts", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map
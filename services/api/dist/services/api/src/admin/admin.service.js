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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tenant_entity_1 = require("../tenants/tenant.entity");
const billing_limit_entity_1 = require("../billing/billing-limit.entity");
const usage_metric_entity_1 = require("../billing/usage-metric.entity");
const meta_token_entity_1 = require("../meta/entities/meta-token.entity");
const whatsapp_account_entity_1 = require("../whatsapp/whatsapp-account.entity");
const audit_log_entity_1 = require("./entities/audit-log.entity");
const admin_tenant_assignment_entity_1 = require("./entities/admin-tenant-assignment.entity");
const admin_user_entity_1 = require("./entities/admin-user.entity");
let AdminService = class AdminService {
    constructor(tenants, billing, usage, metaTokens, wa, auditRepo, assignments, adminUsers) {
        this.tenants = tenants;
        this.billing = billing;
        this.usage = usage;
        this.metaTokens = metaTokens;
        this.wa = wa;
        this.auditRepo = auditRepo;
        this.assignments = assignments;
        this.adminUsers = adminUsers;
    }
    async getAccessibleTenantIds(admin) {
        if (admin.role === admin_user_entity_1.AdminRole.SUPER_ADMIN || admin.role === admin_user_entity_1.AdminRole.PLATFORM_ADMIN) {
            return 'ALL';
        }
        const assignments = await this.assignments.find({
            where: { adminId: admin.id },
            select: ['tenantId'],
        });
        return assignments.map(a => a.tenantId);
    }
    async getAnalytics(admin) {
        let tenantFilter = {};
        if (admin) {
            const accessible = await this.getAccessibleTenantIds(admin);
            if (accessible !== 'ALL') {
                if (accessible.length === 0) {
                    return { tenants: 0, messages: 0, ai: 0, wa: 0, revenue: 0 };
                }
                tenantFilter = { id: (0, typeorm_2.In)(accessible) };
            }
        }
        const tenants = await this.tenants.count({ where: tenantFilter });
        const messages = tenants * 150;
        const ai = tenants * 50;
        const wa = tenants;
        const revenue = tenants * 4999;
        return { tenants, messages, ai, wa, revenue };
    }
    async log(action, actorId, tenantId, meta = {}) {
        await this.auditRepo.save({
            action,
            actorId,
            tenantId,
            metadata: meta,
        });
    }
    getAuditLogs() {
        return this.auditRepo.find({
            order: { createdAt: 'DESC' },
            take: 100,
        });
    }
    async createTenant(dto, adminUser) {
        const tenant = this.tenants.create({
            name: dto.name,
            domain: dto.domain,
            customDomain: dto.customDomain,
            aiEnabled: dto.aiEnabled ?? true,
            onboardedBy: adminUser.id,
            onboardingStatus: 'created',
        });
        const savedTenant = await this.tenants.save(tenant);
        await this.assignTenant(adminUser.id, savedTenant.id);
        await this.log('create_tenant', adminUser.id, savedTenant.id, { name: dto.name });
        return savedTenant;
    }
    async getTenants(admin) {
        if (!admin)
            return this.tenants.find();
        const accessible = await this.getAccessibleTenantIds(admin);
        if (accessible === 'ALL') {
            return this.tenants.find();
        }
        if (accessible.length === 0) {
            return [];
        }
        return this.tenants.find({
            where: { id: (0, typeorm_2.In)(accessible) },
        });
    }
    async updateTenantStatus(id, status) {
        await this.tenants.update(id, { status });
        return { success: true };
    }
    async updatePlan(tenantId, dto) {
        await this.billing.save({
            tenantId,
            maxMessages: dto.maxMessages,
            maxAiCredits: dto.maxAiCredits,
        });
        return { success: true };
    }
    getUsage(tenantId) {
        return this.usage.find({ where: { tenantId } });
    }
    getMetaTokens() {
        return this.metaTokens.find();
    }
    async rotateMetaToken(dto) {
        await this.metaTokens.save({
            systemUserId: dto.systemUserId,
            tokenEncrypted: dto.encryptedToken,
            scopes: dto.scopes,
            expiresAt: dto.expiresAt,
        });
        return { rotated: true };
    }
    getWhatsappAccounts() {
        return this.wa.find();
    }
    async assignTenant(adminId, tenantId) {
        await this.assignments.save({
            adminId,
            tenantId,
        });
    }
    async getAdmins() {
        return this.adminUsers.find({
            select: ['id', 'email', 'role', 'isActive', 'createdAt'],
            order: { createdAt: 'DESC' },
        });
    }
    async updateAdminStatus(id, isActive) {
        await this.adminUsers.update(id, { isActive });
        return { success: true };
    }
    async updateAdminRole(id, role) {
        await this.adminUsers.update(id, { role });
        return { success: true };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __param(1, (0, typeorm_1.InjectRepository)(billing_limit_entity_1.BillingLimit)),
    __param(2, (0, typeorm_1.InjectRepository)(usage_metric_entity_1.UsageMetric)),
    __param(3, (0, typeorm_1.InjectRepository)(meta_token_entity_1.MetaToken)),
    __param(4, (0, typeorm_1.InjectRepository)(whatsapp_account_entity_1.WhatsAppAccount)),
    __param(5, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __param(6, (0, typeorm_1.InjectRepository)(admin_tenant_assignment_entity_1.AdminTenantAssignment)),
    __param(7, (0, typeorm_1.InjectRepository)(admin_user_entity_1.AdminUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map
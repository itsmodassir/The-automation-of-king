import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { BillingLimit } from '../billing/billing-limit.entity';
import { UsageMetric } from '../billing/usage-metric.entity';
import { MetaToken } from '../meta/entities/meta-token.entity';
import { WhatsappAccount } from '../whatsapp/whatsapp-account.entity';
import { AuditLog } from './entities/audit-log.entity';
import { AdminTenantAssignment } from './entities/admin-tenant-assignment.entity';
import { AdminUser, AdminRole } from './entities/admin-user.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { RotateTokenDto } from './dto/rotate-token.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Tenant) private tenants: Repository<Tenant>,
        @InjectRepository(BillingLimit) private billing: Repository<BillingLimit>,
        @InjectRepository(UsageMetric) private usage: Repository<UsageMetric>,
        @InjectRepository(MetaToken) private metaTokens: Repository<MetaToken>,
        @InjectRepository(WhatsappAccount) private wa: Repository<WhatsappAccount>,
        @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
        @InjectRepository(AdminTenantAssignment) private assignments: Repository<AdminTenantAssignment>,
        @InjectRepository(AdminUser) private adminUsers: Repository<AdminUser>,
    ) { }

    private async getAccessibleTenantIds(admin: AdminUser): Promise<string[] | 'ALL'> {
        if (admin.role === AdminRole.SUPER_ADMIN || admin.role === AdminRole.PLATFORM_ADMIN) {
            return 'ALL';
        }

        const assignments = await this.assignments.find({
            where: { adminId: admin.id },
            select: ['tenantId'],
        });

        return assignments.map(a => a.tenantId);
    }

    async getAnalytics(admin?: AdminUser) {
        // If admin is provided, filter analytics. For now, showing global for super/platform.
        // For lower roles, filtering is needed.
        let tenantFilter = {};

        if (admin) {
            const accessible = await this.getAccessibleTenantIds(admin);
            if (accessible !== 'ALL') {
                if (accessible.length === 0) {
                    return { tenants: 0, messages: 0, ai: 0, wa: 0 };
                }
                tenantFilter = { id: In(accessible) };
            }
        }

        const tenants = await this.tenants.count({ where: tenantFilter });
        // NOTE: Usage metrics need tenantId filtering too, but they are separate tables.
        // This requires optimized queries or joins. For MVP, we return strict tenant count
        // and global metrics ONLY if SuperAdmin, filtered otherwise (which effectively hides them or returns 0).
        // To properly filter usage, we need tenantId in UsageMetric (it exists).

        let validTenantIds: string[] | undefined;
        if (admin) {
            const accessible = await this.getAccessibleTenantIds(admin);
            if (accessible !== 'ALL') {
                validTenantIds = accessible;
            }
        }

        const messages = await this.usage.count({
            where: {
                metricType: 'message_sent',
                ...(validTenantIds ? { tenantId: In(validTenantIds) } : {})
            },
        });
        const ai = await this.usage.count({
            where: {
                metricType: 'ai_credit',
                ...(validTenantIds ? { tenantId: In(validTenantIds) } : {})
            },
        });
        const wa = await this.wa.count();

        // Mock revenue for now, or calculate from billing interactions if available.
        // For MVP/Demo: random revenue based on tenant count or stored metric.
        // Let's return a static/calculated value.
        const revenue = tenants * 4999; // Example ₹4999 per tenant standard plan.

        return { tenants, messages, ai, wa, revenue };
    }

    async log(action: string, actorId?: string, tenantId?: string, meta = {}) {
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

    // TENANTS
    async createTenant(dto: CreateTenantDto, adminUser: AdminUser) {
        // 1. Create Tenant
        const tenant = this.tenants.create({
            name: dto.name,
            domain: dto.domain,
            customDomain: dto.customDomain,
            aiEnabled: dto.aiEnabled ?? true,
            onboardedBy: adminUser.id,
            onboardingStatus: 'created',
        });
        const savedTenant = await this.tenants.save(tenant);

        // 2. Assign to Admin
        await this.assignTenant(adminUser.id, savedTenant.id);

        // 3. Log
        await this.log('create_tenant', adminUser.id, savedTenant.id, { name: dto.name });

        return savedTenant;
    }

    async getTenants(admin?: AdminUser) {
        if (!admin) return this.tenants.find();

        const accessible = await this.getAccessibleTenantIds(admin);
        if (accessible === 'ALL') {
            return this.tenants.find();
        }

        if (accessible.length === 0) {
            return [];
        }

        return this.tenants.find({
            where: { id: In(accessible) },
        });
    }

    async updateTenantStatus(id: string, status: string) {
        await this.tenants.update(id, { status });
        return { success: true };
    }

    // BILLING
    async updatePlan(tenantId: string, dto: UpdatePlanDto) {
        await this.billing.save({
            tenantId,
            maxMessages: dto.maxMessages,
            maxAiCredits: dto.maxAiCredits,
        });
        return { success: true };
    }

    // USAGE
    getUsage(tenantId: string) {
        return this.usage.find({ where: { tenantId } });
    }

    // META TOKENS
    getMetaTokens() {
        return this.metaTokens.find();
    }

    async rotateMetaToken(dto: RotateTokenDto) {
        await this.metaTokens.save({
            systemUserId: dto.systemUserId,
            tokenEncrypted: dto.encryptedToken,
            scopes: dto.scopes,
            expiresAt: dto.expiresAt,
        });
        return { rotated: true };
    }

    // WHATSAPP
    getWhatsappAccounts() {
        return this.wa.find();
    }

    // ASSIGNMENT
    async assignTenant(adminId: string, tenantId: string) {
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

    async updateAdminStatus(id: string, isActive: boolean) {
        await this.adminUsers.update(id, { isActive });
        return { success: true };
    }

    async updateAdminRole(id: string, role: AdminRole) {
        await this.adminUsers.update(id, { role });
        return { success: true };
    }
}

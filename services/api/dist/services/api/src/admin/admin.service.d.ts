import { Repository } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { BillingLimit } from '../billing/billing-limit.entity';
import { UsageMetric } from '../billing/usage-metric.entity';
import { MetaToken } from '../meta/entities/meta-token.entity';
import { WhatsAppAccount } from '../whatsapp/whatsapp-account.entity';
import { AuditLog } from './entities/audit-log.entity';
import { AdminTenantAssignment } from './entities/admin-tenant-assignment.entity';
import { AdminUser, AdminRole } from './entities/admin-user.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { RotateTokenDto } from './dto/rotate-token.dto';
export declare class AdminService {
    private tenants;
    private billing;
    private usage;
    private metaTokens;
    private wa;
    private auditRepo;
    private assignments;
    private adminUsers;
    constructor(tenants: Repository<Tenant>, billing: Repository<BillingLimit>, usage: Repository<UsageMetric>, metaTokens: Repository<MetaToken>, wa: Repository<WhatsAppAccount>, auditRepo: Repository<AuditLog>, assignments: Repository<AdminTenantAssignment>, adminUsers: Repository<AdminUser>);
    private getAccessibleTenantIds;
    getAnalytics(admin?: AdminUser): Promise<{
        tenants: number;
        messages: number;
        ai: number;
        wa: number;
        revenue: number;
    }>;
    log(action: string, actorId?: string, tenantId?: string, meta?: {}): Promise<void>;
    getAuditLogs(): Promise<AuditLog[]>;
    createTenant(dto: CreateTenantDto, adminUser: AdminUser): Promise<Tenant>;
    getTenants(admin?: AdminUser): Promise<Tenant[]>;
    updateTenantStatus(id: string, status: string): Promise<{
        success: boolean;
    }>;
    updatePlan(tenantId: string, dto: UpdatePlanDto): Promise<{
        success: boolean;
    }>;
    getUsage(tenantId: string): Promise<UsageMetric[]>;
    getMetaTokens(): Promise<MetaToken[]>;
    rotateMetaToken(dto: RotateTokenDto): Promise<{
        rotated: boolean;
    }>;
    getWhatsappAccounts(): Promise<WhatsAppAccount[]>;
    assignTenant(adminId: string, tenantId: string): Promise<void>;
    getAdmins(): Promise<AdminUser[]>;
    updateAdminStatus(id: string, isActive: boolean): Promise<{
        success: boolean;
    }>;
    updateAdminRole(id: string, role: AdminRole): Promise<{
        success: boolean;
    }>;
}

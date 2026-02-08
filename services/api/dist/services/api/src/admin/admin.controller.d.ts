import { AdminService } from './admin.service';
import { UpdateTenantStatusDto } from './dto/update-tenant-status.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { RotateTokenDto } from './dto/rotate-token.dto';
import { CreateTenantDto } from './dto/create-tenant.dto';
export declare class AdminController {
    private readonly service;
    constructor(service: AdminService);
    getOverview(req: any): Promise<{
        tenants: number;
        messages: number;
        ai: number;
        wa: number;
        revenue: number;
    }>;
    getLogs(): Promise<import("./entities/audit-log.entity").AuditLog[]>;
    getTenants(req: any): Promise<import("../tenants/tenant.entity").Tenant[]>;
    createTenant(req: any, dto: CreateTenantDto): Promise<import("../tenants/tenant.entity").Tenant>;
    updateTenantStatus(tenantId: string, dto: UpdateTenantStatusDto): Promise<{
        success: boolean;
    }>;
    updatePlan(tenantId: string, dto: UpdatePlanDto): Promise<{
        success: boolean;
    }>;
    getUsage(tenantId: string): Promise<import("../billing/usage-metric.entity").UsageMetric[]>;
    getMetaTokens(): Promise<import("../meta/entities/meta-token.entity").MetaToken[]>;
    rotateMetaToken(dto: RotateTokenDto): Promise<{
        rotated: boolean;
    }>;
    getWhatsappAccounts(): Promise<import("../whatsapp/whatsapp-account.entity").WhatsAppAccount[]>;
}

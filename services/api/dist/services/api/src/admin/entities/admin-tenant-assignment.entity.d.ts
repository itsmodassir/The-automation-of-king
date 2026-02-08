import { AdminUser } from './admin-user.entity';
import { Tenant } from '../../tenants/tenant.entity';
export declare class AdminTenantAssignment {
    id: string;
    adminId: string;
    admin: AdminUser;
    tenantId: string;
    tenant: Tenant;
    assignedAt: Date;
}

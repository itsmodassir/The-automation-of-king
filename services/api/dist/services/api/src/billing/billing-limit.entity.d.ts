import { Tenant } from '../tenants/tenant.entity';
export declare class BillingLimit {
    tenantId: string;
    tenant: Tenant;
    maxMessages: number;
    maxAiCredits: number;
    updatedAt: Date;
}

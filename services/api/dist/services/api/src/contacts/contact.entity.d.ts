import { Tenant } from '../tenants/tenant.entity';
export declare class Contact {
    id: string;
    tenant: Tenant;
    tenantId: string;
    phone: string;
    name: string;
    createdAt: Date;
}

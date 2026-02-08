import { Tenant } from '../tenants/tenant.entity';
export declare class User {
    id: string;
    tenantId: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    phone: string;
    avatar: string;
    apiAccessEnabled: boolean;
    isActive: boolean;
    emailVerified: boolean;
    lastLoginAt: Date;
    tenant: Tenant;
    createdAt: Date;
    updatedAt: Date;
}

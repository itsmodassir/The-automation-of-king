import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
export declare class TenantService {
    private tenantRepo;
    constructor(tenantRepo: Repository<Tenant>);
    getBranding(tenantId: string): Promise<{
        brandName: string;
        primaryColor: string;
        logoUrl: string;
    }>;
    getBrandingByDomain(domain: string): Promise<{
        brandName: string;
        primaryColor: string;
        logoUrl: string;
    }>;
    setStatus(tenantId: string, status: 'active' | 'suspended'): Promise<import("typeorm").UpdateResult>;
    updateBranding(tenantId: string, branding: any): Promise<import("typeorm").UpdateResult>;
    create(name: string, email: string, domain?: string): Promise<Tenant>;
}

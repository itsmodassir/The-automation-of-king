import { Repository } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
export declare class AutomationService {
    private tenantRepo;
    constructor(tenantRepo: Repository<Tenant>);
    getSettings(tenantId: string): Promise<{
        enabled: boolean;
        confidence: number;
    }>;
    updateSettings(tenantId: string, settings: any): Promise<import("typeorm").UpdateResult>;
}

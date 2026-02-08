import { TenantService } from './tenant.service';
export declare class TenantController {
    private tenantService;
    constructor(tenantService: TenantService);
    getBranding(req: any): Promise<{
        brandName: string;
        primaryColor: string;
        logoUrl: string;
    }>;
    getPublicBranding(req: any): Promise<{
        brandName: string;
        primaryColor: string;
        logoUrl: string;
    }>;
    setStatus(dto: {
        status: 'active' | 'suspended';
    }, req: any): Promise<import("typeorm").UpdateResult>;
    updateBranding(dto: any, req: any): Promise<import("typeorm").UpdateResult>;
}

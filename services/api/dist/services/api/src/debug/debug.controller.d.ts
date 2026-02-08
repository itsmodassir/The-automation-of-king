import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { TenantService } from '../tenants/tenant.service';
export declare class DebugController {
    private userRepo;
    private tenantService;
    constructor(userRepo: Repository<User>, tenantService: TenantService);
    testRegistration(dto: any): Promise<{
        success: boolean;
        steps: any[];
        result: {
            userId: string;
            tenantId: string;
        };
        error?: undefined;
    } | {
        success: boolean;
        steps: any[];
        error: {
            message: any;
            stack: any;
            name: any;
            code: any;
            detail: any;
            constraint: any;
            table: any;
            column: any;
            fullError: string;
        };
        result?: undefined;
    }>;
}

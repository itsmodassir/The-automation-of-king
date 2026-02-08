import { AdminService } from './admin.service';
import { AdminRole } from './entities/admin-user.entity';
export declare class AdminsController {
    private readonly service;
    constructor(service: AdminService);
    getAdmins(): Promise<import("./entities/admin-user.entity").AdminUser[]>;
    updateStatus(id: string, isActive: boolean): Promise<{
        success: boolean;
    }>;
    updateRole(id: string, role: AdminRole): Promise<{
        success: boolean;
    }>;
}

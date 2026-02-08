import { AdminAuthService } from './admin-auth.service';
export declare class AdminAuthController {
    private authService;
    constructor(authService: AdminAuthService);
    login(body: any): Promise<{
        access_token: string;
    }>;
    register(body: any): Promise<import("./entities/admin-user.entity").AdminUser>;
    getProfile(req: any): any;
}

import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AdminUser } from './entities/admin-user.entity';
export declare class AdminAuthService {
    private adminRepo;
    private jwtService;
    constructor(adminRepo: Repository<AdminUser>, jwtService: JwtService);
    validateAdmin(email: string, pass: string): Promise<any>;
    login(admin: AdminUser): Promise<{
        access_token: string;
    }>;
    register(email: string, pass: string, role: string): Promise<AdminUser>;
}

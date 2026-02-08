import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { TenantService } from '../tenants/tenant.service';
export declare class AuthService {
    private jwt;
    private userRepo;
    private tenantService;
    constructor(jwt: JwtService, userRepo: Repository<User>, tenantService: TenantService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    register(dto: any): Promise<{
        access_token: string;
    }>;
}

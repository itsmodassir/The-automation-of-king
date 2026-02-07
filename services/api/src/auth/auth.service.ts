import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { TenantService } from '../tenants/tenant.service';

@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        @InjectRepository(User) private userRepo: Repository<User>,
        private tenantService: TenantService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userRepo.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'role', 'tenantId'],
        });

        if (user && user.password && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        return {
            access_token: this.jwt.sign({
                sub: user.id,
                tenantId: user.tenantId,
                role: user.role,
            }),
        };
    }

    async register(dto: any) {
        // 1. Create Tenant
        const tenant = await this.tenantService.create(dto.workspaceName, dto.email);

        // 2. Hash Password
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(dto.password, salt);

        // 3. Create User
        const user = this.userRepo.create({
            email: dto.email,
            password: hash,
            tenantId: tenant.id,
            role: 'admin', // First user is admin
        });
        const savedUser = await this.userRepo.save(user);

        // 4. Return Token
        return this.login(savedUser);
    }
}

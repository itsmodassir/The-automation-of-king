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
        try {
            console.log('Registration started with:', { name: dto.name, email: dto.email, domain: dto.domain });

            // 1. Create Tenant
            console.log('Creating tenant...');
            const tenant = await this.tenantService.create(dto.name, dto.email, dto.domain);
            console.log('Tenant created:', tenant.id);

            // 2. Hash Password
            console.log('Hashing password...');
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(dto.password, salt);
            console.log('Password hashed');

            // 3. Create User
            console.log('Creating user...');
            const user = this.userRepo.create({
                name: dto.name,
                email: dto.email,
                password: hash,
                tenantId: tenant.id,
                role: 'admin', // First user is admin
            });
            console.log('User entity created, saving...');
            const savedUser = await this.userRepo.save(user);
            console.log('User saved:', savedUser.id);

            // 4. Return Token
            console.log('Generating token...');
            return this.login(savedUser);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
}

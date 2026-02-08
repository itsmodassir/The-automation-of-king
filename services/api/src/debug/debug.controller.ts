import { Controller, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { TenantService } from '../tenants/tenant.service';
import * as bcrypt from 'bcrypt';

@Controller('debug')
export class DebugController {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private tenantService: TenantService,
    ) { }

    @Post('test-registration')
    async testRegistration(@Body() dto: any) {
        const steps = [];
        try {
            steps.push({ step: 'Starting', data: dto });

            // Step 1: Create Tenant
            steps.push({ step: 'Creating tenant...' });
            const tenant = await this.tenantService.create(dto.name, dto.email, dto.domain);
            steps.push({ step: 'Tenant created', tenant: { id: tenant.id, name: tenant.name, domain: tenant.domain } });

            // Step 2: Hash Password
            steps.push({ step: 'Hashing password...' });
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(dto.password, salt);
            steps.push({ step: 'Password hashed' });

            // Step 3: Create User
            steps.push({ step: 'Creating user entity...' });
            const user = this.userRepo.create({
                email: dto.email,
                password: hash,
                tenantId: tenant.id,
                role: 'admin',
            });
            steps.push({ step: 'User entity created', user: { email: user.email, tenantId: user.tenantId, role: user.role } });

            steps.push({ step: 'Saving user...' });
            const savedUser = await this.userRepo.save(user);
            steps.push({ step: 'User saved', userId: savedUser.id });

            return {
                success: true,
                steps,
                result: { userId: savedUser.id, tenantId: tenant.id }
            };
        } catch (error) {
            return {
                success: false,
                steps,
                error: {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                    code: error.code,
                    detail: error.detail,
                    constraint: error.constraint,
                    table: error.table,
                    column: error.column,
                    fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
                }
            };
        }
    }
}

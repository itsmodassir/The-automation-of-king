import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUser } from '../entities/admin-user.entity';

@Injectable()
export class AdminAuthService {
    constructor(
        private jwt: JwtService,
        @InjectRepository(AdminUser) private adminRepo: Repository<AdminUser>,
    ) { }

    async validateAdmin(email: string, pass: string): Promise<any> {
        const admin = await this.adminRepo.createQueryBuilder('admin')
            .addSelect('admin.passwordHash') // Use property name
            .where('admin.email = :email', { email })
            .getOne();

        if (admin && admin.passwordHash && await bcrypt.compare(pass, admin.passwordHash)) {
            const { passwordHash, ...result } = admin;
            return result;
        }
        return null;
    }

    async login(admin: any) {
        return {
            access_token: this.jwt.sign({
                sub: admin.id,
                email: admin.email,
                role: admin.role,
                isAdmin: true
            }),
        };
    }
}

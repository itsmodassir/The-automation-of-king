import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AdminUser } from './entities/admin-user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminAuthService {
    constructor(
        @InjectRepository(AdminUser) private adminRepo: Repository<AdminUser>,
        private jwtService: JwtService,
    ) { }

    async validateAdmin(email: string, pass: string): Promise<any> {
        const admin = await this.adminRepo.createQueryBuilder('admin')
            .addSelect('admin.passwordHash')
            .where('admin.email = :email', { email })
            .getOne();

        if (admin && await bcrypt.compare(pass, admin.passwordHash)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { passwordHash, ...result } = admin;
            return result;
        }
        return null;
    }

    async login(admin: AdminUser) {
        const payload = { email: admin.email, sub: admin.id, role: admin.role, type: 'admin', id: admin.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(email: string, pass: string, role: string) {
        const hash = await bcrypt.hash(pass, 10);
        const admin = this.adminRepo.create({
            email,
            passwordHash: hash,
            role: role as any,
        });
        return this.adminRepo.save(admin);
    }
}

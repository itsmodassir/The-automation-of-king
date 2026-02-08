import { Controller, Post, Body, UnauthorizedException, UseGuards, Get, Request, ForbiddenException, Inject } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminService } from './admin.service';
import { AdminGuard } from './guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdminUser } from './entities/admin-user.entity';

@Controller('admin/auth')
export class AdminAuthController {
    constructor(
        private authService: AdminAuthService,
        @Inject(getRepositoryToken(AdminUser))
        private adminRepo: Repository<AdminUser>,
    ) { }

    @Post('login')
    async login(@Body() body: any) {
        const admin = await this.authService.validateAdmin(body.email, body.password);
        if (!admin) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(admin);
    }

    @Post('init')
    async initializeAdmin(@Body() body: any) {
        // Check if any admin already exists
        const adminCount = await this.adminRepo.count();
        if (adminCount > 0) {
            throw new ForbiddenException('Admin already initialized. Use login instead.');
        }

        // Create first super admin
        if (!body.email || !body.password) {
            throw new UnauthorizedException('Email and password required');
        }

        return await this.authService.register(body.email, body.password, 'SUPER_ADMIN');
    }

    @Post('register')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async register(@Body() body: any, @Request() req: any) {
        // Only existing super admins can create new admins
        if (req.user.role !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Only super admins can create new admin accounts');
        }

        return await this.authService.register(body.email, body.password, body.role);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard, AdminGuard)
    getProfile(@Request() req: any) {
        return req.user;
    }
}

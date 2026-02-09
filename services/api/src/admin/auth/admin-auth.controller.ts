import { Controller, Post, Body, UnauthorizedException, Get, Request, ForbiddenException, UseGuards } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('Admin Authentication')
@Controller('admin/auth')
export class AdminAuthController {
    constructor(private authService: AdminAuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Admin Login', description: 'Authenticates an admin and returns a JWT token.' })
    @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email', 'password'] } })
    @ApiResponse({ status: 200, description: 'Login successful, returns token.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    async login(@Body() body: any) {
        const admin = await this.authService.validateAdmin(body.email, body.password);
        if (!admin) {
            throw new UnauthorizedException('Invalid admin credentials');
        }
        return this.authService.login(admin);
    }

    @Post('init')
    @ApiOperation({ summary: 'Initialize Super Admin', description: 'Creates the first super admin account if none exists.' })
    async initializeAdmin(@Body() body: any) {
        if (!body.email || !body.password) {
            throw new UnauthorizedException('Email and password required');
        }
        return await this.authService.register(body.email, body.password, 'SUPER_ADMIN');
    }

    @Post('register')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Register New Admin', description: 'Allows super admins to create new admin accounts.' })
    async register(@Body() body: any, @Request() req: any) {
        if (req.user.role !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Only super admins can create new admin accounts');
        }
        return await this.authService.register(body.email, body.password, body.role);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get Admin Profile', description: 'Returns the current authenticated admin profile.' })
    getProfile(@Request() req: any) {
        return req.user;
    }
}

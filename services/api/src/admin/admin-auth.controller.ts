import { Controller, Post, Body, UnauthorizedException, UseGuards, Get, Request } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminService } from './admin.service'; // For creating initial admin if needed
import { AdminGuard } from './guards/admin.guard';

@Controller('admin/auth')
export class AdminAuthController {
    constructor(private authService: AdminAuthService) { }

    @Post('login')
    async login(@Body() body: any) {
        const admin = await this.authService.validateAdmin(body.email, body.password);
        if (!admin) {
            throw new UnauthorizedException();
        }
        return this.authService.login(admin);
    }

    @Post('register')
    // @UseGuards(AdminGuard) // Protected? Or open for first admin?
    async register(@Body() body: any) {
        // In a real app, this should be protected or restricted.
        // For now, allow open registration or check if count is 0.
        return this.authService.register(body.email, body.password, body.role);
    }

    @Get('me')
    @UseGuards(AdminGuard)
    getProfile(@Request() req: any) {
        return req.user;
    }
}

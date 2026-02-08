import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

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
}

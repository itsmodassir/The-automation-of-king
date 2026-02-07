import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { TenantService } from './tenant.service';

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantController {
    constructor(private tenantService: TenantService) { }

    @Get('branding')
    getBranding(@Req() req: any) {
        return this.tenantService.getBranding(req.user.tenantId);
    }

    @Get('public/branding')
    async getPublicBranding(@Req() req: any) {
        const host = req.headers.host;
        return this.tenantService.getBrandingByDomain(host);
    }

    @Post('status')
    setStatus(@Body() dto: { status: 'active' | 'suspended' }, @Req() req: any) {
        return this.tenantService.setStatus(req.user.tenantId, dto.status);
    }

    @Post('branding')
    updateBranding(@Body() dto: any, @Req() req: any) {
        return this.tenantService.updateBranding(req.user.tenantId, dto);
    }
}

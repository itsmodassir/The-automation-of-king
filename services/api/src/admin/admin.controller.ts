import { Controller, Get, Patch, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard'; // Is this compatible with AdminAuth? 
// We likely need a unified or specific guard. AdminGuard checks role on request.user. 
// If JwtAuthGuard populates request.user from AdminAuthService login, we are good.
// AdminAuthService login uses JwtService. 
import { AdminGuard } from './guards/admin.guard';
import { AdminService } from './admin.service';
import { UpdateTenantStatusDto } from './dto/update-tenant-status.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { RotateTokenDto } from './dto/rotate-token.dto';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { AdminRole } from './entities/admin-user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
    constructor(private readonly service: AdminService) { }

    // 🔹 ANALYTICS
    @Get('analytics/overview')
    getOverview(@Request() req: any) {
        return this.service.getAnalytics(req.user);
    }

    // 🔹 AUDIT LOGS
    @Get('audit-logs')
    getLogs() {
        return this.service.getAuditLogs();
    }

    // 🔹 TENANTS
    @Get('tenants')
    getTenants(@Request() req: any) {
        return this.service.getTenants(req.user);
    }

    @Post('tenants')
    createTenant(@Request() req: any, @Body() dto: CreateTenantDto) {
        return this.service.createTenant(dto, req.user);
    }

    @Patch('tenants/:id/status')
    updateTenantStatus(
        @Param('id') tenantId: string,
        @Body() dto: UpdateTenantStatusDto,
    ) {
        return this.service.updateTenantStatus(tenantId, dto.status);
    }

    // 🔹 BILLING
    @Patch('tenants/:id/plan')
    updatePlan(
        @Param('id') tenantId: string,
        @Body() dto: UpdatePlanDto,
    ) {
        return this.service.updatePlan(tenantId, dto);
    }

    // 🔹 USAGE
    @Get('tenants/:id/usage')
    getUsage(@Param('id') tenantId: string) {
        return this.service.getUsage(tenantId);
    }

    // 🔹 META TOKENS
    @Get('meta/tokens')
    getMetaTokens() {
        return this.service.getMetaTokens();
    }

    @Post('meta/tokens/rotate')
    rotateMetaToken(@Body() dto: RotateTokenDto) {
        return this.service.rotateMetaToken(dto);
    }

    // 🔹 WHATSAPP ACCOUNTS
    @Get('whatsapp/accounts')
    getWhatsappAccounts() {
        return this.service.getWhatsappAccounts();
    }
}

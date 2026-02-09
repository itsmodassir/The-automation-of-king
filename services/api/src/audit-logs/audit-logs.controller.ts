import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogsController {
    constructor(private readonly auditLogsService: AuditLogsService) { }

    @Get()
    async getAuditLogs(
        @Req() req: any,
        @Query('limit') limit?: string,
    ) {
        // Security: Enforce tenant isolation by using the tenantId from the authenticated user's token
        return this.auditLogsService.findAll(req.user.tenantId, parseInt(limit) || 100);
    }
}

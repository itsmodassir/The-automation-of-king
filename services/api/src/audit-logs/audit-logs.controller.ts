import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogsController {
    constructor(private readonly auditLogsService: AuditLogsService) { }

    @Get()
    async getAuditLogs(
        @Query('tenantId') tenantId?: string,
        @Query('limit') limit?: string,
    ) {
        return this.auditLogsService.findAll(tenantId, parseInt(limit) || 100);
    }
}

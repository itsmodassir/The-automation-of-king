import { AuditLogsService } from './audit-logs.service';
export declare class AuditLogsController {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    getAuditLogs(tenantId?: string, limit?: string): Promise<import("../admin/entities/audit-log.entity").AuditLog[]>;
}

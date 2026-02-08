import { Repository } from 'typeorm';
import { AuditLog } from '../admin/entities/audit-log.entity';
export declare class AuditLogsService {
    private readonly auditLogRepo;
    constructor(auditLogRepo: Repository<AuditLog>);
    findAll(tenantId?: string, limit?: number): Promise<AuditLog[]>;
    create(data: Partial<AuditLog>): Promise<Partial<AuditLog> & AuditLog>;
}

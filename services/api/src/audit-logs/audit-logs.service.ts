import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../admin/entities/audit-log.entity';

@Injectable()
export class AuditLogsService {
    constructor(
        @InjectRepository(AuditLog)
        private readonly auditLogRepo: Repository<AuditLog>,
    ) { }

    async findAll(tenantId?: string, limit: number = 100) {
        const query = this.auditLogRepo.createQueryBuilder('log');

        if (tenantId) {
            query.where('log.tenantId = :tenantId', { tenantId });
        }

        return query
            .orderBy('log.createdAt', 'DESC')
            .limit(limit)
            .getMany();
    }

    async create(data: Partial<AuditLog>) {
        return this.auditLogRepo.save(data);
    }
}

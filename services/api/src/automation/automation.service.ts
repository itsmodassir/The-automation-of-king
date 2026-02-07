import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

@Injectable()
export class AutomationService {
    constructor(
        @InjectRepository(Tenant)
        private tenantRepo: Repository<Tenant>,
    ) { }

    async getSettings(tenantId: string) {
        const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
        return {
            enabled: tenant?.aiEnabled || false,
            confidence: tenant?.aiConfidenceThreshold || 0.7,
        };
    }

    async updateSettings(tenantId: string, settings: any) {
        return this.tenantRepo.update(tenantId, {
            aiEnabled: settings.enabled,
            aiConfidenceThreshold: settings.confidence,
        });
    }
}

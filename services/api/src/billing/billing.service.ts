import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillingLimit } from './billing-limit.entity';
import { UsageMetric } from './usage-metric.entity';

@Injectable()
export class BillingService {
    constructor(
        @InjectRepository(BillingLimit)
        private limitsRepo: Repository<BillingLimit>,
        @InjectRepository(UsageMetric)
        private usageRepo: Repository<UsageMetric>,
    ) { }

    async assertMessageQuota(tenantId: string) {
        const limit = await this.limitsRepo.findOne({ where: { tenantId } });
        if (!limit) return;

        const today = new Date().toISOString().slice(0, 10);

        const used = await this.usageRepo.sum('count', {
            tenantId,
            metricType: 'message_sent',
            createdAt: today as any,
        });

        if ((used || 0) >= limit.maxMessages) {
            throw new ForbiddenException(
                'Message quota exceeded. Upgrade plan.',
            );
        }
    }

    async assertAiQuota(tenantId: string) {
        const limit = await this.limitsRepo.findOne({ where: { tenantId } });
        if (!limit) return;

        const today = new Date().toISOString().slice(0, 10);

        const used = await this.usageRepo.sum('count', {
            tenantId,
            metricType: 'ai_credit',
            createdAt: today as any,
        });

        if ((used || 0) >= limit.maxAiCredits) {
            throw new ForbiddenException(
                'AI credit limit exceeded.',
            );
        }
    }

    async recordUsage(
        tenantId: string,
        metricType: 'message_sent' | 'ai_credit',
        count = 1,
    ) {
        await this.usageRepo.save({
            tenantId,
            metricType,
            count,
            createdAt: new Date(),
        });
    }

    async checkWarning(tenantId: string) {
        const limit = await this.limitsRepo.findOne({ where: { tenantId } });
        if (!limit) return null;

        const today = new Date().toISOString().slice(0, 10);

        const used = await this.usageRepo.sum('count', {
            tenantId,
            metricType: 'message_sent',
            createdAt: today as any,
        });

        if ((used || 0) / limit.maxMessages >= 0.8) {
            return 'You have used 80% of your message quota.';
        }

        return null;
    }
}

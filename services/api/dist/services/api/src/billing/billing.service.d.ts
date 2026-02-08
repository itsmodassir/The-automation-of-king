import { Repository } from 'typeorm';
import { BillingLimit } from './billing-limit.entity';
import { UsageMetric } from './usage-metric.entity';
export declare class BillingService {
    private limitsRepo;
    private usageRepo;
    constructor(limitsRepo: Repository<BillingLimit>, usageRepo: Repository<UsageMetric>);
    assertMessageQuota(tenantId: string): Promise<void>;
    assertAiQuota(tenantId: string): Promise<void>;
    recordUsage(tenantId: string, metricType: 'message_sent' | 'ai_credit', count?: number): Promise<void>;
    checkWarning(tenantId: string): Promise<string>;
}

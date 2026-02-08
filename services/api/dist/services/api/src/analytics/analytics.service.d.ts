import { Repository } from 'typeorm';
import { UsageMetric } from '../billing/usage-metric.entity';
import { WhatsAppAccount } from '../whatsapp/whatsapp-account.entity';
import { Message } from '../messages/message.entity';
export declare class AnalyticsService {
    private usage;
    private wa;
    private msg;
    constructor(usage: Repository<UsageMetric>, wa: Repository<WhatsAppAccount>, msg: Repository<Message>);
    getTenantOverview(tenantId: string): Promise<{
        whatsappNumber: string;
        messagesSent: number;
        aiCreditsUsed: number;
        openConversations: number;
    }>;
}

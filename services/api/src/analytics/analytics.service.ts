import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsageMetric } from '../billing/usage-metric.entity';
import { WhatsappAccount } from '../whatsapp/whatsapp-account.entity';
import { Message } from '../messages/message.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(UsageMetric) private usage: Repository<UsageMetric>,
        @InjectRepository(WhatsappAccount) private wa: Repository<WhatsappAccount>,
        @InjectRepository(Message) private msg: Repository<Message>,
    ) { }

    async getTenantOverview(tenantId: string) {
        const messagesToday = await this.usage.count({
            where: { tenantId, metricType: 'message_sent' },
        });
        const aiUsage = await this.usage.count({
            where: { tenantId, metricType: 'ai_credit' },
        });
        const waAccount = await this.wa.findOne({ where: { tenantId } });
        const openConversations = await this.msg.count({
            where: { tenantId }, // Simplified for MVP
        });

        return {
            whatsappNumber: waAccount?.phoneNumberId || 'Not Connected',
            messagesSent: messagesToday,
            aiCreditsUsed: aiUsage,
            openConversations,
        };
    }
}

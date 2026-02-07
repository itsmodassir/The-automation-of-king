import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { UsageMetric } from '../billing/usage-metric.entity';
import { WhatsappAccount } from '../whatsapp/whatsapp-account.entity';
import { Message } from '../messages/message.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UsageMetric, WhatsappAccount, Message])],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
    exports: [AnalyticsService],
})
export class AnalyticsModule { }

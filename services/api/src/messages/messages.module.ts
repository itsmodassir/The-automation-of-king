import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { MessagesController } from './messages.controller';
import { ConversationsController } from './conversations.controller';
import { DispatcherService } from './dispatcher.service';
import { Message } from './message.entity';
import { Conversation } from '../conversations/conversation.entity';
import { UsageMetric } from '../billing/usage-metric.entity';
import { BillingLimit } from '../billing/billing-limit.entity';
import { BillingModule } from '../billing/billing.module';

import { InboxGateway } from './inbox.gateway';
import { PushNotificationService } from './push.service';

import { ConversationService } from './conversation.service';
import { Contact } from '../contacts/contact.entity';

import { RedisBridgeService } from './redis-bridge.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, Conversation, UsageMetric, BillingLimit, Contact]),
        BullModule.registerQueue({
            name: 'send-message',
        }),
        BillingModule,
    ],
    controllers: [MessagesController, ConversationsController],
    providers: [DispatcherService, InboxGateway, PushNotificationService, ConversationService, RedisBridgeService],
    exports: [DispatcherService, InboxGateway, PushNotificationService, ConversationService],
})
export class MessagesModule { }

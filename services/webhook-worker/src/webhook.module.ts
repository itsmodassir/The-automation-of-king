import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { DedupeService } from './dedupe.service';
import { MetaSignatureGuard } from './signature.guard';
import { WebhookEvent } from './entities/webhook-event.entity';
import { WhatsappAccount } from '../../api/src/whatsapp/whatsapp-account.entity';
import { Message } from '../../api/src/messages/message.entity';

import { Conversation } from '../../api/src/conversations/conversation.entity';
import { Contact } from '../../api/src/contacts/contact.entity';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: false,
        }),
        TypeOrmModule.forFeature([WebhookEvent, WhatsappAccount, Message, Conversation, Contact]),
        BullModule.forRoot({
            url: process.env.REDIS_URL || 'redis://redis:6379',
        }),
        BullModule.registerQueue({ name: 'automation' }),
    ],
    controllers: [WebhookController],
    providers: [
        WebhookService,
        DedupeService,
        MetaSignatureGuard,
    ],
})
export class WebhookModule { }

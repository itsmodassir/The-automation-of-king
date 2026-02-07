import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhooksController } from './webhooks.controller';
import { MessagesModule } from '../messages/messages.module';
import { WebhookEvent } from './webhook-event.entity';

import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
    imports: [MessagesModule, WhatsappModule, TypeOrmModule.forFeature([WebhookEvent])],
    controllers: [WebhooksController],
})
export class WebhooksModule { }

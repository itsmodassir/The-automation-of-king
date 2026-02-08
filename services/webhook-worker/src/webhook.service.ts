import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import { DedupeService } from './dedupe.service';
import { WhatsAppAccount } from '../../api/src/whatsapp/whatsapp-account.entity';
import { Message } from '../../api/src/messages/message.entity';
import { Conversation } from '../../api/src/conversations/conversation.entity';
import { Contact } from '../../api/src/contacts/contact.entity';

@Injectable()
export class WebhookService {
    private pubClient: Redis;

    constructor(
        private dedupe: DedupeService,
        @InjectRepository(WhatsAppAccount)
        private waRepo: Repository<WhatsAppAccount>,
        @InjectRepository(Message)
        private msgRepo: Repository<Message>,
        @InjectRepository(Conversation)
        private convRepo: Repository<Conversation>,
        @InjectRepository(Contact)
        private contactRepo: Repository<Contact>,
        @InjectQueue('automation')
        private automationQueue: Queue,
    ) {
        this.pubClient = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
    }

    async process(payload: any) {
        const entry = payload.entry?.[0];
        const change = entry?.changes?.[0];
        const value = change?.value;

        if (!value?.messages) return;

        const phoneNumberId = value.metadata.phone_number_id;
        const account = await this.waRepo.findOne({ where: { phoneNumberId } });
        if (!account) return;

        const tenantId = account.tenantId;

        for (const msg of value.messages) {
            if (await this.dedupe.isDuplicate(msg.id)) continue;

            const phone = msg.from;

            // 1. Find or create contact
            let contact = await this.contactRepo.findOne({ where: { tenantId, phone } });
            if (!contact) {
                contact = await this.contactRepo.save({ tenantId, phone, name: phone });
            }

            // 2. Find or create conversation
            let conversation = await this.convRepo.findOne({ where: { tenantId, contactId: contact.id } });
            if (!conversation) {
                conversation = await this.convRepo.save({
                    tenantId,
                    contactId: contact.id,
                    status: 'open',
                    lastMessageAt: new Date(),
                });
            } else {
                await this.convRepo.update(conversation.id, { lastMessageAt: new Date(), status: 'open' });
            }

            // 3. Save message
            const savedMsg = await this.msgRepo.save({
                id: msg.id,
                tenantId,
                conversationId: conversation.id,
                direction: 'inbound',
                content: msg.text?.body || '',
                type: msg.type,
                metaMessageId: msg.id,
            });

            // 4. Notify API (Dashboard) via Redis Bridge
            this.pubClient.publish('events:message-new', JSON.stringify({
                tenantId,
                payload: {
                    id: savedMsg.id,
                    content: savedMsg.content,
                    direction: 'inbound',
                    createdAt: savedMsg.createdAt,
                    conversationId: conversation.id,
                }
            }));

            // 5. Push to automation
            await this.automationQueue.add('process', {
                tenantId,
                message: msg,
            });
        }
    }
}

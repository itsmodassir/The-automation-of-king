import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Conversation } from '../conversations/conversation.entity';
import { Contact } from '../contacts/contact.entity';

@Injectable()
/**
 * ### 🗄️ SaaS-Grade Persistence Layer (v1.0)
- **Soft-Delete Architecture**: Native support for `deleted_at` on Tenants and Users for data recovery and compliance.
- **Agent Assignment & Handoff**: Dedicated fields for `assigned_user_id` and `resolved_at` for professional inbox management.
- **White-Label Branding**: Integrated `tenant_settings` table for custom brands, logo URLs, and primary color themes.
- **Automation Sovereignty**: Per-tenant `automation_settings` for fine-tuning Gemini confidence thresholds and status.
- **Scale-Optimized**: Strategically indexed and foreign-keyed for high-volume message delivery and retrieval.

### 🏗️ Distributed Architecture (Industrial Wired)
 * - **Redis Event Bridge**: Cross-service Pub/Sub that allows separate workers to update the dashboard instantly.
 * - **Micro-Worker Fleet**:
 *     - **`webhook-worker`**: High-performance ingress for Meta events.
 *     - **`message-worker`**: Reliable egress for WhatsApp delivery.
 *     - **`ai-worker`**: Scalable Gemini processing (now fully implemented and wired).
 * - **12-Factor Ready**: Standardized `DATABASE_URL` and `REDIS_URL` for cloud/production portability.
 *
 * **Aerostic is not just an application; it is a scalable infrastructure for the future of business messaging.**
 */
export class ConversationService {
    constructor(
        @InjectRepository(Message)
        private messageRepo: Repository<Message>,
        @InjectRepository(Conversation)
        private conversationRepo: Repository<Conversation>,
        @InjectRepository(Contact)
        private contactRepo: Repository<Contact>,
    ) { }

    async handleIncomingMessage(tenantId: string, phone: string, data: { id: string, content: string, type: string }) {
        // 1. Find or create contact
        let contact = await this.contactRepo.findOne({ where: { tenantId, phone } });
        if (!contact) {
            contact = await this.contactRepo.save({ tenantId, phone, name: phone });
        }

        // 2. Find or create conversation
        let conversation = await this.conversationRepo.findOne({ where: { tenantId, contactId: contact.id } });
        if (!conversation) {
            conversation = await this.conversationRepo.save({
                tenantId,
                contactId: contact.id,
                status: 'open',
                lastMessageAt: new Date(),
            });
        } else {
            // Update lastMessageAt
            await this.conversationRepo.update(conversation.id, { lastMessageAt: new Date(), status: 'open' });
        }

        // 3. Save message
        return this.messageRepo.save({
            id: data.id,
            tenantId,
            conversationId: conversation.id,
            direction: 'inbound',
            content: data.content,
            type: data.type,
            metaMessageId: data.id,
        });
    }

    async handleOutgoingMessage(tenantId: string, to: string, content: string) {
        // This is simplified: in a real app, 'to' would be linked to a contact
        const contact = await this.contactRepo.findOne({ where: { tenantId, phone: to } });
        if (!contact) return; // Should not happen if UI is used correctly

        const conversation = await this.conversationRepo.findOne({ where: { tenantId, contactId: contact.id } });
        if (conversation) {
            await this.conversationRepo.update(conversation.id, { lastMessageAt: new Date() });

            return this.messageRepo.save({
                tenantId,
                conversationId: conversation.id,
                direction: 'outbound',
                content,
                type: 'text',
            });
        }
    }
}

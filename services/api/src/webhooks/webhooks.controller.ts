import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InboxGateway } from '../messages/inbox.gateway';
import { WebhookEvent } from './webhook-event.entity';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ConversationService } from '../messages/conversation.service';

@ApiTags('Webhooks')
@Controller('webhooks/whatsapp')
export class WebhooksController {
    constructor(
        private inboxGateway: InboxGateway,
        private whatsappService: WhatsappService,
        private conversationService: ConversationService,
        @InjectRepository(WebhookEvent)
        private eventRepo: Repository<WebhookEvent>
    ) { }

    @Get()
    @ApiOperation({ summary: 'Verify Webhook URL', description: 'Handles the Meta webhook verification challenge.' })
    @ApiQuery({ name: 'hub.mode', description: 'Mode check (subscribe)' })
    @ApiQuery({ name: 'hub.verify_token', description: 'Your secret verify token' })
    @ApiQuery({ name: 'hub.challenge', description: 'Challenge string to echo back' })
    @ApiResponse({ status: 200, description: 'Returns the challenge string if successful.' })
    @ApiResponse({ status: 403, description: 'Forbidden if token is invalid.' })
    verify(@Query('hub.mode') mode: string, @Query('hub.verify_token') token: string, @Query('hub.challenge') challenge: string) {
        if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
            return challenge;
        }
        return 'Forbidden';
    }

    @Post()
    @ApiOperation({ summary: 'Receive Webhook Events', description: 'Handles incoming messages and status updates from WhatsApp.' })
    @ApiBody({ description: 'Meta Webhook JSON Payload' })
    @ApiResponse({ status: 200, description: 'Event processed successfully.' })
    async handle(@Body() body: any) {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (message) {
            // 🛡️ IDEMPOTENCY CHECK
            const existing = await this.eventRepo.findOne({ where: { id: message.id } });
            if (existing) return { status: 'duplicate' };

            // 1. Resolve tenantId
            const tenantId = await this.resolveTenantId(value.metadata.phone_number_id);

            if (tenantId) {
                // 2. Save event & Persist Message
                await this.eventRepo.save({ id: message.id, type: 'whatsapp_message' });

                const phone = message.from;
                const savedMsg = await this.conversationService.handleIncomingMessage(tenantId, phone, {
                    id: message.id,
                    content: message.text?.body || '',
                    type: message.type,
                });

                // 3. Notify frontend
                this.inboxGateway.notifyNewMessage(tenantId, {
                    id: savedMsg.id,
                    content: savedMsg.content,
                    direction: savedMsg.direction,
                    createdAt: savedMsg.createdAt,
                    conversationId: savedMsg.conversationId,
                });
            }
        }

        return { status: 'ok' };
    }

    private async resolveTenantId(phoneNumberId: string): Promise<string | null> {
        // Real lookup by phone_number_id
        const account = await this.whatsappService.getAccountByPhoneNumberId(phoneNumberId);
        return account?.tenantId || null;
    }
}

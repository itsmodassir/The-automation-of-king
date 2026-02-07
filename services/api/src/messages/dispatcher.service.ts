import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { SendMessageDto } from './dto/send-message.dto';
import { ConversationService } from './conversation.service';

import { InboxGateway } from './inbox.gateway';

@Injectable()
export class DispatcherService {
    constructor(
        @InjectQueue('send-message') private queue: Queue,
        private conversationService: ConversationService,
        private inboxGateway: InboxGateway,
    ) { }

    async enqueue(dto: SendMessageDto, tenantId: string) {
        // 1. Persist outgoing message locally first (for history)
        const savedMsg = await this.conversationService.handleOutgoingMessage(tenantId, dto.to, dto.text);

        // 2. Notify Frontend instantly (Optimistic UI)
        if (savedMsg) {
            this.inboxGateway.notifyNewMessage(tenantId, {
                id: savedMsg.id,
                content: savedMsg.content,
                direction: 'outbound',
                createdAt: savedMsg.createdAt,
                conversationId: savedMsg.conversationId,
            });
        }

        // 2. Add to delivery queue
        await this.queue.add('send', {
            tenantId,
            messageId: savedMsg?.id,
            phoneNumberId: dto.phoneNumberId,
            accessToken: dto.accessToken,
            message: {
                messaging_product: 'whatsapp',
                to: dto.to,
                type: 'text',
                text: { body: dto.text },
                context: {
                    message_id: dto.clientMessageId,
                },
            },
        }, {
            attempts: 5,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        });

        return { status: 'queued', messageId: savedMsg?.id };
    }
}

import { Repository } from 'typeorm';
import { InboxGateway } from '../messages/inbox.gateway';
import { WebhookEvent } from './webhook-event.entity';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ConversationService } from '../messages/conversation.service';
export declare class WebhooksController {
    private inboxGateway;
    private whatsappService;
    private conversationService;
    private eventRepo;
    constructor(inboxGateway: InboxGateway, whatsappService: WhatsappService, conversationService: ConversationService, eventRepo: Repository<WebhookEvent>);
    verify(mode: string, token: string, challenge: string): string;
    handle(body: any): Promise<{
        status: string;
    }>;
    private resolveTenantId;
}

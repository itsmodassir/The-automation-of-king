import { Queue } from 'bullmq';
import { SendMessageDto } from './dto/send-message.dto';
import { ConversationService } from './conversation.service';
import { InboxGateway } from './inbox.gateway';
export declare class DispatcherService {
    private queue;
    private conversationService;
    private inboxGateway;
    constructor(queue: Queue, conversationService: ConversationService, inboxGateway: InboxGateway);
    enqueue(dto: SendMessageDto, tenantId: string): Promise<{
        status: string;
        messageId: string;
    }>;
}

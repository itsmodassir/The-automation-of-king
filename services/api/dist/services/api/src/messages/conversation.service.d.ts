import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Conversation } from '../conversations/conversation.entity';
import { Contact } from '../contacts/contact.entity';
export declare class ConversationService {
    private messageRepo;
    private conversationRepo;
    private contactRepo;
    constructor(messageRepo: Repository<Message>, conversationRepo: Repository<Conversation>, contactRepo: Repository<Contact>);
    handleIncomingMessage(tenantId: string, phone: string, data: {
        id: string;
        content: string;
        type: string;
    }): Promise<{
        id: string;
        tenantId: string;
        conversationId: string;
        direction: "inbound";
        content: string;
        type: string;
        metaMessageId: string;
    } & Message>;
    handleOutgoingMessage(tenantId: string, to: string, content: string): Promise<{
        tenantId: string;
        conversationId: string;
        direction: "outbound";
        content: string;
        type: string;
    } & Message>;
}

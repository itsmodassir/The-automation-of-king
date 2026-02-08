import { Tenant } from '../tenants/tenant.entity';
import { Conversation } from '../conversations/conversation.entity';
export declare class Message {
    id: string;
    conversation: Conversation;
    conversationId: string;
    tenant: Tenant;
    tenantId: string;
    direction: 'inbound' | 'outbound';
    type: string;
    content: string;
    metaMessageId: string;
    createdAt: Date;
}

import { Tenant } from '../tenants/tenant.entity';
import { Contact } from '../contacts/contact.entity';
export declare class Conversation {
    id: string;
    tenant: Tenant;
    tenantId: string;
    contact: Contact;
    contactId: string;
    status: string;
    lastMessageAt: Date;
    createdAt: Date;
}

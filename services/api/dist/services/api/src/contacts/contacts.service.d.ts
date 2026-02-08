import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
export declare class ContactsService {
    private contacts;
    constructor(contacts: Repository<Contact>);
    findAll(tenantId: string): Promise<Contact[]>;
    findOne(id: string, tenantId: string): Promise<Contact>;
    create(dto: any, tenantId: string): Promise<any>;
}

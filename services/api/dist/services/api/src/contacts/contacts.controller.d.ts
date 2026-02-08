import { ContactsService } from './contacts.service';
export declare class ContactsController {
    private service;
    constructor(service: ContactsService);
    findAll(req: any): Promise<import("./contact.entity").Contact[]>;
    findOne(id: string, req: any): Promise<import("./contact.entity").Contact>;
    create(dto: any, req: any): Promise<any>;
}

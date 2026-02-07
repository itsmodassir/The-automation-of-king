import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';

@Injectable()
export class ContactsService {
    constructor(
        @InjectRepository(Contact) private contacts: Repository<Contact>,
    ) { }

    findAll(tenantId: string) {
        return this.contacts.find({ where: { tenantId } });
    }

    findOne(id: string, tenantId: string) {
        return this.contacts.findOne({ where: { id, tenantId } });
    }

    create(dto: any, tenantId: string) {
        return this.contacts.save({ ...dto, tenantId });
    }
}

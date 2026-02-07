import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhatsappAccount } from './whatsapp-account.entity';

@Injectable()
export class WhatsappService {
    constructor(
        @InjectRepository(WhatsappAccount)
        private accountRepo: Repository<WhatsappAccount>,
    ) { }

    async getAccount(tenantId: string) {
        return this.accountRepo.findOne({ where: { tenantId } });
    }

    async saveAccount(data: any) {
        return this.accountRepo.save(data);
    }

    async getAccountByPhoneNumberId(phoneNumberId: string) {
        return this.accountRepo.findOne({ where: { phoneNumberId } });
    }

    async rotateToken(tenantId: string, newToken: string) {
        // In a real app, encrypt newToken using CryptoService here
        return this.accountRepo.update({ tenantId }, { accessTokenEncrypted: newToken });
    }
}

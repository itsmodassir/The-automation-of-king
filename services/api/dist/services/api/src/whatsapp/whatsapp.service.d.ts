import { Repository } from 'typeorm';
import { WhatsAppAccount } from './whatsapp-account.entity';
import { Redis } from 'ioredis';
export declare class WhatsappService {
    private accountRepo;
    private redis;
    constructor(accountRepo: Repository<WhatsAppAccount>, redis: Redis);
    getAccount(tenantId: string): Promise<WhatsAppAccount>;
    startEmbeddedSignup(tenantId: string): Promise<{
        configId: string;
        redirectUri: string;
        state: string;
        url: string;
    }>;
    saveAccount(data: Partial<WhatsAppAccount>): Promise<WhatsAppAccount>;
    getAccountByPhoneNumberId(phoneNumberId: string): Promise<WhatsAppAccount>;
    rotateToken(tenantId: string, newToken: string): Promise<import("typeorm").UpdateResult>;
}

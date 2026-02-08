import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { WhatsAppAccount } from '../whatsapp/whatsapp-account.entity';
export declare class MetaService {
    private redis;
    private whatsappAccountRepo;
    constructor(redis: Redis, whatsappAccountRepo: Repository<WhatsAppAccount>);
    handleOAuthCallback(code: string, state: string): Promise<{
        success: boolean;
    }>;
}

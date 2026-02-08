import { HttpService } from '@nestjs/axios';
import { WhatsAppAccount } from '../whatsapp/whatsapp-account.entity';
import { Repository } from 'typeorm';
export declare class WebhooksService {
    private readonly httpService;
    private readonly whatsappAccountRepo;
    private readonly logger;
    constructor(httpService: HttpService, whatsappAccountRepo: Repository<WhatsAppAccount>);
    exchangeCodeForToken(code: string, tenantId: string): Promise<void>;
}

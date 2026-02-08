import { WhatsappService } from './whatsapp.service';
export declare class WhatsappController {
    private whatsappService;
    constructor(whatsappService: WhatsappService);
    startEmbedded(req: any): Promise<{
        configId: string;
        redirectUri: string;
        state: string;
        url: string;
    }>;
    getAccount(req: any): Promise<{
        connected: boolean;
        account: {
            phoneNumber: string;
            businessName: string;
            wabaId: string;
            status: string;
        };
    }>;
}

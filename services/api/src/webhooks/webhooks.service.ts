import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { WhatsappAccount } from '../whatsapp/whatsapp-account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WebhooksService {
    private readonly logger = new Logger(WebhooksService.name);

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(WhatsappAccount)
        private readonly whatsappAccountRepo: Repository<WhatsappAccount>,
    ) { }

    async exchangeCodeForToken(code: string, tenantId: string) {
        try {
            const tokenUrl = `https://graph.facebook.com/v22.0/oauth/access_token`;
            const { data } = await firstValueFrom<{ data: any }>(
                this.httpService.get(tokenUrl, {
                    params: {
                        client_id: process.env.META_APP_ID,
                        client_secret: process.env.META_APP_SECRET,
                        code,
                        redirect_uri: `${process.env.API_URL}/meta/callback`,
                    },
                }),
            );

            const accessToken = data.access_token;
            this.logger.log(`Onboarded tenant ${tenantId} with token: ${accessToken.substring(0, 10)}...`);

        } catch (error: any) {
            this.logger.error('Error exchanging code for token', error.response?.data || error.message);
            throw error;
        }
    }
}

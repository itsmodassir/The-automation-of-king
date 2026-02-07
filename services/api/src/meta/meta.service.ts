import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { WhatsappAccount } from '../whatsapp/whatsapp-account.entity';
import axios from 'axios';
import { decrypt, encrypt } from '@aerostic/common';

@Injectable()
export class MetaService {
    constructor(
        @Inject('REDIS_CLIENT') private redis: Redis,
        @InjectRepository(WhatsappAccount) private whatsappAccountRepo: Repository<WhatsappAccount>,
    ) { }

    async handleOAuthCallback(code: string, state: string) {
        // 1️⃣ Validate state
        const cachedTenant = await this.redis.get(`oauth:state:${state}`);
        if (!cachedTenant) {
            throw new BadRequestException('Invalid or expired OAuth state');
        }

        const decryptedState = decrypt(state);
        let decoded: any;
        try {
            decoded = JSON.parse(decryptedState);
        } catch (e) {
            decoded = { tenantId: decryptedState };
        }

        if (decoded.tenantId !== cachedTenant) {
            throw new BadRequestException('OAuth state mismatch');
        }

        await this.redis.del(`oauth:state:${state}`);

        // 2️⃣ Exchange code → short token
        let tokenRes;
        try {
            tokenRes = await axios.get(
                'https://graph.facebook.com/v22.0/oauth/access_token',
                {
                    params: {
                        client_id: process.env.META_APP_ID,
                        client_secret: process.env.META_APP_SECRET,
                        redirect_uri: 'https://api.aerostic.com/meta/callback',
                        code,
                    },
                },
            );
        } catch (e: any) {
            console.error('META TOKEN ERROR', e.response?.data);
            throw new BadRequestException('Meta OAuth failed');
        }

        const shortToken = tokenRes.data.access_token;

        // 3️⃣ Exchange → long-lived token
        const longToken = await axios.get(
            'https://graph.facebook.com/v22.0/oauth/access_token',
            {
                params: {
                    grant_type: 'fb_exchange_token',
                    client_id: process.env.META_APP_ID,
                    client_secret: process.env.META_APP_SECRET,
                    fb_exchange_token: shortToken,
                },
            },
        );

        const accessToken = longToken.data.access_token;
        const expiresAt = new Date(
            Date.now() + longToken.data.expires_in * 1000,
        );

        // 4️⃣ Fetch WABA
        const me = await axios.get(
            'https://graph.facebook.com/v22.0/me',
            {
                params: {
                    fields: 'whatsapp_business_accounts',
                    access_token: accessToken,
                },
            },
        );

        const waba = me.data.whatsapp_business_accounts?.data?.[0];
        if (!waba) {
            throw new BadRequestException('No WABA selected');
        }

        // 5️⃣ Fetch phone number
        const phone = await axios.get(
            `https://graph.facebook.com/v22.0/${waba.id}/phone_numbers`,
            {
                params: { access_token: accessToken },
            },
        );

        const number = phone.data.data?.[0];
        if (!number) {
            throw new BadRequestException('No phone number found');
        }

        // 6️⃣ Persist
        await this.whatsappAccountRepo.save({
            tenantId: decoded.tenantId,
            wabaId: waba.id,
            phoneNumberId: number.id,
            displayPhoneNumber: number.display_phone_number,
            accessTokenEncrypted: encrypt({ token: accessToken }), // Standardized object for encrypt
            tokenExpiresAt: expiresAt,
            status: 'connected',
        });

        return { success: true };
    }
}

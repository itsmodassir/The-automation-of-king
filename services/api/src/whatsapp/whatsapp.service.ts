import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhatsAppAccount } from './whatsapp-account.entity';
import * as crypto from 'crypto';
import { Redis } from 'ioredis';
import { encrypt } from '@aerostic/common';

@Injectable()
export class WhatsappService {
    constructor(
        @InjectRepository(WhatsAppAccount)
        private accountRepo: Repository<WhatsAppAccount>,
        @Inject('REDIS_CLIENT') private redis: Redis,
    ) { }

    async getAccount(tenantId: string) {
        return this.accountRepo.findOne({ where: { tenantId } });
    }

    async startEmbeddedSignup(tenantId: string) {
        const configId = process.env.META_EMBEDDED_CONFIG_ID;
        const redirectUri = `${process.env.API_DOMAIN || 'http://localhost:3001'}/api/meta/callback`;

        // Generate state compatible with MetaService
        const statePayload = JSON.stringify({ tenantId });
        // encrypt returns an object with IV and content usually, but MetaService treats it as string?
        // Let's check MetaService again. It calls decrypt(state).
        // If encrypt returns string, this is fine.
        // Assuming encrypt returns string based on MetaService usage.
        const state = encrypt(statePayload);

        // Store in Redis as expected by MetaService
        await this.redis.set(`oauth:state:${state}`, tenantId, 'EX', 3600);

        return {
            configId,
            redirectUri,
            state,
            url: `https://www.facebook.com/v22.0/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&config_id=${configId}`
        };
    }

    async saveAccount(data: Partial<WhatsAppAccount>) {
        // Check if account already exists for this tenant
        const existing = await this.accountRepo.findOne({
            where: { tenantId: data.tenantId }
        });

        if (existing) {
            // Update existing account
            await this.accountRepo.update(existing.id, data);
            return this.accountRepo.findOne({ where: { id: existing.id } });
        }

        // Create new account
        return this.accountRepo.save(data);
    }

    async getAccountByPhoneNumberId(phoneNumberId: string) {
        return this.accountRepo.findOne({ where: { phoneNumberId } });
    }

    async rotateToken(tenantId: string, newToken: string) {
        return this.accountRepo.update({ tenantId }, { accessToken: newToken });
    }
}

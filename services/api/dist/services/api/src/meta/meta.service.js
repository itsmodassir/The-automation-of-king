"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ioredis_1 = require("ioredis");
const whatsapp_account_entity_1 = require("../whatsapp/whatsapp-account.entity");
const axios_1 = require("axios");
const common_2 = require("../../../../shared/index");
let MetaService = class MetaService {
    constructor(redis, whatsappAccountRepo) {
        this.redis = redis;
        this.whatsappAccountRepo = whatsappAccountRepo;
    }
    async handleOAuthCallback(code, state) {
        const cachedTenant = await this.redis.get(`oauth:state:${state}`);
        if (!cachedTenant) {
            throw new common_1.BadRequestException('Invalid or expired OAuth state');
        }
        const decryptedState = (0, common_2.decrypt)(state);
        let decoded;
        try {
            decoded = JSON.parse(decryptedState);
        }
        catch (e) {
            decoded = { tenantId: decryptedState };
        }
        if (decoded.tenantId !== cachedTenant) {
            throw new common_1.BadRequestException('OAuth state mismatch');
        }
        await this.redis.del(`oauth:state:${state}`);
        let tokenRes;
        try {
            tokenRes = await axios_1.default.get('https://graph.facebook.com/v22.0/oauth/access_token', {
                params: {
                    client_id: process.env.META_APP_ID,
                    client_secret: process.env.META_APP_SECRET,
                    redirect_uri: `${process.env.API_DOMAIN || 'http://localhost:3001'}/api/meta/callback`,
                    code,
                },
            });
        }
        catch (e) {
            console.error('META TOKEN ERROR', e.response?.data);
            throw new common_1.BadRequestException('Meta OAuth failed');
        }
        const shortToken = tokenRes.data.access_token;
        const longToken = await axios_1.default.get('https://graph.facebook.com/v22.0/oauth/access_token', {
            params: {
                grant_type: 'fb_exchange_token',
                client_id: process.env.META_APP_ID,
                client_secret: process.env.META_APP_SECRET,
                fb_exchange_token: shortToken,
            },
        });
        const accessToken = longToken.data.access_token;
        const expiresAt = new Date(Date.now() + longToken.data.expires_in * 1000);
        const me = await axios_1.default.get('https://graph.facebook.com/v22.0/me', {
            params: {
                fields: 'whatsapp_business_accounts',
                access_token: accessToken,
            },
        });
        const waba = me.data.whatsapp_business_accounts?.data?.[0];
        if (!waba) {
            throw new common_1.BadRequestException('No WABA selected');
        }
        const phone = await axios_1.default.get(`https://graph.facebook.com/v22.0/${waba.id}/phone_numbers`, {
            params: { access_token: accessToken },
        });
        const number = phone.data.data?.[0];
        if (!number) {
            throw new common_1.BadRequestException('No phone number found');
        }
        await this.whatsappAccountRepo.save({
            tenantId: decoded.tenantId,
            wabaId: waba.id,
            phoneNumberId: number.id,
            displayPhoneNumber: number.display_phone_number,
            accessTokenEncrypted: (0, common_2.encrypt)({ token: accessToken }),
            tokenExpiresAt: expiresAt,
            status: 'connected',
        });
        return { success: true };
    }
};
exports.MetaService = MetaService;
exports.MetaService = MetaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_CLIENT')),
    __param(1, (0, typeorm_1.InjectRepository)(whatsapp_account_entity_1.WhatsAppAccount)),
    __metadata("design:paramtypes", [ioredis_1.Redis,
        typeorm_2.Repository])
], MetaService);
//# sourceMappingURL=meta.service.js.map
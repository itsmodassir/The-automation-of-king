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
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const whatsapp_account_entity_1 = require("./whatsapp-account.entity");
const ioredis_1 = require("ioredis");
const common_2 = require("../../../../shared/index");
let WhatsappService = class WhatsappService {
    constructor(accountRepo, redis) {
        this.accountRepo = accountRepo;
        this.redis = redis;
    }
    async getAccount(tenantId) {
        return this.accountRepo.findOne({ where: { tenantId } });
    }
    async startEmbeddedSignup(tenantId) {
        const configId = process.env.META_EMBEDDED_CONFIG_ID;
        const redirectUri = `${process.env.API_DOMAIN || 'http://localhost:3001'}/api/meta/callback`;
        const statePayload = JSON.stringify({ tenantId });
        const state = (0, common_2.encrypt)(statePayload);
        await this.redis.set(`oauth:state:${state}`, tenantId, 'EX', 3600);
        return {
            configId,
            redirectUri,
            state,
            url: `https://www.facebook.com/v22.0/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&config_id=${configId}`
        };
    }
    async saveAccount(data) {
        const existing = await this.accountRepo.findOne({
            where: { tenantId: data.tenantId }
        });
        if (existing) {
            await this.accountRepo.update(existing.id, data);
            return this.accountRepo.findOne({ where: { id: existing.id } });
        }
        return this.accountRepo.save(data);
    }
    async getAccountByPhoneNumberId(phoneNumberId) {
        return this.accountRepo.findOne({ where: { phoneNumberId } });
    }
    async rotateToken(tenantId, newToken) {
        return this.accountRepo.update({ tenantId }, { accessToken: newToken });
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(whatsapp_account_entity_1.WhatsAppAccount)),
    __param(1, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        ioredis_1.Redis])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map
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
var WebhooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const typeorm_1 = require("@nestjs/typeorm");
const whatsapp_account_entity_1 = require("../whatsapp/whatsapp-account.entity");
const typeorm_2 = require("typeorm");
let WebhooksService = WebhooksService_1 = class WebhooksService {
    constructor(httpService, whatsappAccountRepo) {
        this.httpService = httpService;
        this.whatsappAccountRepo = whatsappAccountRepo;
        this.logger = new common_1.Logger(WebhooksService_1.name);
    }
    async exchangeCodeForToken(code, tenantId) {
        try {
            const tokenUrl = `https://graph.facebook.com/v22.0/oauth/access_token`;
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(tokenUrl, {
                params: {
                    client_id: process.env.META_APP_ID,
                    client_secret: process.env.META_APP_SECRET,
                    code,
                    redirect_uri: `${process.env.API_URL}/meta/callback`,
                },
            }));
            const accessToken = data.access_token;
            this.logger.log(`Onboarded tenant ${tenantId} with token: ${accessToken.substring(0, 10)}...`);
        }
        catch (error) {
            this.logger.error('Error exchanging code for token', error.response?.data || error.message);
            throw error;
        }
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = WebhooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(whatsapp_account_entity_1.WhatsAppAccount)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        typeorm_2.Repository])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map
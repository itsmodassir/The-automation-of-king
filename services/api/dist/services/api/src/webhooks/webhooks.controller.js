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
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inbox_gateway_1 = require("../messages/inbox.gateway");
const webhook_event_entity_1 = require("./webhook-event.entity");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const conversation_service_1 = require("../messages/conversation.service");
let WebhooksController = class WebhooksController {
    constructor(inboxGateway, whatsappService, conversationService, eventRepo) {
        this.inboxGateway = inboxGateway;
        this.whatsappService = whatsappService;
        this.conversationService = conversationService;
        this.eventRepo = eventRepo;
    }
    verify(mode, token, challenge) {
        if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
            return challenge;
        }
        return 'Forbidden';
    }
    async handle(body) {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];
        if (message) {
            const existing = await this.eventRepo.findOne({ where: { id: message.id } });
            if (existing)
                return { status: 'duplicate' };
            const tenantId = await this.resolveTenantId(value.metadata.phone_number_id);
            if (tenantId) {
                await this.eventRepo.save({ id: message.id, type: 'whatsapp_message' });
                const phone = message.from;
                const savedMsg = await this.conversationService.handleIncomingMessage(tenantId, phone, {
                    id: message.id,
                    content: message.text?.body || '',
                    type: message.type,
                });
                this.inboxGateway.notifyNewMessage(tenantId, {
                    id: savedMsg.id,
                    content: savedMsg.content,
                    direction: savedMsg.direction,
                    createdAt: savedMsg.createdAt,
                    conversationId: savedMsg.conversationId,
                });
            }
        }
        return { status: 'ok' };
    }
    async resolveTenantId(phoneNumberId) {
        const account = await this.whatsappService.getAccountByPhoneNumberId(phoneNumberId);
        return account?.tenantId || null;
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Verify Webhook URL', description: 'Handles the Meta webhook verification challenge.' }),
    (0, swagger_1.ApiQuery)({ name: 'hub.mode', description: 'Mode check (subscribe)' }),
    (0, swagger_1.ApiQuery)({ name: 'hub.verify_token', description: 'Your secret verify token' }),
    (0, swagger_1.ApiQuery)({ name: 'hub.challenge', description: 'Challenge string to echo back' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the challenge string if successful.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden if token is invalid.' }),
    __param(0, (0, common_1.Query)('hub.mode')),
    __param(1, (0, common_1.Query)('hub.verify_token')),
    __param(2, (0, common_1.Query)('hub.challenge')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Receive Webhook Events', description: 'Handles incoming messages and status updates from WhatsApp.' }),
    (0, swagger_1.ApiBody)({ description: 'Meta Webhook JSON Payload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Event processed successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handle", null);
exports.WebhooksController = WebhooksController = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('webhooks/whatsapp'),
    __param(3, (0, typeorm_1.InjectRepository)(webhook_event_entity_1.WebhookEvent)),
    __metadata("design:paramtypes", [inbox_gateway_1.InboxGateway,
        whatsapp_service_1.WhatsappService,
        conversation_service_1.ConversationService,
        typeorm_2.Repository])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map
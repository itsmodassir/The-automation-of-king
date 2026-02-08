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
exports.DispatcherService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const bullmq_1 = require("bullmq");
const conversation_service_1 = require("./conversation.service");
const inbox_gateway_1 = require("./inbox.gateway");
let DispatcherService = class DispatcherService {
    constructor(queue, conversationService, inboxGateway) {
        this.queue = queue;
        this.conversationService = conversationService;
        this.inboxGateway = inboxGateway;
    }
    async enqueue(dto, tenantId) {
        const savedMsg = await this.conversationService.handleOutgoingMessage(tenantId, dto.to, dto.text);
        if (savedMsg) {
            this.inboxGateway.notifyNewMessage(tenantId, {
                id: savedMsg.id,
                content: savedMsg.content,
                direction: 'outbound',
                createdAt: savedMsg.createdAt,
                conversationId: savedMsg.conversationId,
            });
        }
        await this.queue.add('send', {
            tenantId,
            messageId: savedMsg?.id,
            phoneNumberId: dto.phoneNumberId,
            accessToken: dto.accessToken,
            message: {
                messaging_product: 'whatsapp',
                to: dto.to,
                type: 'text',
                text: { body: dto.text },
                context: {
                    message_id: dto.clientMessageId,
                },
            },
        }, {
            attempts: 5,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        });
        return { status: 'queued', messageId: savedMsg?.id };
    }
};
exports.DispatcherService = DispatcherService;
exports.DispatcherService = DispatcherService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('send-message')),
    __metadata("design:paramtypes", [bullmq_1.Queue,
        conversation_service_1.ConversationService,
        inbox_gateway_1.InboxGateway])
], DispatcherService);
//# sourceMappingURL=dispatcher.service.js.map
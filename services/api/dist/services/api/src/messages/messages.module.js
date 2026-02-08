"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const messages_controller_1 = require("./messages.controller");
const conversations_controller_1 = require("./conversations.controller");
const dispatcher_service_1 = require("./dispatcher.service");
const message_entity_1 = require("./message.entity");
const conversation_entity_1 = require("../conversations/conversation.entity");
const usage_metric_entity_1 = require("../billing/usage-metric.entity");
const billing_limit_entity_1 = require("../billing/billing-limit.entity");
const billing_module_1 = require("../billing/billing.module");
const inbox_gateway_1 = require("./inbox.gateway");
const push_service_1 = require("./push.service");
const conversation_service_1 = require("./conversation.service");
const contact_entity_1 = require("../contacts/contact.entity");
const redis_bridge_service_1 = require("./redis-bridge.service");
let MessagesModule = class MessagesModule {
};
exports.MessagesModule = MessagesModule;
exports.MessagesModule = MessagesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([message_entity_1.Message, conversation_entity_1.Conversation, usage_metric_entity_1.UsageMetric, billing_limit_entity_1.BillingLimit, contact_entity_1.Contact]),
            bull_1.BullModule.registerQueue({
                name: 'send-message',
            }),
            billing_module_1.BillingModule,
        ],
        controllers: [messages_controller_1.MessagesController, conversations_controller_1.ConversationsController],
        providers: [dispatcher_service_1.DispatcherService, inbox_gateway_1.InboxGateway, push_service_1.PushNotificationService, conversation_service_1.ConversationService, redis_bridge_service_1.RedisBridgeService],
        exports: [dispatcher_service_1.DispatcherService, inbox_gateway_1.InboxGateway, push_service_1.PushNotificationService, conversation_service_1.ConversationService],
    })
], MessagesModule);
//# sourceMappingURL=messages.module.js.map
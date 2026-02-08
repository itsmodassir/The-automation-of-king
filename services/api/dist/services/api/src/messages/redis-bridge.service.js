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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisBridgeService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const inbox_gateway_1 = require("./inbox.gateway");
let RedisBridgeService = class RedisBridgeService {
    constructor(inboxGateway) {
        this.inboxGateway = inboxGateway;
        this.subClient = new ioredis_1.Redis(process.env.REDIS_URL || 'redis://redis:6379');
    }
    onModuleInit() {
        this.subClient.subscribe('events:message-new');
        this.subClient.on('message', (channel, message) => {
            if (channel === 'events:message-new') {
                const data = JSON.parse(message);
                this.inboxGateway.notifyNewMessage(data.tenantId, data.payload);
            }
        });
        console.log('Redis Bridge: Listening for cross-service events...');
    }
};
exports.RedisBridgeService = RedisBridgeService;
exports.RedisBridgeService = RedisBridgeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [inbox_gateway_1.InboxGateway])
], RedisBridgeService);
//# sourceMappingURL=redis-bridge.service.js.map
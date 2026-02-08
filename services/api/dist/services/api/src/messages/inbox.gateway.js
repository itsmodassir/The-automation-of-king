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
exports.InboxGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let InboxGateway = class InboxGateway {
    handleConnection(client) {
        const tenantId = client.handshake.query.tenantId;
        if (tenantId) {
            client.join(`tenant:${tenantId}`);
            console.log(`Client connected to tenant room: tenant:${tenantId}`);
        }
    }
    handleDisconnect(client) {
        console.log('Client disconnected');
    }
    notifyNewMessage(tenantId, message) {
        this.server.to(`tenant:${tenantId}`).emit('message:new', message);
    }
};
exports.InboxGateway = InboxGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], InboxGateway.prototype, "server", void 0);
exports.InboxGateway = InboxGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    (0, common_1.Injectable)()
], InboxGateway);
//# sourceMappingURL=inbox.gateway.js.map
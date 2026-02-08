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
exports.WhatsappController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const whatsapp_service_1 = require("./whatsapp.service");
const swagger_1 = require("@nestjs/swagger");
let WhatsappController = class WhatsappController {
    constructor(whatsappService) {
        this.whatsappService = whatsappService;
    }
    async startEmbedded(req) {
        return this.whatsappService.startEmbeddedSignup(req.user.tenantId);
    }
    async getAccount(req) {
        const account = await this.whatsappService.getAccount(req.user.tenantId);
        if (!account) {
            return {
                connected: false,
                account: null
            };
        }
        return {
            connected: true,
            account: {
                phoneNumber: account.phoneNumber,
                businessName: account.businessName,
                wabaId: account.wabaId,
                status: account.status
            }
        };
    }
};
exports.WhatsappController = WhatsappController;
__decorate([
    (0, common_1.Get)('embedded/start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start Embedded Signup', description: 'Returns the pre-filled configuration for the Meta Embedded Signup popup.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Configuration object returned.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "startEmbedded", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get WhatsApp Account Status', description: 'Checks if the tenant has a connected WhatsApp Business Account.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Connection status and account details.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "getAccount", null);
exports.WhatsappController = WhatsappController = __decorate([
    (0, swagger_1.ApiTags)('WhatsApp'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('whatsapp'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsappService])
], WhatsappController);
//# sourceMappingURL=whatsapp.controller.js.map
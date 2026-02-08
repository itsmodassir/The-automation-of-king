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
exports.MetaController = void 0;
const common_1 = require("@nestjs/common");
const meta_service_1 = require("./meta.service");
let MetaController = class MetaController {
    constructor(metaService) {
        this.metaService = metaService;
    }
    async handle(code, state, res) {
        try {
            if (!code || !state) {
                throw new common_1.HttpException('Missing code or state parameter', common_1.HttpStatus.BAD_REQUEST);
            }
            await this.metaService.handleOAuthCallback(code, state);
            const frontendUrl = process.env.APP_DOMAIN || 'http://localhost:3000';
            res.redirect(`${frontendUrl}/dashboard/whatsapp?success=true`);
        }
        catch (error) {
            console.error('OAuth callback error:', error);
            const frontendUrl = process.env.APP_DOMAIN || 'http://localhost:3000';
            res.redirect(`${frontendUrl}/dashboard/whatsapp?error=${encodeURIComponent(error.message)}`);
        }
    }
};
exports.MetaController = MetaController;
__decorate([
    (0, common_1.Get)('callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MetaController.prototype, "handle", null);
exports.MetaController = MetaController = __decorate([
    (0, common_1.Controller)('meta'),
    __metadata("design:paramtypes", [meta_service_1.MetaService])
], MetaController);
//# sourceMappingURL=meta.controller.js.map
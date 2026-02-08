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
exports.WhatsAppAccount = void 0;
const typeorm_1 = require("typeorm");
const tenant_entity_1 = require("../tenants/tenant.entity");
let WhatsAppAccount = class WhatsAppAccount {
};
exports.WhatsAppAccount = WhatsAppAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_id' }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], WhatsAppAccount.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'waba_id', unique: true }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "wabaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number_id' }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "phoneNumberId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number', length: 20 }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_phone_number', length: 20, nullable: true }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "displayPhoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'business_name', nullable: true }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "businessName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'access_token', type: 'text' }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "accessToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'access_token_encrypted', type: 'text', nullable: true }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "accessTokenEncrypted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'token_expires_at', nullable: true }),
    __metadata("design:type", Date)
], WhatsAppAccount.prototype, "tokenExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active', length: 50 }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WhatsAppAccount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], WhatsAppAccount.prototype, "updatedAt", void 0);
exports.WhatsAppAccount = WhatsAppAccount = __decorate([
    (0, typeorm_1.Entity)('whatsapp_accounts')
], WhatsAppAccount);
//# sourceMappingURL=whatsapp-account.entity.js.map
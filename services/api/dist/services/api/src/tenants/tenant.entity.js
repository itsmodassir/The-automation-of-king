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
exports.Tenant = void 0;
const typeorm_1 = require("typeorm");
let Tenant = class Tenant {
};
exports.Tenant = Tenant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Tenant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Tenant.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Tenant.prototype, "domain", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active' }),
    __metadata("design:type", String)
], Tenant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ai_enabled', default: true }),
    __metadata("design:type", Boolean)
], Tenant.prototype, "aiEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ai_confidence_threshold', type: 'float', default: 0.7 }),
    __metadata("design:type", Number)
], Tenant.prototype, "aiConfidenceThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'brandName', length: 100, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "brandName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'primaryColor', length: 7, default: '#000000' }),
    __metadata("design:type", String)
], Tenant.prototype, "primaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'logoUrl', nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'custom_domain', nullable: true, unique: true }),
    __metadata("design:type", String)
], Tenant.prototype, "customDomain", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: 'created',
        name: 'onboarding_status'
    }),
    __metadata("design:type", String)
], Tenant.prototype, "onboardingStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'onboarded_by', nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "onboardedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Tenant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Tenant.prototype, "updatedAt", void 0);
exports.Tenant = Tenant = __decorate([
    (0, typeorm_1.Entity)('tenants')
], Tenant);
//# sourceMappingURL=tenant.entity.js.map
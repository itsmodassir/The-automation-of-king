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
exports.BillingLimit = void 0;
const typeorm_1 = require("typeorm");
const tenant_entity_1 = require("../tenants/tenant.entity");
let BillingLimit = class BillingLimit {
};
exports.BillingLimit = BillingLimit;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], BillingLimit.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], BillingLimit.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_messages' }),
    __metadata("design:type", Number)
], BillingLimit.prototype, "maxMessages", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_ai_credits' }),
    __metadata("design:type", Number)
], BillingLimit.prototype, "maxAiCredits", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BillingLimit.prototype, "updatedAt", void 0);
exports.BillingLimit = BillingLimit = __decorate([
    (0, typeorm_1.Entity)('billing_limits')
], BillingLimit);
//# sourceMappingURL=billing-limit.entity.js.map
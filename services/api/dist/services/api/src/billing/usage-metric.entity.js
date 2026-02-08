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
exports.UsageMetric = void 0;
const typeorm_1 = require("typeorm");
let UsageMetric = class UsageMetric {
};
exports.UsageMetric = UsageMetric;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UsageMetric.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'tenant_id' }),
    __metadata("design:type", String)
], UsageMetric.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'metric_type' }),
    __metadata("design:type", String)
], UsageMetric.prototype, "metricType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UsageMetric.prototype, "count", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'date' }),
    __metadata("design:type", Date)
], UsageMetric.prototype, "createdAt", void 0);
exports.UsageMetric = UsageMetric = __decorate([
    (0, typeorm_1.Entity)('usage_metrics')
], UsageMetric);
//# sourceMappingURL=usage-metric.entity.js.map
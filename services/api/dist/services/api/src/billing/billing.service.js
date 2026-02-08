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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const billing_limit_entity_1 = require("./billing-limit.entity");
const usage_metric_entity_1 = require("./usage-metric.entity");
let BillingService = class BillingService {
    constructor(limitsRepo, usageRepo) {
        this.limitsRepo = limitsRepo;
        this.usageRepo = usageRepo;
    }
    async assertMessageQuota(tenantId) {
        const limit = await this.limitsRepo.findOne({ where: { tenantId } });
        if (!limit)
            return;
        const today = new Date().toISOString().slice(0, 10);
        const used = await this.usageRepo.sum('count', {
            tenantId,
            metricType: 'message_sent',
            createdAt: today,
        });
        if ((used || 0) >= limit.maxMessages) {
            throw new common_1.ForbiddenException('Message quota exceeded. Upgrade plan.');
        }
    }
    async assertAiQuota(tenantId) {
        const limit = await this.limitsRepo.findOne({ where: { tenantId } });
        if (!limit)
            return;
        const today = new Date().toISOString().slice(0, 10);
        const used = await this.usageRepo.sum('count', {
            tenantId,
            metricType: 'ai_credit',
            createdAt: today,
        });
        if ((used || 0) >= limit.maxAiCredits) {
            throw new common_1.ForbiddenException('AI credit limit exceeded.');
        }
    }
    async recordUsage(tenantId, metricType, count = 1) {
        await this.usageRepo.save({
            tenantId,
            metricType,
            count,
            createdAt: new Date(),
        });
    }
    async checkWarning(tenantId) {
        const limit = await this.limitsRepo.findOne({ where: { tenantId } });
        if (!limit)
            return null;
        const today = new Date().toISOString().slice(0, 10);
        const used = await this.usageRepo.sum('count', {
            tenantId,
            metricType: 'message_sent',
            createdAt: today,
        });
        if ((used || 0) / limit.maxMessages >= 0.8) {
            return 'You have used 80% of your message quota.';
        }
        return null;
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(billing_limit_entity_1.BillingLimit)),
    __param(1, (0, typeorm_1.InjectRepository)(usage_metric_entity_1.UsageMetric)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BillingService);
//# sourceMappingURL=billing.service.js.map
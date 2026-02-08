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
exports.DebugController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const tenant_service_1 = require("../tenants/tenant.service");
const bcrypt = require("bcrypt");
let DebugController = class DebugController {
    constructor(userRepo, tenantService) {
        this.userRepo = userRepo;
        this.tenantService = tenantService;
    }
    async testRegistration(dto) {
        const steps = [];
        try {
            steps.push({ step: 'Starting', data: dto });
            steps.push({ step: 'Creating tenant...' });
            const tenant = await this.tenantService.create(dto.name, dto.email, dto.domain);
            steps.push({ step: 'Tenant created', tenant: { id: tenant.id, name: tenant.name, domain: tenant.domain } });
            steps.push({ step: 'Hashing password...' });
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(dto.password, salt);
            steps.push({ step: 'Password hashed' });
            steps.push({ step: 'Creating user entity...' });
            const user = this.userRepo.create({
                email: dto.email,
                password: hash,
                tenantId: tenant.id,
                role: 'admin',
            });
            steps.push({ step: 'User entity created', user: { email: user.email, tenantId: user.tenantId, role: user.role } });
            steps.push({ step: 'Saving user...' });
            const savedUser = await this.userRepo.save(user);
            steps.push({ step: 'User saved', userId: savedUser.id });
            return {
                success: true,
                steps,
                result: { userId: savedUser.id, tenantId: tenant.id }
            };
        }
        catch (error) {
            return {
                success: false,
                steps,
                error: {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                    code: error.code,
                    detail: error.detail,
                    constraint: error.constraint,
                    table: error.table,
                    column: error.column,
                    fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
                }
            };
        }
    }
};
exports.DebugController = DebugController;
__decorate([
    (0, common_1.Post)('test-registration'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "testRegistration", null);
exports.DebugController = DebugController = __decorate([
    (0, common_1.Controller)('debug'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        tenant_service_1.TenantService])
], DebugController);
//# sourceMappingURL=debug.controller.js.map
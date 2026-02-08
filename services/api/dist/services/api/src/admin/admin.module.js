"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./admin.controller");
const admin_auth_controller_1 = require("./admin-auth.controller");
const admin_service_1 = require("./admin.service");
const admin_auth_service_1 = require("./admin-auth.service");
const tenant_entity_1 = require("../tenants/tenant.entity");
const user_entity_1 = require("../users/user.entity");
const billing_limit_entity_1 = require("../billing/billing-limit.entity");
const usage_metric_entity_1 = require("../billing/usage-metric.entity");
const meta_token_entity_1 = require("../meta/entities/meta-token.entity");
const whatsapp_account_entity_1 = require("../whatsapp/whatsapp-account.entity");
const audit_log_entity_1 = require("./entities/audit-log.entity");
const admin_user_entity_1 = require("./entities/admin-user.entity");
const admin_tenant_assignment_entity_1 = require("./entities/admin-tenant-assignment.entity");
const auth_module_1 = require("../auth/auth.module");
const admins_controller_1 = require("./admins.controller");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            typeorm_1.TypeOrmModule.forFeature([
                tenant_entity_1.Tenant,
                user_entity_1.User,
                billing_limit_entity_1.BillingLimit,
                usage_metric_entity_1.UsageMetric,
                meta_token_entity_1.MetaToken,
                whatsapp_account_entity_1.WhatsAppAccount,
                audit_log_entity_1.AuditLog,
                admin_user_entity_1.AdminUser,
                admin_tenant_assignment_entity_1.AdminTenantAssignment,
            ]),
        ],
        controllers: [admin_controller_1.AdminController, admin_auth_controller_1.AdminAuthController, admins_controller_1.AdminsController],
        providers: [admin_service_1.AdminService, admin_auth_service_1.AdminAuthService],
        exports: [admin_service_1.AdminService, admin_auth_service_1.AdminAuthService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map
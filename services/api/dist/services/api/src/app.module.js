"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const tenant_module_1 = require("./tenants/tenant.module");
const meta_module_1 = require("./meta/meta.module");
const whatsapp_module_1 = require("./whatsapp/whatsapp.module");
const messages_module_1 = require("./messages/messages.module");
const billing_module_1 = require("./billing/billing.module");
const analytics_module_1 = require("./analytics/analytics.module");
const contacts_module_1 = require("./contacts/contacts.module");
const automation_module_1 = require("./automation/automation.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const admin_module_1 = require("./admin/admin.module");
const redis_module_1 = require("./common/redis/redis.module");
const bull_1 = require("@nestjs/bull");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const debug_module_1 = require("./debug/debug.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                autoLoadEntities: true,
                synchronize: false,
            }),
            bull_1.BullModule.forRoot({
                redis: process.env.REDIS_URL || 'redis://localhost:6379',
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            tenant_module_1.TenantsModule,
            meta_module_1.MetaModule,
            whatsapp_module_1.WhatsappModule,
            messages_module_1.MessagesModule,
            billing_module_1.BillingModule,
            analytics_module_1.AnalyticsModule,
            contacts_module_1.ContactsModule,
            automation_module_1.AutomationModule,
            webhooks_module_1.WebhooksModule,
            admin_module_1.AdminModule,
            redis_module_1.GlobalRedisModule,
            audit_logs_module_1.AuditLogsModule,
            debug_module_1.DebugModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
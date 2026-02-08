import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminAuthController } from './admin-auth.controller';
import { AdminService } from './admin.service';
import { AdminAuthService } from './admin-auth.service';
import { Tenant } from '../tenants/tenant.entity';
import { User } from '../users/user.entity';
import { BillingLimit } from '../billing/billing-limit.entity';
import { UsageMetric } from '../billing/usage-metric.entity';
import { MetaToken } from '../meta/entities/meta-token.entity';
import { WhatsAppAccount } from '../whatsapp/whatsapp-account.entity';
import { AuditLog } from './entities/audit-log.entity';
import { AdminUser } from './entities/admin-user.entity';
import { AdminTenantAssignment } from './entities/admin-tenant-assignment.entity';
import { AuthModule } from '../auth/auth.module';

import { AdminsController } from './admins.controller';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([
            Tenant,
            User,
            BillingLimit,
            UsageMetric,
            MetaToken,
            WhatsAppAccount,
            AuditLog,
            AdminUser,
            AdminTenantAssignment,
        ]),
    ],
    controllers: [AdminController, AdminAuthController, AdminsController],
    providers: [AdminService, AdminAuthService],
    exports: [AdminService, AdminAuthService],
})
export class AdminModule { }

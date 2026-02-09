import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenant.module';
import { MetaModule } from './meta/meta.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { MessagesModule } from './messages/messages.module';
import { BillingModule } from './billing/billing.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ContactsModule } from './contacts/contacts.module';
import { AutomationModule } from './automation/automation.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { AdminModule } from './admin/admin.module';
import { AdminAuthModule } from './admin/auth/admin-auth.module';
import { GlobalRedisModule } from './common/redis/redis.module';
import { HealthModule } from './common/health/health.module';
import { BullModule } from '@nestjs/bull';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { DebugModule } from './debug/debug.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: process.env.DB_SYNC === 'true' && process.env.NODE_ENV !== 'production',
            migrationsRun: true,
            migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
            logging: process.env.NODE_ENV === 'development',
            logger: 'advanced-console',
        }),
        BullModule.forRoot({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
        }),
        HealthModule,
        AuthModule,
        UsersModule,
        TenantsModule,
        MetaModule,
        WhatsappModule,
        MessagesModule,
        BillingModule,
        AnalyticsModule,
        ContactsModule,
        AutomationModule,
        WebhooksModule,
        AdminAuthModule,
        AdminModule,
        GlobalRedisModule,
        AuditLogsModule,
        ...(process.env.NODE_ENV !== 'production' ? [DebugModule] : []),
    ],
})
export class AppModule { }

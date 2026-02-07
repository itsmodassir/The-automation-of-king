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
import { GlobalRedisModule } from './common/redis/redis.module';
import { BullModule } from '@nestjs/bull';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: false, // Production-ready
        }),
        BullModule.forRoot({
            redis: process.env.REDIS_URL || 'redis://localhost:6379',
        }),
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
        AdminModule,
        GlobalRedisModule,
        AuditLogsModule,
    ],
})
export class AppModule { }

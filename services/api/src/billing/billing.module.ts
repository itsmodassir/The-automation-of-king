import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingService } from './billing.service';
import { BillingLimit } from './billing-limit.entity';
import { UsageMetric } from './usage-metric.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BillingLimit, UsageMetric])],
    providers: [BillingService],
    exports: [BillingService],
})
export class BillingModule { }

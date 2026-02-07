import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationController } from './automation.controller';
import { AutomationService } from './automation.service';
import { Tenant } from '../tenants/tenant.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Tenant])],
    controllers: [AutomationController],
    providers: [AutomationService],
    exports: [AutomationService],
})
export class AutomationModule { }

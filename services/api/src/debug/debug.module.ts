import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebugController } from './debug.controller';
import { User } from '../users/user.entity';
import { TenantsModule } from '../tenants/tenant.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        TenantsModule,
    ],
    controllers: [DebugController],
})
export class DebugModule { }

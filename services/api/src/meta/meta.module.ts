import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';
import { MetaToken } from './entities/meta-token.entity';

import { WhatsAppAccount } from '../whatsapp/whatsapp-account.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MetaToken, WhatsAppAccount])],
    controllers: [MetaController],
    providers: [MetaService],
    exports: [MetaService],
})
export class MetaModule { }

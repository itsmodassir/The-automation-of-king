import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';
import { MetaToken } from './entities/meta-token.entity';

import { WhatsappAccount } from '../whatsapp/whatsapp-account.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MetaToken, WhatsappAccount])],
    controllers: [MetaController],
    providers: [MetaService],
    exports: [MetaService],
})
export class MetaModule { }

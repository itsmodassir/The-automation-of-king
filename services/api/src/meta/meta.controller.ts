import { Controller, Get, Query } from '@nestjs/common';
import { MetaService } from './meta.service';

@Controller('meta')
export class MetaController {
    constructor(private metaService: MetaService) { }

    @Get('callback')
    handle(@Query('code') code: string, @Query('state') state: string) {
        return this.metaService.handleOAuthCallback(code, state);
    }
}

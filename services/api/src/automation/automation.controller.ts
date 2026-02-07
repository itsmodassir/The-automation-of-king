import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AutomationService } from './automation.service';

@Controller('automation')
@UseGuards(JwtAuthGuard)
export class AutomationController {
    constructor(private service: AutomationService) { }

    @Get('settings')
    getSettings(@Req() req: any) {
        return this.service.getSettings(req.user.tenantId);
    }

    @Post('settings')
    updateSettings(@Body() dto: any, @Req() req: any) {
        return this.service.updateSettings(req.user.tenantId, dto);
    }
}

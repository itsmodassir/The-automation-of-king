import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
    constructor(private analytics: AnalyticsService) { }

    @Get('overview')
    getOverview(@Req() req: any) {
        return this.analytics.getTenantOverview(req.user.tenantId);
    }
}

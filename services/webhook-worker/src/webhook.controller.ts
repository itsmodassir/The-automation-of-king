import { Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { WebhookService } from './webhook.service';
import { MetaSignatureGuard } from './signature.guard';

@Controller()
export class WebhookController {
    constructor(private readonly service: WebhookService) { }

    // Health check endpoint
    @Get('health')
    health() {
        return {
            status: 'ok',
            service: 'webhook-worker',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }

    @Get('webhooks/meta')
    verify(
        @Query('hub.mode') mode: string,
        @Query('hub.verify_token') token: string,
        @Query('hub.challenge') challenge: string,
        @Res() res: Response,
    ) {
        if (
            mode === 'subscribe' &&
            token === process.env.META_VERIFY_TOKEN
        ) {
            return res.status(200).send(challenge);
        }
        return res.status(403).send('Forbidden');
    }

    @Post('webhooks/meta')
    @UseGuards(MetaSignatureGuard)
    async receive(@Req() req: any) {
        await this.service.process(req.body);
        return { success: true };
    }
}

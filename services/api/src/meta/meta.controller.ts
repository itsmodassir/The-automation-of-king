import { Controller, Get, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MetaService } from './meta.service';

@Controller('meta')
export class MetaController {
    constructor(private metaService: MetaService) { }

    @Get('callback')
    async handle(
        @Query('code') code: string,
        @Query('state') state: string,
        @Res() res: Response
    ) {
        try {
            if (!code || !state) {
                throw new HttpException('Missing code or state parameter', HttpStatus.BAD_REQUEST);
            }

            // Process OAuth callback
            await this.metaService.handleOAuthCallback(code, state);

            // Redirect to dashboard with success message
            const frontendUrl = process.env.APP_DOMAIN?.startsWith('http')
                ? process.env.APP_DOMAIN
                : `https://${process.env.APP_DOMAIN || 'localhost:3000'}`;
            res.redirect(`${frontendUrl}/dashboard/whatsapp?success=true`);
        } catch (error) {
            console.error('OAuth callback error:', error);
            const frontendUrl = process.env.APP_DOMAIN?.startsWith('http')
                ? process.env.APP_DOMAIN
                : `https://${process.env.APP_DOMAIN || 'localhost:3000'}`;
            res.redirect(`${frontendUrl}/dashboard/whatsapp?error=${encodeURIComponent(error.message)}`);
        }
    }
}

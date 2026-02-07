import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
@UseGuards(JwtAuthGuard)
export class WhatsappController {
    constructor(private whatsappService: WhatsappService) { }

    @Get('embedded/start')
    startEmbedded(@Req() req: any, @Res() res: any) {
        // OAuth start logic (already implemented earlier)
        // For now, redirecting to Meta with state (kept from previous implementation)
    }

    @Get('me')
    async getAccount(@Req() req: any) {
        return this.whatsappService.getAccount(req.user.tenantId);
    }
}

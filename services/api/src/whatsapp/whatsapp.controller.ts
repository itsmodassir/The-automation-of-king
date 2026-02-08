import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { WhatsappService } from './whatsapp.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('WhatsApp')
@ApiBearerAuth()
@Controller('whatsapp')
@UseGuards(JwtAuthGuard)
export class WhatsappController {
    constructor(private whatsappService: WhatsappService) { }

    @Get('embedded/start')
    @ApiOperation({ summary: 'Start Embedded Signup', description: 'Returns the pre-filled configuration for the Meta Embedded Signup popup.' })
    @ApiResponse({ status: 200, description: 'Configuration object returned.' })
    async startEmbedded(@Req() req: any) {
        return this.whatsappService.startEmbeddedSignup(req.user.tenantId);
    }

    @Get('me')
    @ApiOperation({ summary: 'Get WhatsApp Account Status', description: 'Checks if the tenant has a connected WhatsApp Business Account.' })
    @ApiResponse({ status: 200, description: 'Connection status and account details.' })
    async getAccount(@Req() req: any) {
        const account = await this.whatsappService.getAccount(req.user.tenantId);

        if (!account) {
            return {
                connected: false,
                account: null
            };
        }

        return {
            connected: true,
            account: {
                phoneNumber: account.phoneNumber,
                businessName: account.businessName,
                wabaId: account.wabaId,
                status: account.status
            }
        };
    }
}

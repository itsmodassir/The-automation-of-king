import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { MessageLimitGuard } from '../billing/limits.guard';
import { DispatcherService } from './dispatcher.service';

@Controller('messages')
export class MessagesController {
    constructor(private dispatcher: DispatcherService) { }

    @Post('send')
    @UseGuards(JwtAuthGuard, MessageLimitGuard)
    async send(@Req() req: any, @Body() dto: any) {
        return this.dispatcher.enqueue(dto, req.user.tenantId);
    }
}

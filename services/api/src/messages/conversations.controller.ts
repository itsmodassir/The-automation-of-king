import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../conversations/conversation.entity';
import { Message } from './message.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
    constructor(
        @InjectRepository(Conversation)
        private repo: Repository<Conversation>,
        @InjectRepository(Message)
        private msgRepo: Repository<Message>
    ) { }

    @Get()
    async findAll(@Req() req: any) {
        return this.repo.find({
            where: { tenantId: req.user.tenantId },
            order: { lastMessageAt: 'DESC' },
        });
    }

    @Get(':id/messages')
    async getMessages(@Param('id') id: string, @Req() req: any) {
        return this.msgRepo.find({
            where: {
                conversationId: id,
                tenantId: req.user.tenantId
            },
            order: { createdAt: 'ASC' },
        });
    }
}

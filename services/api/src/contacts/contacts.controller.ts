import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ContactsService } from './contacts.service';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
    constructor(private service: ContactsService) { }

    @Get()
    findAll(@Req() req: any) {
        return this.service.findAll(req.user.tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.service.findOne(id, req.user.tenantId);
    }

    @Post()
    create(@Body() dto: any, @Req() req: any) {
        return this.service.create(dto, req.user.tenantId);
    }
}

import { Controller, Get, Patch, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminService } from './admin.service';
import { AdminRole } from './entities/admin-user.entity';
import { Roles } from './guards/roles.decorator';

@Controller('admin/admins')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminsController {
    constructor(private readonly service: AdminService) { }

    @Get()
    @Roles(AdminRole.SUPER_ADMIN)
    getAdmins() {
        return this.service.getAdmins();
    }

    @Patch(':id/status')
    @Roles(AdminRole.SUPER_ADMIN)
    updateStatus(
        @Param('id') id: string,
        @Body('isActive') isActive: boolean
    ) {
        return this.service.updateAdminStatus(id, isActive);
    }

    @Patch(':id/role')
    @Roles(AdminRole.SUPER_ADMIN)
    updateRole(
        @Param('id') id: string,
        @Body('role') role: AdminRole
    ) {
        return this.service.updateAdminRole(id, role);
    }
}

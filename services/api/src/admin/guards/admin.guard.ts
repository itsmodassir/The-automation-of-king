import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '../entities/admin-user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<AdminRole[]>('roles', context.getHandler());
        const req = context.switchToHttp().getRequest();
        const user = req.user;

        if (!user || !user.role) {
            return false;
        }

        if (user.role === AdminRole.SUPER_ADMIN) {
            return true;
        }

        if (!requiredRoles) {
            return true; // No specific role required, just valid admin
        }

        return requiredRoles.includes(user.role);
    }
}

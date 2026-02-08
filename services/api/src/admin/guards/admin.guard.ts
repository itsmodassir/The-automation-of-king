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

        // Verify user exists, has role, and is active
        if (!user || !user.role || !user.isActive) {
            return false;
        }

        // Super admin always has access
        if (user.role === AdminRole.SUPER_ADMIN) {
            return true;
        }

        // If no specific role required, just being active admin is enough
        if (!requiredRoles) {
            return true;
        }

        // Check if user's role is in required roles
        return requiredRoles.includes(user.role);
    }
}

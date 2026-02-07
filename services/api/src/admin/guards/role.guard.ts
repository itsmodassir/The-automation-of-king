import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly allowedRoles: string[]) { }

    canActivate(ctx: ExecutionContext): boolean {
        const req = ctx.switchToHttp().getRequest();
        const userRole = req.user?.role;

        if (!this.allowedRoles.includes(userRole)) {
            throw new ForbiddenException(`Access denied for role: ${userRole}`);
        }

        return true;
    }
}

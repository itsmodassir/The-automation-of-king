import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
        const req = ctx.switchToHttp().getRequest();
        if (req.user?.role !== 'super_admin') {
            throw new ForbiddenException('Super admin only');
        }
        return true;
    }
}

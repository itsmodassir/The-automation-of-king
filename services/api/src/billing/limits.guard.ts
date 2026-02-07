import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { BillingService } from './billing.service';

@Injectable()
export class MessageLimitGuard implements CanActivate {
    constructor(private billing: BillingService) { }

    async canActivate(ctx: ExecutionContext) {
        const req = ctx.switchToHttp().getRequest();
        const tenantId = req.user.tenantId;

        await this.billing.assertMessageQuota(tenantId);
        return true;
    }
}

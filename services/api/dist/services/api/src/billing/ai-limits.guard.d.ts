import { CanActivate, ExecutionContext } from '@nestjs/common';
import { BillingService } from './billing.service';
export declare class AiLimitGuard implements CanActivate {
    private billing;
    constructor(billing: BillingService);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}

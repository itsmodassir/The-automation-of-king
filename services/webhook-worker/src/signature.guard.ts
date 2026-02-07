import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class MetaSignatureGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
        const req = ctx.switchToHttp().getRequest();
        const signature = req.headers['x-hub-signature-256'] as string;
        if (!signature) return false;

        const expected =
            'sha256=' +
            crypto
                .createHmac('sha256', process.env.META_APP_SECRET!)
                .update(JSON.stringify(req.body))
                .digest('hex');

        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expected),
        );
    }
}

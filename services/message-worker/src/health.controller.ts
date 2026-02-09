import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
    @Get()
    check() {
        return {
            status: 'ok',
            service: 'message-worker',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
}

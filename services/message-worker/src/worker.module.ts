import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SendMessageProcessor } from './send.processor';

import { HealthController } from './health.controller';

@Module({
    imports: [
        BullModule.forRoot({
            url: process.env.REDIS_URL || 'redis://redis:6379',
        }),
        BullModule.registerQueue({
            name: 'send-message',
            defaultJobOptions: {
                attempts: 5,
                backoff: {
                    type: 'exponential',
                    delay: 3000,
                },
                removeOnComplete: true,
                removeOnFail: false,
            },
        }),
    ],
    controllers: [HealthController],
    providers: [SendMessageProcessor],
})
export class AppModule { }

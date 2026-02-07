import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InboxGateway } from './inbox.gateway';

@Injectable()
export class RedisBridgeService implements OnModuleInit {
    private subClient: Redis;

    constructor(private inboxGateway: InboxGateway) {
        this.subClient = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
    }

    onModuleInit() {
        this.subClient.subscribe('events:message-new');
        this.subClient.on('message', (channel, message) => {
            if (channel === 'events:message-new') {
                const data = JSON.parse(message);
                this.inboxGateway.notifyNewMessage(data.tenantId, data.payload);
            }
        });
        console.log('Redis Bridge: Listening for cross-service events...');
    }
}

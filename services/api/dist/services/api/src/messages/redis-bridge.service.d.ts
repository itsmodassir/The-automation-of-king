import { OnModuleInit } from '@nestjs/common';
import { InboxGateway } from './inbox.gateway';
export declare class RedisBridgeService implements OnModuleInit {
    private inboxGateway;
    private subClient;
    constructor(inboxGateway: InboxGateway);
    onModuleInit(): void;
}

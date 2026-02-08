import { DispatcherService } from './dispatcher.service';
export declare class MessagesController {
    private dispatcher;
    constructor(dispatcher: DispatcherService);
    send(req: any, dto: any): Promise<{
        status: string;
        messageId: string;
    }>;
}

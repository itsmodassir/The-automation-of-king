import { Repository } from 'typeorm';
import { Conversation } from '../conversations/conversation.entity';
import { Message } from './message.entity';
export declare class ConversationsController {
    private repo;
    private msgRepo;
    constructor(repo: Repository<Conversation>, msgRepo: Repository<Message>);
    findAll(req: any): Promise<Conversation[]>;
    getMessages(id: string, req: any): Promise<Message[]>;
}

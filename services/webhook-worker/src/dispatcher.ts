import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookEvent } from './entities/webhook-event.entity';

@Injectable()
export class DedupeService {
    constructor(
        @InjectRepository(WebhookEvent)
        private repo: Repository<WebhookEvent>,
    ) { }

    async isDuplicate(eventId: string): Promise<boolean> {
        try {
            await this.repo.insert({ eventId });
            return false;
        } catch {
            return true;
        }
    }
}

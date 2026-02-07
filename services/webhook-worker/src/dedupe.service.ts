import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class DedupeService {
    private redis: Redis;

    constructor() {
        this.redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
    }

    async isDuplicate(id: string): Promise<boolean> {
        const key = `webhook:dedupe:${id}`;
        const exists = await this.redis.set(key, '1', 'EX', 86400, 'NX');
        return exists === null; // If NX failed, it means it already exists
    }
}

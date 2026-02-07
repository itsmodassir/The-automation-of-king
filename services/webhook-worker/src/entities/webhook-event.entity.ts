import { Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('webhook_events')
export class WebhookEvent {
    @PrimaryColumn()
    eventId!: string;

    @CreateDateColumn()
    processedAt!: Date;
}

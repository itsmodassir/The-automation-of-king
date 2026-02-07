import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('webhook_events')
export class WebhookEvent {
    @PrimaryColumn({ length: 100 })
    id: string; // The Meta message ID or unique event ID

    @Column({ nullable: true })
    type: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}

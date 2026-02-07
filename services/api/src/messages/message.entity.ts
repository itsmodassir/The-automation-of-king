import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { Conversation } from '../conversations/conversation.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Conversation)
    @JoinColumn({ name: 'conversation_id' })
    conversation!: Conversation;

    @Index()
    @Column({ name: 'conversation_id' })
    conversationId!: string;

    @ManyToOne(() => Tenant)
    @JoinColumn({ name: 'tenant_id' })
    tenant!: Tenant;

    @Index()
    @Column({ name: 'tenant_id' })
    tenantId!: string;

    @Column({ length: 10 })
    direction!: 'inbound' | 'outbound';

    @Column({ length: 20, nullable: true })
    type!: string;

    @Column({ type: 'text', nullable: true })
    content!: string;

    @Column({ name: 'meta_message_id', length: 100, nullable: true })
    metaMessageId!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}

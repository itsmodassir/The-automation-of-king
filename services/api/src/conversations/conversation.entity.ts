import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { Contact } from '../contacts/contact.entity';

@Entity('conversations')
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Tenant)
    @JoinColumn({ name: 'tenant_id' })
    tenant!: Tenant;

    @Column({ name: 'tenant_id' })
    tenantId!: string;

    @ManyToOne(() => Contact)
    @JoinColumn({ name: 'contact_id' })
    contact!: Contact;

    @Column({ name: 'contact_id' })
    contactId!: string;

    @Column({ default: 'open', length: 20 })
    status!: string;

    @Column({ name: 'last_message_at', type: 'timestamptz', nullable: true })
    lastMessageAt!: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}

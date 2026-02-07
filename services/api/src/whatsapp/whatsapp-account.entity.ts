import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

@Entity('whatsapp_accounts')
export class WhatsappAccount {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Tenant)
    @JoinColumn({ name: 'tenant_id' })
    tenant!: Tenant;

    @Column({ name: 'tenant_id' })
    tenantId!: string;

    @Column({ name: 'waba_id' })
    wabaId!: string;

    @Column({ name: 'phone_number_id', unique: true })
    phoneNumberId!: string;

    @Column({ name: 'display_phone_number', nullable: true })
    displayPhoneNumber!: string;

    @Column({ name: 'access_token_encrypted' })
    accessTokenEncrypted!: string;

    @Column({ name: 'token_expires_at', type: 'timestamptz', nullable: true })
    tokenExpiresAt!: Date;

    @Column({ default: 'connected' })
    status!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}

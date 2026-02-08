import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

@Entity('whatsapp_accounts')
export class WhatsAppAccount {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'tenant_id' })
    tenantId: string;

    @ManyToOne(() => Tenant)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column({ name: 'waba_id', unique: true })
    wabaId: string;

    @Column({ name: 'phone_number_id' })
    phoneNumberId: string;

    @Column({ name: 'phone_number', length: 20 })
    phoneNumber: string;

    @Column({ name: 'display_phone_number', length: 20, nullable: true })
    displayPhoneNumber: string;

    @Column({ name: 'business_name', nullable: true })
    businessName: string;

    @Column({ name: 'access_token', type: 'text' })
    accessToken: string;

    @Column({ name: 'access_token_encrypted', type: 'text', nullable: true })
    accessTokenEncrypted: string;

    @Column({ name: 'token_expires_at', nullable: true })
    tokenExpiresAt: Date;

    @Column({ default: 'active', length: 50 })
    status: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

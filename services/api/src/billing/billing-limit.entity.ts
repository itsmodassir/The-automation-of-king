import { Entity, PrimaryColumn, Column, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

@Entity('billing_limits')
export class BillingLimit {
    @PrimaryColumn('uuid')
    tenantId!: string;

    @OneToOne(() => Tenant)
    @JoinColumn({ name: 'tenant_id' })
    tenant!: Tenant;

    @Column({ name: 'max_messages' })
    maxMessages!: number;

    @Column({ name: 'max_ai_credits' })
    maxAiCredits!: number;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}

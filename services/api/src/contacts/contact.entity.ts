import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

@Entity('contacts')
@Unique(['tenantId', 'phone'])
export class Contact {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Tenant)
    @JoinColumn({ name: 'tenant_id' })
    tenant!: Tenant;

    @Column({ name: 'tenant_id' })
    tenantId!: string;

    @Column({ length: 30 })
    phone!: string;

    @Column({ length: 255, nullable: true })
    name!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'tenant_id' })
    tenantId: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'password_hash', select: false })
    password?: string;

    @Column({ default: 'agent' })
    role: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ name: 'api_access_enabled', default: false })
    apiAccessEnabled: boolean;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'email_verified', default: false })
    emailVerified: boolean;

    @Column({ name: 'last_login_at', nullable: true })
    lastLoginAt: Date;

    @ManyToOne(() => Tenant)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { AdminUser } from './admin-user.entity';
import { Tenant } from '../../tenants/tenant.entity';

@Entity('admin_tenant_assignments')
@Unique(['adminId', 'tenantId'])
export class AdminTenantAssignment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'admin_id' })
    adminId: string;

    @ManyToOne(() => AdminUser, (admin) => admin.assignments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'admin_id' })
    admin: AdminUser;

    @Column({ name: 'tenant_id' })
    tenantId: string;

    @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @CreateDateColumn({ name: 'assigned_at' })
    assignedAt: Date;
}

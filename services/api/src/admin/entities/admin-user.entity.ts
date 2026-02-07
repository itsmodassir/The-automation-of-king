import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AdminTenantAssignment } from './admin-tenant-assignment.entity';

export enum AdminRole {
    SUPER_ADMIN = 'super_admin',
    PLATFORM_ADMIN = 'platform_admin',
    ONBOARDING_ADMIN = 'onboarding_admin',
    SUPPORT_ADMIN = 'support_admin',
}

@Entity('admin_users')
export class AdminUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'password_hash', select: false })
    passwordHash: string;

    @Column({
        type: 'enum',
        enum: AdminRole,
        default: AdminRole.ONBOARDING_ADMIN,
    })
    role: AdminRole;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @OneToMany(() => AdminTenantAssignment, (assignment) => assignment.admin)
    assignments: AdminTenantAssignment[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

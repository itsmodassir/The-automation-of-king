import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    action!: string;

    @Column({ name: 'actor_id', nullable: true })
    actorId!: string;

    @Column({ name: 'tenant_id', nullable: true })
    tenantId!: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata!: any;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}

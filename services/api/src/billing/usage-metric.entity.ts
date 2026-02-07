import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('usage_metrics')
export class UsageMetric {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ name: 'tenant_id' })
    tenantId: string;

    @Column({ name: 'metric_type' })
    metricType: string;

    @Column({ type: 'int', default: 0 })
    count: number;

    @Index()
    @CreateDateColumn({ name: 'created_at', type: 'date' })
    createdAt: Date;
}

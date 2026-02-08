import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    domain!: string;

    @Column({ default: 'active' })
    status!: string;

    @Column({ name: 'ai_enabled', default: true })
    aiEnabled!: boolean;

    @Column({ name: 'ai_confidence_threshold', type: 'float', default: 0.7 })
    aiConfidenceThreshold!: number;

    @Column({ name: 'brandName', length: 100, nullable: true })
    brandName: string;

    @Column({ name: 'primaryColor', length: 7, default: '#000000' })
    primaryColor: string;

    @Column({ name: 'logoUrl', nullable: true })
    logoUrl: string;

    @Column({ name: 'custom_domain', nullable: true, unique: true })
    customDomain: string;

    @Column({
        type: 'varchar',
        default: 'created',
        name: 'onboarding_status'
    })
    onboardingStatus: string;

    @Column({ name: 'onboarded_by', nullable: true })
    onboardedBy: string; // Store Admin ID or Name, typically ID.

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}

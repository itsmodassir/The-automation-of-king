import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('meta_tokens')
export class MetaToken {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'system_user_id' })
    systemUserId!: string;

    @Column({ name: 'token_encrypted' })
    tokenEncrypted!: string;

    @Column('text', { array: true, nullable: true })
    scopes!: string[];

    @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
    expiresAt!: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}

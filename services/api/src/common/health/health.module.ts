import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

/**
 * Health Module
 * 
 * Provides health check endpoints for:
 * - Docker health checks
 * - Kubernetes liveness/readiness probes
 * - Load balancer health monitoring
 * - Application monitoring dashboards
 */
@Module({
    controllers: [HealthController],
    providers: [HealthService],
    exports: [HealthService],
})
export class HealthModule {}

import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

/**
 * Health Check Controller
 *
 * Provides endpoints for monitoring application health:
 * - /health - Full health status with all service checks
 * - /health/live - Liveness probe (is the app running?)
 * - /health/ready - Readiness probe (is the app ready to serve traffic?)
 *
 * Used by:
 * - Docker health checks
 * - Kubernetes probes
 * - Load balancers
 * - Monitoring systems
 */
@Controller('health')
export class HealthController {
    constructor(private healthService: HealthService) {}

    /**
     * Full health check
     * Returns detailed status of all services
     * Used for monitoring dashboards
     */
    @Get()
    async getFullHealth() {
        return await this.healthService.getFullHealth();
    }

    /**
     * Liveness Probe
     * Indicates if the application process is running
     * Return 200 OK if the app is alive
     * Used by orchestrators to restart failed containers
     */
    @Get('live')
    getLiveness() {
        return this.healthService.getLiveness();
    }

    /**
     * Readiness Probe
     * Indicates if the application is ready to accept traffic
     * Checks dependencies (database, Redis, etc.)
     * Return 200 OK only if all dependencies are healthy
     * Used by load balancers to route traffic
     */
    @Get('ready')
    async getReadiness() {
        return await this.healthService.getReadiness();
    }
}

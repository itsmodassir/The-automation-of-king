import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Redis } from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * Health Check Service
 * 
 * Provides health status for the application and its dependencies.
 * Checks database and Redis connectivity.
 */
@Injectable()
export class HealthService {
    constructor(private dataSource: DataSource) {}

    /**
     * Get full health status
     * Includes detailed information about all services
     */
    async getFullHealth() {
        const startTime = Date.now();
        const [dbHealth, redisHealth] = await Promise.all([
            this.checkDatabase(),
            this.checkRedis(),
        ]);

        const duration = Date.now() - startTime;
        const allHealthy = dbHealth.status === 'ok' && redisHealth.status === 'ok';

        return {
            status: allHealthy ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            durationMs: duration,
            checks: {
                database: dbHealth,
                redis: redisHealth,
                memory: this.checkMemory(),
                process: this.checkProcess(),
            },
        };
    }

    /**
     * Liveness probe
     * Simple check that the process is running
     * No dependency checks
     */
    getLiveness() {
        return {
            status: 'alive',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }

    /**
     * Readiness probe
     * Checks if the service is ready to accept traffic
     * Verifies database and Redis connections
     */
    async getReadiness() {
        const [dbHealth, redisHealth] = await Promise.all([
            this.checkDatabase(),
            this.checkRedis(),
        ]);

        const ready = dbHealth.status === 'ok' && redisHealth.status === 'ok';

        if (!ready) {
            throw new ServiceUnavailableException('Service not ready');
        }

        return {
            status: 'ready',
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Check database connectivity
     */
    private async checkDatabase() {
        try {
            const startTime = Date.now();

            // Simple query to verify database is accessible
            await this.dataSource.query('SELECT 1');

            const duration = Date.now() - startTime;
            return {
                status: 'ok',
                message: 'Database connection successful',
                durationMs: duration,
            };
        } catch (error) {
            return {
                status: 'error',
                message: `Database connection failed: ${error.message}`,
                error: error.message,
            };
        }
    }

    /**
     * Check Redis connectivity
     */
    private async checkRedis() {
        try {
            const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
            const redis = new Redis(redisUrl);

            const startTime = Date.now();
            const pong = await redis.ping();
            const duration = Date.now() - startTime;

            await redis.disconnect();

            if (pong === 'PONG') {
                return {
                    status: 'ok',
                    message: 'Redis connection successful',
                    durationMs: duration,
                };
            }
        } catch (error) {
            return {
                status: 'error',
                message: `Redis connection failed: ${error.message}`,
                error: error.message,
            };
        }
    }

    /**
     * Check memory usage
     */
    private checkMemory() {
        const used = process.memoryUsage();
        return {
            rss: Math.round(used.rss / 1024 / 1024) + ' MB',
            heapTotal: Math.round(used.heapTotal / 1024 / 1024) + ' MB',
            heapUsed: Math.round(used.heapUsed / 1024 / 1024) + ' MB',
            external: Math.round(used.external / 1024 / 1024) + ' MB',
        };
    }

    /**
     * Check process information
     */
    private checkProcess() {
        return {
            pid: process.pid,
            nodeVersion: process.version,
            uptime: process.uptime(),
            env: process.env.NODE_ENV || 'unknown',
        };
    }
}

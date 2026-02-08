import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { AppModule } from './app.module';

class RedisIoAdapter extends IoAdapter {
    private adapterConstructor: ReturnType<typeof createAdapter>;

    constructor(appOrHttpServer?: any) {
        super(appOrHttpServer);
    }

    async connectToRedis(): Promise<void> {
        const pubClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
        const subClient = pubClient.duplicate();

        this.adapterConstructor = createAdapter(pubClient, subClient);
    }

    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        return server;
    }
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable Redis adapter for WebSockets scaling
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();
    app.useWebSocketAdapter(redisIoAdapter);

    app.setGlobalPrefix('api');

    // Enable global validation pipe for all incoming requests
    app.useGlobalPipes(new ValidationPipe());

    // � REQUEST LOGGING MIDDLEWARE
    const { v4: uuid } = await import('uuid');
    app.use((req, res, next) => {
        req.id = uuid();
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log({
                timestamp: new Date().toISOString(),
                requestId: req.id,
                method: req.method,
                path: req.path,
                status: res.statusCode,
                durationMs: duration,
            });
        });
        next();
    });

    // 🛡️ SECURITY HARDENING
    app.use(helmet());
    
    // Rate limiting with configurable limits per endpoint
    const createRateLimiter = (windowMs: number, max: number) =>
        rateLimit({ windowMs, max, standardHeaders: true, legacyHeaders: false });

    app.use('/api/auth/login', createRateLimiter(15 * 60 * 1000, 5)); // 5 per 15 min
    app.use('/api/auth/register', createRateLimiter(60 * 60 * 1000, 3)); // 3 per hour
    app.use('/api/admin/auth/init', createRateLimiter(60 * 60 * 1000, 1)); // 1 per hour
    app.use('/api/', createRateLimiter(60 * 1000, 100)); // 100 per minute default

    // CORS configuration from environment
    const corsOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
    ];

    if (process.env.NODE_ENV === 'production') {
        if (process.env.APP_DOMAIN) corsOrigins.push(`https://${process.env.APP_DOMAIN}`, `http://${process.env.APP_DOMAIN}`);
        if (process.env.API_DOMAIN) corsOrigins.push(`https://${process.env.API_DOMAIN}`, `http://${process.env.API_DOMAIN}`);
        if (process.env.ADMIN_DOMAIN) corsOrigins.push(`https://${process.env.ADMIN_DOMAIN}`, `http://${process.env.ADMIN_DOMAIN}`);
    }

    app.enableCors({
        origin: corsOrigins.filter(Boolean),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // 📄 SWAGGER API DOCUMENTATION
    const { DocumentBuilder, SwaggerModule } = await import('@nestjs/swagger');
    const config = new DocumentBuilder()
        .setTitle('Aerostic API')
        .setDescription('The Aerostic SaaS Platform API')
        .setVersion('1.0.0')
        .addBearerAuth()
        .addServer(`http://localhost:${process.env.PORT || 3000}/api`, 'Development')
        .addServer(`https://api.aerostic.com`, 'Production')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = parseInt(process.env.PORT || '3000', 10);
    await app.listen(port, () => {
        console.log(`✅ Server running on port ${port}`);
        console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
        console.log(`🏥 Health Checks:`);
        console.log(`   - Full: http://localhost:${port}/api/health`);
        console.log(`   - Live: http://localhost:${port}/api/health/live`);
        console.log(`   - Ready: http://localhost:${port}/api/health/ready`);
    });
}
bootstrap();

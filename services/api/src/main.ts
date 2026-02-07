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

    // 🛡️ SECURITY HARDENING
    app.use(helmet());
    app.use(rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 100, // limit each IP to 100 requests per windowMs
    }));

    app.enableCors({
        origin: process.env.APP_DOMAIN || '*', // Use environment variable for production domain
        credentials: true,
    });
    await app.listen(3000);
}
bootstrap();

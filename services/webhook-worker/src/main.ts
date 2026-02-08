import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { WebhookModule } from './webhook.module';

async function bootstrap() {
    const app = await NestFactory.create(WebhookModule);

    // Global configuration
    app.use(helmet());
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            process.env.API_DOMAIN || '',
            process.env.API_DOMAIN ? `https://${process.env.API_DOMAIN}` : '',
        ].filter(Boolean) as string[],
        credentials: true,
    });

    // Request logging
    const { v4: uuid } = await import('uuid');
    app.use((req: any, res: any, next: any) => {
        req.id = uuid();
        const start = Date.now();
        res.on('finish', () => {
            console.log({
                timestamp: new Date().toISOString(),
                service: 'webhook-worker',
                requestId: req.id,
                method: req.method,
                path: req.path,
                status: res.statusCode,
                durationMs: Date.now() - start,
            });
        });
        next();
    });

    const port = parseInt(process.env.PORT || '3001', 10);
    await app.listen(port, () => {
        console.log(`✅ Webhook Worker running on port ${port}`);
    });
}

bootstrap().catch((error) => {
    console.error('❌ Webhook Worker startup failed:', error);
    process.exit(1);
});

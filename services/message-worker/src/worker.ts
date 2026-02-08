import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './worker.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('MessageWorker');

async function bootstrap() {
    try {
        const app = await NestFactory.createApplicationContext(AppModule);
        logger.log('✅ Message Worker started successfully');

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            logger.log('SIGTERM signal received: closing Message Worker');
            await app.close();
            process.exit(0);
        });

        process.on('SIGINT', async () => {
            logger.log('SIGINT signal received: closing Message Worker');
            await app.close();
            process.exit(0);
        });
    } catch (error) {
        logger.error('Message Worker startup failed:', error);
        process.exit(1);
    }
}

bootstrap();

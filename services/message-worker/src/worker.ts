import { NestFactory } from '@nestjs/core';
import { AppModule } from './worker.module';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
}
bootstrap();

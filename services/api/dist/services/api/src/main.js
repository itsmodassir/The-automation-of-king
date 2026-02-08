"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const helmet_1 = require("helmet");
const express_rate_limit_1 = require("express-rate-limit");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const ioredis_1 = require("ioredis");
const app_module_1 = require("./app.module");
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    constructor(appOrHttpServer) {
        super(appOrHttpServer);
    }
    async connectToRedis() {
        const pubClient = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
        const subClient = pubClient.duplicate();
        this.adapterConstructor = (0, redis_adapter_1.createAdapter)(pubClient, subClient);
    }
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        return server;
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();
    app.useWebSocketAdapter(redisIoAdapter);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use((0, helmet_1.default)());
    app.use((0, express_rate_limit_1.default)({
        windowMs: 60 * 1000,
        max: 100,
    }));
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            process.env.APP_DOMAIN,
            'http://13.63.63.170',
            'http://admin.13.63.63.170.nip.io',
        ].filter(Boolean),
        credentials: true,
    });
    const { DocumentBuilder, SwaggerModule } = await Promise.resolve().then(() => require('@nestjs/swagger'));
    const config = new DocumentBuilder()
        .setTitle('Aerostic API')
        .setDescription('The Aerostic SaaS Platform API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map
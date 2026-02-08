"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalRedisModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let GlobalRedisModule = class GlobalRedisModule {
};
exports.GlobalRedisModule = GlobalRedisModule;
exports.GlobalRedisModule = GlobalRedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: 'REDIS_CLIENT',
                useFactory: (configService) => {
                    return new ioredis_1.Redis(configService.get('REDIS_URL') || 'redis://redis:6379');
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: ['REDIS_CLIENT'],
    })
], GlobalRedisModule);
//# sourceMappingURL=redis.module.js.map
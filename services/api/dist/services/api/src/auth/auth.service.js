"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../users/user.entity");
const tenant_service_1 = require("../tenants/tenant.service");
let AuthService = class AuthService {
    constructor(jwt, userRepo, tenantService) {
        this.jwt = jwt;
        this.userRepo = userRepo;
        this.tenantService = tenantService;
    }
    async validateUser(email, pass) {
        const user = await this.userRepo.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'role', 'tenantId'],
        });
        if (user && user.password && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        return {
            access_token: this.jwt.sign({
                sub: user.id,
                tenantId: user.tenantId,
                role: user.role,
            }),
        };
    }
    async register(dto) {
        try {
            console.log('Registration started with:', { name: dto.name, email: dto.email, domain: dto.domain });
            console.log('Creating tenant...');
            const tenant = await this.tenantService.create(dto.name, dto.email, dto.domain);
            console.log('Tenant created:', tenant.id);
            console.log('Hashing password...');
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(dto.password, salt);
            console.log('Password hashed');
            console.log('Creating user...');
            const user = this.userRepo.create({
                name: dto.name,
                email: dto.email,
                password: hash,
                tenantId: tenant.id,
                role: 'admin',
            });
            console.log('User entity created, saving...');
            const savedUser = await this.userRepo.save(user);
            console.log('User saved:', savedUser.id);
            console.log('Generating token...');
            return this.login(savedUser);
        }
        catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository,
        tenant_service_1.TenantService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
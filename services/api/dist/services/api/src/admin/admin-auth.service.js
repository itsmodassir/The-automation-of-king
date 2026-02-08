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
exports.AdminAuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const admin_user_entity_1 = require("./entities/admin-user.entity");
const bcrypt = require("bcrypt");
let AdminAuthService = class AdminAuthService {
    constructor(adminRepo, jwtService) {
        this.adminRepo = adminRepo;
        this.jwtService = jwtService;
    }
    async validateAdmin(email, pass) {
        const admin = await this.adminRepo.createQueryBuilder('admin')
            .addSelect('admin.passwordHash')
            .where('admin.email = :email', { email })
            .getOne();
        if (admin && await bcrypt.compare(pass, admin.passwordHash)) {
            const { passwordHash, ...result } = admin;
            return result;
        }
        return null;
    }
    async login(admin) {
        const payload = { email: admin.email, sub: admin.id, role: admin.role, type: 'admin', id: admin.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(email, pass, role) {
        const hash = await bcrypt.hash(pass, 10);
        const admin = this.adminRepo.create({
            email,
            passwordHash: hash,
            role: role,
        });
        return this.adminRepo.save(admin);
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_user_entity_1.AdminUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AdminAuthService);
//# sourceMappingURL=admin-auth.service.js.map
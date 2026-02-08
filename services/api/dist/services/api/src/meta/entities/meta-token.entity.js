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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaToken = void 0;
const typeorm_1 = require("typeorm");
let MetaToken = class MetaToken {
};
exports.MetaToken = MetaToken;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MetaToken.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'system_user_id' }),
    __metadata("design:type", String)
], MetaToken.prototype, "systemUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'token_encrypted' }),
    __metadata("design:type", String)
], MetaToken.prototype, "tokenEncrypted", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, nullable: true }),
    __metadata("design:type", Array)
], MetaToken.prototype, "scopes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], MetaToken.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], MetaToken.prototype, "createdAt", void 0);
exports.MetaToken = MetaToken = __decorate([
    (0, typeorm_1.Entity)('meta_tokens')
], MetaToken);
//# sourceMappingURL=meta-token.entity.js.map
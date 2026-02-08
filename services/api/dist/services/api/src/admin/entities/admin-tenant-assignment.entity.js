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
exports.AdminTenantAssignment = void 0;
const typeorm_1 = require("typeorm");
const admin_user_entity_1 = require("./admin-user.entity");
const tenant_entity_1 = require("../../tenants/tenant.entity");
let AdminTenantAssignment = class AdminTenantAssignment {
};
exports.AdminTenantAssignment = AdminTenantAssignment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AdminTenantAssignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'admin_id' }),
    __metadata("design:type", String)
], AdminTenantAssignment.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => admin_user_entity_1.AdminUser, (admin) => admin.assignments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'admin_id' }),
    __metadata("design:type", admin_user_entity_1.AdminUser)
], AdminTenantAssignment.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_id' }),
    __metadata("design:type", String)
], AdminTenantAssignment.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], AdminTenantAssignment.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'assigned_at' }),
    __metadata("design:type", Date)
], AdminTenantAssignment.prototype, "assignedAt", void 0);
exports.AdminTenantAssignment = AdminTenantAssignment = __decorate([
    (0, typeorm_1.Entity)('admin_tenant_assignments'),
    (0, typeorm_1.Unique)(['adminId', 'tenantId'])
], AdminTenantAssignment);
//# sourceMappingURL=admin-tenant-assignment.entity.js.map
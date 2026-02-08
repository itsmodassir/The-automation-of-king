import { AdminTenantAssignment } from './admin-tenant-assignment.entity';
export declare enum AdminRole {
    SUPER_ADMIN = "super_admin",
    PLATFORM_ADMIN = "platform_admin",
    ONBOARDING_ADMIN = "onboarding_admin",
    SUPPORT_ADMIN = "support_admin"
}
export declare class AdminUser {
    id: string;
    email: string;
    passwordHash: string;
    role: AdminRole;
    isActive: boolean;
    assignments: AdminTenantAssignment[];
    createdAt: Date;
    updatedAt: Date;
}

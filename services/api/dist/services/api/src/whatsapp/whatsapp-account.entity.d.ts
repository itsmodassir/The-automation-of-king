import { Tenant } from '../tenants/tenant.entity';
export declare class WhatsAppAccount {
    id: string;
    tenantId: string;
    tenant: Tenant;
    wabaId: string;
    phoneNumberId: string;
    phoneNumber: string;
    displayPhoneNumber: string;
    businessName: string;
    accessToken: string;
    accessTokenEncrypted: string;
    tokenExpiresAt: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantService {
    constructor(
        @InjectRepository(Tenant)
        private tenantRepo: Repository<Tenant>,
    ) { }

    async getBranding(tenantId: string) {
        const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
        return {
            brandName: tenant?.brandName || 'AEROSTIC',
            primaryColor: tenant?.primaryColor || '#000000',
            logoUrl: tenant?.logoUrl,
        };
    }

    async getBrandingByDomain(domain: string) {
        const tenant = await this.tenantRepo.findOne({ where: { customDomain: domain } });
        if (!tenant) return this.getBranding('null'); // default
        return this.getBranding(tenant.id);
    }

    async setStatus(tenantId: string, status: 'active' | 'suspended') {
        return this.tenantRepo.update(tenantId, { status });
    }

    async updateBranding(tenantId: string, branding: any) {
        return this.tenantRepo.update(tenantId, branding);
    }

    async create(name: string, email: string, domain?: string) {
        // Use provided domain or generate from name
        const tenantDomain = domain || `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.floor(Math.random() * 10000)}`;

        const tenant = this.tenantRepo.create({
            name,
            domain: tenantDomain,
            status: 'active',
        });
        return this.tenantRepo.save(tenant);
    }
}

import { SetMetadata } from '@nestjs/common';
import { AdminRole } from '../entities/admin-user.entity';

export const Roles = (...roles: AdminRole[]) => SetMetadata('roles', roles);

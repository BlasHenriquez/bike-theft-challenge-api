import { SetMetadata } from '@nestjs/common';
import { Role } from './../../utils/enum/role.enum';

export const ROLE_KEY = 'role';

export const Roles = (...roles: Role[]) => SetMetadata(ROLE_KEY, roles);

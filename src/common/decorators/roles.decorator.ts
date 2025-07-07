import { SetMetadata } from '@nestjs/common';
export const ROLE_KEY = 'role';
export const AdminOnly = () => SetMetadata(ROLE_KEY, 'admin');
export const ManagerOnly = () => SetMetadata(ROLE_KEY, 'manager');

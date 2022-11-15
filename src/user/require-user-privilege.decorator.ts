import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserPrivilegeGuard } from './user-privilege.guard';

export function RequirePrivilege(...roles: string[]) {
    return applyDecorators(
        SetMetadata(UserPrivilegeGuard.REQUIRED_PRIVILEGE_CONTEXT_VARIABLE, roles.filter(Boolean)),
        UseGuards(UserPrivilegeGuard),
    );
}
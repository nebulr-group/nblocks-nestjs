import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { TenantPlanGuard } from './tenant-role.guard';

export function RequirePlan(...plans: string[]) {
  return applyDecorators(
    SetMetadata(
      TenantPlanGuard.REQUIRED_PLANS_CONTEXT_VARIABLE,
      plans.filter(Boolean),
    ),
    UseGuards(TenantPlanGuard),
  );
}

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NebulrAuthService } from '../nebulr-auth/nebulr-auth.service';
import { ErrorMessage } from '../utils/error-message';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TenantPlanGuard implements CanActivate {

    static REQUIRED_PLANS_CONTEXT_VARIABLE = "requiredPlans";

    constructor(
        private readonly authService: NebulrAuthService,
        private readonly reflector: Reflector) {
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const authContext = this.authService.getCurrentAuthContext();
        const plans = this.reflector.get<string[]>(TenantPlanGuard.REQUIRED_PLANS_CONTEXT_VARIABLE, context.getHandler());
        console.log("TenantPlanGuard", authContext, plans);
        if (!plans) {
            return true;
        }

        if (plans.includes(authContext.tenantPlan))
            return true;
        else
            throw new ForbiddenException(ErrorMessage.FEATURE_FORBIDDEN_EXCEPTION.message, ErrorMessage.FEATURE_FORBIDDEN_EXCEPTION.nblocksCode);
    }
}

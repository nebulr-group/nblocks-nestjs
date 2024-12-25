import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ErrorMessage } from '../utils/error-message';
import { Reflector } from '@nestjs/core';
import { AuthGuardService } from '../nebulr-auth/auth-guard.service';

@Injectable()
export class UserPrivilegeGuard implements CanActivate {
  static REQUIRED_PRIVILEGE_CONTEXT_VARIABLE = 'requiredPrivileges';

  constructor(
    private readonly authGuardService: AuthGuardService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    throw new NotImplementedException(
      'This feature is not yet available. Stay tuned! :)',
    );
    // const user = this.authGuardService.isAuthorized()
    // const roles = this.reflector.get<string[]>(UserPrivilegeGuard.REQUIRED_PRIVILEGE_CONTEXT_VARIABLE, context.getHandler());
    // console.log("UserRoleGuard", user, roles);
    // if (!roles) {
    //     return true;
    // }

    // if (roles.includes(user.tenant.plan))
    //     return true;
    // else
    throw new ForbiddenException(
      ErrorMessage.FEATURE_FORBIDDEN_EXCEPTION.message,
      ErrorMessage.FEATURE_FORBIDDEN_EXCEPTION.nblocksCode,
    );
  }
}

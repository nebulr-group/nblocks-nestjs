import { Inject, Injectable, Scope } from '@nestjs/common';
import { AuthGuardService } from './auth-guard.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Debugger } from '../nebulr/debugger';
import { AuthGuard, NebulrRequestData } from './auth-guard';
import { AuthContextDto } from './dto/auth-context.dto';

/**
 * This service is "request scoped". That means this provider and all providers injecting this provider will be reinstantiated and kept private for every individual request
 */
@Injectable({ scope: Scope.REQUEST })
export class NebulrAuthService {
  private logger: Debugger;
  private static timeWarningMs = 5000;
  constructor(
    @Inject(REQUEST) private request: Request
  ) {
    this.logger = new Debugger("NebulrAuthService");
    this.logger.log("constructor");
  }

  /**
   * Gets the current AuthContext from the current request. Request and Thread safe
   * @returns 
   */
  getCurrentAuthContext(): AuthContextDto {
    const data = this.getRequest();
    const requestExecution = new Date().getTime() - data.timestamp.getTime();
    if (requestExecution > NebulrAuthService.timeWarningMs)
      console.error(`WARNING: The request used to resolve this authentication data is ${requestExecution} ms old! Either you're debugging the code, the execution is extremely slow or something dangerous is happening like shared data between requests!`);

    const authContext: AuthContextDto = data.auth.authContext;
    if (!authContext)
      throw new Error("Auth Context is Undefined. Either no auth guard has resolved the auth context yet or it has been reset prior to this call.");

    this.logger.log("getCurrentAuthContext", authContext);

    return authContext;
  }

  getRequest(): NebulrRequestData {
    return AuthGuard.getAuthDataFromRequest(this.request);
  }

  /**
   * Tenant ID does not always need to be set for anoymous users but if set this function should guarantee a return
   * Uses NebulrAuthService.getCurrentUser()
   */
  getCurrentTenantId(): string {
    const authContext = this.getCurrentAuthContext();
    if (authContext.userRole == AuthGuardService.ANONYMOUS) {
      if (authContext.tenantId != null) {
        return authContext.tenantId;
      } else {
        throw new Error('x-tenant-id id not set for ANONYMOUS user');
      }
    } else {
      return authContext.tenantId;
    }
  }

  static isAnonymousUser(authContext: AuthContextDto): boolean {
    return authContext.userRole === AuthGuardService.ANONYMOUS;
  }

}

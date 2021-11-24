import { Inject, Injectable, Scope } from '@nestjs/common';
import { AuthGuardService } from './auth-guard.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { IncomingMessage } from 'http';
import { Debugger } from '../nebulr/debugger';
import { NebulrRequestData } from './auth-guard';
import { AuthTenantUserResponseDto } from '@nebulr-group/nblocks-ts-client';

@Injectable({ scope: Scope.REQUEST })
export class NebulrAuthService {
  private logger: Debugger;
  private static timeWarningMs = 5000;
  constructor(
    @Inject(REQUEST) private request: Request
  ) {
    this.logger = new Debugger("NebulrAuthService", true);
    this.logger.log("constructor");
  }

  /**
   * Gets the current authorized AuthUser from the current request. Request and Thread safe
   * @returns 
   */
  getCurrentUser(): AuthTenantUserResponseDto {
    const req: any = this.request instanceof IncomingMessage ? this.request : this.request['req'];
    const data: NebulrRequestData = req.nebulr;

    const requestExecution = new Date().getTime() - data.timestamp.getTime();
    if (requestExecution > NebulrAuthService.timeWarningMs)
      console.error(`WARNING: The request used to resolve this authentication data is ${requestExecution} ms old! Either you're debugging the code, the execution is extremely slow or something dangerous is happening like shared data between requests!`);

    const user: AuthTenantUserResponseDto = data.auth.user;
    if (!user)
      throw new Error("User is Undefined. Either no auth guard has resolved the user yet or it has been reset prior to this call.");

    this.logger.log("getUser", user);
    return user;
  }

  /**
   * Tenant ID does not always need to be set for anoymous users but if set this function should guarantee a return
   * Uses NebulrAuthService.getCurrentUser()
   */
  getCurrentTenantId(): string {
    const user = this.getCurrentUser();
    if (user.role == AuthGuardService.ANONYMOUS) {
      if (user.tenant.id != null) {
        return user.tenant.id;
      } else {
        throw new Error('x-tenant-id id not set for ANONYMOUS user');
      }
    } else {
      return user.tenant.id;
    }
  }

}

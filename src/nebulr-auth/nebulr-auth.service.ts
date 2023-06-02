import { Inject, Injectable, Scope } from '@nestjs/common';
import { AuthGuardService } from './auth-guard.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Debugger } from '../nebulr/debugger';
import { AuthGuard } from './auth-guard';
import { NebulrRequestData } from './dto/request-data';
import { AuthContext, AuthTenantUserResponseDto } from '@nebulr-group/nblocks-ts-client';
import { ClientService } from '../shared/client/client.service';

/**
 * This service is "request scoped". That means this provider and all providers injecting this provider will be reinstantiated and kept private for every individual request
 */
@Injectable({ scope: Scope.REQUEST })
export class NebulrAuthService {
  private logger: Debugger;
  private static timeWarningMs = 5000;
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly clientService: ClientService,
  ) {
    this.logger = new Debugger("NebulrAuthService");
    this.logger.log("constructor");
  }


  /**
   * @deprecated Apps should build their current user experience around the OpenId token or getCurrentAuthContext(). This metehod is not efficient
   * @param authToken 
   * @param tenantUserId 
   * @returns 
   */
  async getCurrentUser(): Promise<AuthTenantUserResponseDto> {
    const authContext = this.getCurrentAuthContext();
    const { id, role, email, username, fullName, onboarded, consentsToPrivacyPolicy, tenant } = await this.clientService.getInterceptedClient(this.getRequest(), this.getOriginalRequest()).tenant(authContext.tenantId).user(authContext.userId).get()
    return {
      id,
      role,
      email,
      username,
      fullName,
      onboarded,
      consentsToPrivacyPolicy,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        plan: tenant.plan,
        locale: tenant.locale,
        logo: tenant.logo,
        onboarded: tenant.onboarded
      }
    }
  }

  /**
   * Gets the current AuthContext from the current request. Request and Thread safe
   * @returns 
   */
  getCurrentAuthContext(): AuthContext {
    const data = this.getRequest();
    const requestExecution = new Date().getTime() - data.timestamp.getTime();
    if (requestExecution > NebulrAuthService.timeWarningMs)
      console.error(`WARNING: The request used to resolve this authentication data is ${requestExecution} ms old! Either you're debugging the code, the execution is extremely slow or something dangerous is happening like shared data between requests!`);

    const authContext: AuthContext = data.auth.authContext;
    if (!authContext)
      throw new Error("Auth Context is Undefined. Either no auth guard has resolved the auth context yet or it has been reset prior to this call.");

    this.logger.log("getCurrentAuthContext", authContext);

    return authContext;
  }

  /**
   * Gets auth contexts from current request
   * @returns 
   */
  getRequest(): NebulrRequestData {
    return AuthGuard.getAuthDataFromRequest(this.request);
  }

  getOriginalRequest(): Request {
    return this.request;
  }

  /**
   * Tenant ID does not always need to be set for anoymous users but if set this function should guarantee a return
   * Uses NebulrAuthService.getCurrentUser()
   */
  getCurrentTenantId(): string {
    const authContext = this.getCurrentAuthContext();
    if (NebulrAuthService.isAnonymousUser(authContext)) {
      if (authContext.tenantId != null) {
        return authContext.tenantId;
      } else {
        throw new Error('x-tenant-id id not set for ANONYMOUS user');
      }
    } else {
      return authContext.tenantId;
    }
  }

  static isAnonymousUser(authContext: AuthContext): boolean {
    return authContext.userRole === AuthGuardService.ANONYMOUS;
  }

}

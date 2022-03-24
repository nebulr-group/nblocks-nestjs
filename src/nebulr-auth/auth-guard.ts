import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuardService } from './auth-guard.service';
import { Debugger } from '../nebulr/debugger';
import { AuthTenantUserResponseDto } from '@nebulr-group/nblocks-ts-client';

/**
 * The Nebulr AuthGuard will resolve the current provided credentials (via Platform API) into an AuthUser instance and make it available on the request object for other providers
 * The NebulrAuthService (Request scoped) will parse the Request and provide an interface for getting the AuthUser or any other auth releated data from the request.
 * For rare cases, the RequestAwareNebulrAuthHelper also gets loaded with the same auth related data. See RequestAwareNebulrAuthHelper.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private debugger: Debugger;
  constructor(private authGuardService: AuthGuardService) {
    this.debugger = new Debugger("AuthGuard", true);
    this.debugger.log("constructor");
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // These are the Whitelisted auth paths
    const authPaths = [
      '/auth-proxy/authenticate',
      '/auth-proxy/commitMfaCode',
      '/auth-proxy/startMfaUserSetup',
      '/auth-proxy/finishMfaUserSetup',
      '/auth-proxy/resetUserMfaSetup',
      '/auth-proxy/authenticated',
      '/auth-proxy/deauthenticate',
      '/auth-proxy/password',
      '/auth-proxy/user',
      '/auth-proxy/tenantUsers'
    ];

    const parsedRequest = this.parseRequest(context);

    this.debugger.log(`canActivate for resource: ${parsedRequest.resource}`);

    const authToken = parsedRequest.request.get('x-auth-token');
    const tenantUserId = parsedRequest.request.get('x-tenant-user-id');
    const tenantId: string = parsedRequest.request.get('x-tenant-id')
      ? parsedRequest.request.get('x-tenant-id')
      : undefined;

    if (!parsedRequest.graphql && authPaths.includes(parsedRequest.resource)) {
      // Built in auth endpoints (REST) is granted by default
      this.debugger.log(`canActivate request is part of whitelisted auth paths`);
      this.setAuthDataForRequest(parsedRequest, await this.authGuardService.buildAnonymousUser(tenantId))
      return true;
    }

    const authResponse = await this.authGuardService.isAuthorized(
      authToken,
      tenantUserId,
      tenantId,
      parsedRequest.resource,
    );

    this.debugger.log(`canActivate isAuthorized`, authResponse);
    this.setAuthDataForRequest(parsedRequest, authResponse.user);
    return authResponse.granted;
  }

  private setAuthDataForRequest(parsedRequest: { graphql: boolean, request: any, resource: string }, user: AuthTenantUserResponseDto): void {
    const requestData: NebulrRequestData = {
      timestamp: new Date(),
      graphql: parsedRequest.graphql,
      auth: {
        user, resource: parsedRequest.resource
      }
    }

    // Store the data on the request object
    parsedRequest.request.nebulr = requestData;

    // Store the same request data in RequestAwareNebulrAuthHelper
    // Since this way is deprecated and never proven, don't do it for now
    // RequestAwareNebulrAuthHelper.storeRequestData(requestData);
  }

  private parseRequest(context: ExecutionContext): { graphql: boolean, request: any, resource: string } {
    if (context['contextType'] == 'graphql') {
      const graphqlCtx = GqlExecutionContext.create(context);
      const request = graphqlCtx.getContext().req;
      return { graphql: true, request, resource: this.getGraphqlResource(graphqlCtx) }
    } else {
      const request = context.switchToHttp().getRequest();
      return { graphql: false, request, resource: request.url }
    }
  }

  private getGraphqlResource(graphqlCtx: GqlExecutionContext): string {
    return `graphql/${graphqlCtx.getHandler().name}`;
  }
}

export class NebulrRequestData {
  timestamp: Date;
  graphql: boolean;
  auth: { user: AuthTenantUserResponseDto, resource: string }
}

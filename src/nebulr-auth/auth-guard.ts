import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IncomingMessage } from 'http';
import { Request } from 'express';
import { JwksClient } from 'jwks-rsa';
import { JwtService } from '@nestjs/jwt';

import { NebulrConfigService } from '../nebulr/nebulr-config/nebulr-config.service';
import { AuthGuardService } from './auth-guard.service';
import { Debugger } from '../nebulr/debugger';
import { AuthTenantUserResponseDto } from '@nebulr-group/nblocks-ts-client';
import { NebulrAuthService } from './nebulr-auth.service';

/**
 * The Nebulr AuthGuard will resolve the current provided credentials (via Platform API) into an AuthUser instance and make it available on the request object for other providers
 * The NebulrAuthService (Request scoped) will parse the Request and provide an interface for getting the AuthUser or any other auth releated data from the request.
 * For rare cases, the RequestAwareNebulrAuthHelper also gets loaded with the same auth related data. See RequestAwareNebulrAuthHelper.
 */
@Injectable()
export class AuthGuard implements CanActivate {

  private _debugger: Debugger;

  private _jwksClient: JwksClient;

  // These are the Whitelisted HTTP auth paths
  // If a HTTP call is made to one of these, consider them to be put through / granted without evaluating resourceMappings.json
  private readonly _authPaths = [
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

  constructor(
    private readonly authGuardService: AuthGuardService,
    private readonly jwtService: JwtService,
    private readonly nebulrConfigService: NebulrConfigService
  ) {
    this._debugger = new Debugger("AuthGuard");
    this._debugger.log("constructor");

    /**
      * By default, signing key verification results are cached in order to prevent excessive HTTP requests to the JWKS endpoint. 
      * If a signing key matching the kid is found, this will be cached and the next time this kid is requested the signing key will be served from the cache. 
    */
    this._jwksClient = new JwksClient({
      jwksUri: this.nebulrConfigService.getJwksUrl(),
      timeout: 30000, // Defaults to 30s
      cache: true, // Default Value
      cacheMaxEntries: 5, // Default value
      cacheMaxAge: 600000, // Defaults to 10m
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const parsedRequest = this.parseRequest(context);

    this._debugger.log(`canActivate for resource: ${parsedRequest.resource}`);

    /** 
     * This is the new JWT based access token that the user obtained from auth.nblocks.cloud 
    */
    const acessRawToken = parsedRequest.request.get('Authorization') || parsedRequest.request.get('authorization');
    if (acessRawToken && acessRawToken.startsWith('Bearer ')) {
      const acessToken = acessRawToken.substring(7, acessRawToken.length);
      const key = await this._jwksClient.getSigningKey();
      const publicKey = key.getPublicKey();
      // this._debugger.log('canActivate get public key result: ', publicKey);

      try {
        const result = this.jwtService.verify(acessToken, { publicKey, complete: false });
        this._debugger.log('canActivate token verification result: ', result)
        const { tid: tenantId, aid: appId, sub: tenantUserId, scope, role, plan } = result;

        if (appId) {
          // Built in auth endpoints (REST) is granted by default
          if (!parsedRequest.graphql && this._authPaths.includes(parsedRequest.resource)) {
            this._debugger.log('canActivate request is part of whitelisted auth paths. Granting');
            const anonymousUser = await this.authGuardService.buildAnonymousUser(tenantId)
            AuthGuard._setAuthDataForRequest(parsedRequest, anonymousUser, appId);

            return true;
          }

          this._debugger.log(`canActivate parsedRequest resource`, parsedRequest.resource);

          const resource = parsedRequest.resource.split(' ').join('');
          const authResponse = await this.authGuardService.isAuthorized(
            tenantUserId,
            tenantId,
            resource,
            scope,
            role,
            plan
          );

          this._debugger.log(`canActivate isAuthorized`, authResponse);
          AuthGuard._setAuthDataForRequest(parsedRequest, authResponse.user, appId);

          // Decide if the call is not granted and return
          if (!authResponse.granted) {
            this._debugger.log(`canActivate return false`);
            return false;
          }

          // If granted, check tenant plan before returning
          if (NebulrAuthService.isAnonymousUser(authResponse.user)) {
            this._debugger.log(`canActivate no need to do plan restriction since this is a ANONYMOUS user`);
            return true;
          } else {
            const hasRequiredPlan = this.authGuardService.hasRequiredPlan(authResponse.user.tenant.plan, resource);
            this._debugger.log(`canActivate hasRequiredPlan`, hasRequiredPlan);

            return hasRequiredPlan;
          }

        } else {
          return false;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      return false;
    }
  }

  static _buildRequestData(resource: string, graphql: boolean, user: AuthTenantUserResponseDto, appId?: string): NebulrRequestData {
    return {
      timestamp: new Date(),
      appId,
      graphql,
      auth: {
        user, resource
      }
    }
  }

  private static _setAuthDataForRequest(
    parsedRequest: { graphql: boolean, request: any, resource: string },
    user: AuthTenantUserResponseDto,
    appId?: string
  ): void {

    const requestData = this._buildRequestData(parsedRequest.resource, parsedRequest.graphql, user, appId);

    // Store the data on the request object
    parsedRequest.request.nebulr = requestData;

    // Store the same request data in RequestAwareNebulrAuthHelper
    // Since this way is deprecated and never proven, don't do it for now
    // RequestAwareNebulrAuthHelper.storeRequestData(requestData);
  }

  static getAuthDataFromRequest(request: Request): NebulrRequestData {
    const req: any = request instanceof IncomingMessage ? request : request['req'];
    const data: NebulrRequestData = req.nebulr;
    return data;
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
    return `graphql / ${graphqlCtx.getHandler().name} `;
  }
}

export class NebulrRequestData {
  timestamp: Date;
  graphql: boolean;
  appId?: string;
  auth: { user: AuthTenantUserResponseDto, resource: string }
}

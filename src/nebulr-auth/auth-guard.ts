import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IncomingMessage } from 'http';
import { Request } from 'express';
import * as jose from 'jose'
import { GetKeyFunction, JWSHeaderParameters, FlattenedJWSInput } from 'jose/dist/types/types';

import { NebulrConfigService } from '../nebulr/nebulr-config/nebulr-config.service';
import { AuthGuardService } from './auth-guard.service';
import { Debugger } from '../nebulr/debugger';
import { NebulrAuthService } from './nebulr-auth.service';
import { AuthContextDto } from './dto/auth-context.dto';
import { JWTPayloadtDto } from './dto/jwt-verify-payload.dto';


/**
 * The Nebulr AuthGuard will resolve the current provided credentials (via Platform API) into an AuthUser instance and make it available on the request object for other providers
 * The NebulrAuthService (Request scoped) will parse the Request and provide an interface for getting the AuthUser or any other auth releated data from the request.
 * For rare cases, the RequestAwareNebulrAuthHelper also gets loaded with the same auth related data. See RequestAwareNebulrAuthHelper.
 */
@Injectable()
export class AuthGuard implements CanActivate {

  private _debugger: Debugger;

  private _jwksClient: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;

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
    private readonly nebulrConfigService: NebulrConfigService
  ) {
    this._debugger = new Debugger("AuthGuard");
    this._debugger.log("constructor");

    this._jwksClient = jose.createRemoteJWKSet(new URL(this.nebulrConfigService.getJwksUrl()));
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const parsedRequest = this.parseRequest(context);
    this._debugger.log(`canActivate parsedRequest resource`, parsedRequest.resource);
    let isJwtAvailable = false;
    let authToken = '',
      tenantId = '',
      appId = '',
      tenantUserId = '',
      userScope = '',
      userRole = '',
      tenantPlan = '';

    /** 
     * This is the new JWT based access token that the user obtained from auth.nblocks.cloud 
    */
    const acessRawToken = parsedRequest.request.get('Authorization') || parsedRequest.request.get('authorization');
    if (acessRawToken && acessRawToken.startsWith('Bearer ')) {
      isJwtAvailable = true;
      const acessToken = acessRawToken.substring(7, acessRawToken.length);

      try {
        const { payload } = await jose.jwtVerify(acessToken, this._jwksClient);
        this._debugger.log('canActivate token verification result: ', payload)
        const { tid, aid, sub, scope, role, plan } = payload as JWTPayloadtDto;
        appId = aid;
        tenantId = tid;
        tenantUserId = sub;
        userScope = scope;
        userRole = role;
        tenantPlan = plan;


      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      /** These are legacy headers and non JWT based auth token */
      authToken = parsedRequest.request.get('x-auth-token');
      tenantUserId = parsedRequest.request.get('x-tenant-user-id');

      /** Only needed for anonymous calls or when using legacy non JWT auth tokens in a backendless context  */
      appId = parsedRequest.request.get('x-app-id');

      /** Only needed for anonymous calls that requires understanding of a certain tenant */
      tenantId = parsedRequest.request.get('x-tenant-id');
    }

    // Built in auth endpoints (REST) is granted by default
    if (!parsedRequest.graphql && this._authPaths.includes(parsedRequest.resource)) {
      this._debugger.log('canActivate request is part of whitelisted auth paths. Granting');
      const anonymousUser = await this.authGuardService.buildAnonymousAuthContext(tenantId)
      AuthGuard._setAuthDataForRequest(parsedRequest, anonymousUser, appId);

      return true;
    }

    const authResponse = isJwtAvailable
      ? await this.authGuardService.isAuthorized(
        tenantUserId,
        tenantId,
        parsedRequest.resource,
        userScope,
        userRole,
        tenantPlan,
      ) : await this.authGuardService.isAuthorizedLegacy(
        authToken,
        tenantUserId,
        tenantId,
        parsedRequest.resource,
        appId
      );

    this._debugger.log(`canActivate isAuthorized`, authResponse);
    AuthGuard._setAuthDataForRequest(parsedRequest, authResponse.authContext, appId);

    // Decide if the call is not granted and return
    if (!authResponse.granted) {
      this._debugger.log(`canActivate return false`);
      return false;
    }

    // // If granted, check tenant plan before returning
    if (NebulrAuthService.isAnonymousUser(authResponse.authContext)) {
      this._debugger.log(`canActivate no need to do plan restriction since this is a ANONYMOUS user`);
      return true;
    } else {
      const hasRequiredPlan = this.authGuardService.hasRequiredPlan(authResponse.authContext.tenantPlan, parsedRequest.resource);
      this._debugger.log(`canActivate hasRequiredPlan`, hasRequiredPlan);

      return hasRequiredPlan;
    }
  }

  static _buildRequestData(resource: string, graphql: boolean, authContext: AuthContextDto, appId?: string): NebulrRequestData {
    return {
      timestamp: new Date(),
      appId,
      graphql,
      auth: {
        authContext, resource
      }
    }
  }

  private static _setAuthDataForRequest(
    parsedRequest: { graphql: boolean, request: any, resource: string },
    authContext: AuthContextDto,
    appId?: string
  ): void {

    const requestData = this._buildRequestData(parsedRequest.resource, parsedRequest.graphql, authContext, appId);

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
    return `graphql/${graphqlCtx.getHandler().name}`;
  }
}

export class NebulrRequestData {
  timestamp: Date;
  graphql: boolean;
  appId?: string;
  auth: { authContext: AuthContextDto, resource: string }
}

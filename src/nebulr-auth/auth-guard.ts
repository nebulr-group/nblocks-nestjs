import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { AuthGuardService } from './auth-guard.service';
import { Debugger } from '../nebulr/debugger';
import { NebulrAuthService } from './nebulr-auth.service';
import { NebulrRequestData } from './dto/request-data';
import { ClientService } from '../shared/client/client.service';
import { AuthContext } from '@nebulr-group/nblocks-ts-client';


/**
 * The Nebulr AuthGuard will resolve the current provided credentials (via Platform API) into an AuthUser instance and make it available on the request object for other providers
 * The NebulrAuthService (Request scoped) will parse the Request and provide an interface for getting the AuthUser or any other auth releated data from the request.
 * For rare cases, the RequestAwareNebulrAuthHelper also gets loaded with the same auth related data. See RequestAwareNebulrAuthHelper.
 */
@Injectable()
export class AuthGuard implements CanActivate {

  private _debugger: Debugger;

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
    private readonly clientService: ClientService
  ) {
    this._debugger = new Debugger("AuthGuard");
    this._debugger.log("constructor");
  }

  // Return false for 403, throw UnauthorizedException for 401
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const parsedRequest = this.parseRequest(context);
    this._debugger.log(`canActivate parsedRequest resource`, parsedRequest.resource);
    let isJwtAvailable = false;

    let authToken = '',
      tenantId = '',
      appId = '',
      tenantUserId = '';

    let authContext: AuthContext;

    /** 
     * This is the new JWT based access token that the user obtained from auth.nblocks.cloud 
    */
    const { rawAcessToken, authHeader, authCookie } = AuthGuard._extractJWTFromRequest(parsedRequest);

    if (rawAcessToken && rawAcessToken.startsWith('Bearer ')) {
      isJwtAvailable = true;
      const acessToken = rawAcessToken.substring(7, rawAcessToken.length);

      try {
        this._debugger.log(`Found JWT in ${!!authHeader ? "HTTP header" : ""} ${!!authCookie ? "Cookie" : ""}`);

        // We do not need to get the intercepted client since we're only going to use AuthContext helper
        authContext = await this.clientService.getClient().auth.contextHelper.getAuthContextVerified(acessToken);
        this._debugger.log('canActivate token verification result: ', authContext)
        appId = authContext.appId;
        tenantId = authContext.tenantId;
        tenantUserId = authContext.userId;
      } catch (error) {
        console.error(error);
        throw new UnauthorizedException();;
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

    // Built in auth endpoints (only REST calls) is granted by default and the user is considered anonymous making these calls
    if (!parsedRequest.graphql && this._authPaths.includes(parsedRequest.resource)) {
      this._debugger.log('canActivate request is part of whitelisted auth paths. Granting');
      const anonymousUser = this.authGuardService.buildAnonymousAuthContext(appId, tenantId)
      AuthGuard._setAuthDataForRequest(parsedRequest, anonymousUser, appId);

      return true;
    }

    const authResponse = isJwtAvailable
      ? await this.authGuardService.isAuthorized(
        authContext,
        parsedRequest.resource,
      ) : await this.authGuardService.isAuthorizedLegacy(
        authToken,
        tenantUserId,
        tenantId,
        parsedRequest.resource,
        parsedRequest.request,
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

  // This method has been tested but due to a module resolution error the tests are disabled
  private static _extractJWTFromRequest(parsedRequest: { graphql: boolean, request: Request, resource: string }): { rawAcessToken?: string, authHeader?: string, authCookie?: string } {
    /** 
     * This is the new JWT based access token that the user obtained from auth.nblocks.cloud 
    */
    const authHeader = parsedRequest.request.get('Authorization') || parsedRequest.request.get('authorization');

    const cookies = parsedRequest.request.cookies || {};
    const authCookie = cookies['Authorization'] || cookies['authorization'];

    const rawAcessToken = authHeader || authCookie;

    return { rawAcessToken, authHeader, authCookie };
  }

  /**
   * Stores auth context data on the request object for future lookups
   * @param parsedRequest 
   * @param authContext 
   * @param appId 
   */
  private static _setAuthDataForRequest(
    parsedRequest: { graphql: boolean, request: any, resource: string },
    authContext: AuthContext,
    appId?: string
  ): void {

    const requestData = this.buildRequestData(parsedRequest.resource, parsedRequest.graphql, authContext, appId);

    // Store the data on the request object
    parsedRequest.request.nebulr = requestData;

    // Store the same request data in RequestAwareNebulrAuthHelper
    // Since this way is deprecated and never proven, don't do it for now
    // RequestAwareNebulrAuthHelper.storeRequestData(requestData);
  }

  /**
   * Builds a request data object according to our standard
   * @param resource 
   * @param graphql 
   * @param authContext 
   * @param appId 
   * @returns NebulrRequestData
   */
  static buildRequestData(resource: string, graphql: boolean, authContext: AuthContext, appId?: string): NebulrRequestData {
    return {
      timestamp: new Date(),
      appId,
      graphql,
      auth: {
        authContext, resource
      }
    }
  }

  /**
   * Obtains previously stored auth context data from the request object
   * @param request 
   * @returns NebulrRequestData
   */
  static getAuthDataFromRequest(request: Request): NebulrRequestData {
    const data: NebulrRequestData = request['nebulr'];
    return data;
  }

  private parseRequest(context: ExecutionContext): { graphql: boolean, request: Request, resource: string } {
    if (context['contextType'] == 'graphql') {
      const graphqlCtx = GqlExecutionContext.create(context);
      const request = graphqlCtx.getContext().req;
      return { graphql: true, request, resource: this._getGraphqlResource(graphqlCtx) }
    } else {
      const request = context.switchToHttp().getRequest();
      return { graphql: false, request, resource: request.url }
    }
  }

  private _getGraphqlResource(graphqlCtx: GqlExecutionContext): string {
    return `graphql/${graphqlCtx.getHandler().name}`;
  }
}

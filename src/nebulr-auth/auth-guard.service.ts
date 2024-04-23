import * as resourceMap from 'src/../../nblocks/config/resourceMappings.json'; // Use application resourceMappings.json and not plugin
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Debugger } from '../nebulr/debugger';
import { ClientService } from '../shared/client/client.service';
import { CacheService } from '../shared/cache/cache.service';
import { AuthGuard } from './auth-guard';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthContext } from '@nebulr-group/nblocks-ts-client';
import { Request } from 'express';

type ResourceAccessConfig = string | { privilege: string, plans: string[] };

@Injectable()
export class AuthGuardService {
    private resourceMap: Record<string, ResourceAccessConfig>;
    private logger: Debugger;
    public static ANONYMOUS = 'ANONYMOUS';

    constructor(
        private readonly clientService: ClientService,
        private readonly cacheService: CacheService,
    ) {
        this.logger = new Debugger("AuthGuardService");
        this.logger.log("constructor");
        this.resourceMap = resourceMap;
    }

    // Checks if current user is authorized for a given resource
    async isAuthorized(
        authContext: AuthContext,
        resource: string,
    ): Promise<AuthResponseDto> {
        let privilege: string;

        try {
            privilege = this._getRequiredPrivileges(resource);

            // Is this endpoint for Anonymous users? If so we turn the user into anonymous even though we might have valid tokens
            if (privilege == AuthGuardService.ANONYMOUS) {
                const anonymousAuthContext = this.buildAnonymousAuthContext(authContext.appId, authContext.tenantId);
                return { granted: true, authContext: anonymousAuthContext };
            } else {
                const hasPrivilege = authContext.privileges.includes(privilege);

                return {
                    granted: hasPrivilege,
                    authContext
                };

            }
        } catch (error) {
            return { granted: false, authContext: undefined };
        }
    }

    // Checks if current user is authorized for a given resource, also loads the user property
    // Called by AuthGuard when intercepting all HTTP/GraphQL calls
    async isAuthorizedLegacy(
        token: string,
        tenantUserId: string,
        tenantId: string,
        resource: string,
        request: Request,
        appId?: string,
    ): Promise<AuthResponseDto> {
        let privilege: string;
        try {
            privilege = this._getRequiredPrivileges(resource);
        } catch (error) {
            return { granted: false, authContext: undefined };
        }

        // Is this endpoint for Anonymous users? If so we turn the user into anonymous even though we might have valid tokens
        if (privilege == AuthGuardService.ANONYMOUS) {
            const anonymousAuthContext = this.buildAnonymousAuthContext(appId, tenantId);
            return { granted: true, authContext: anonymousAuthContext };
        } else {
            if (token && tenantUserId && privilege) {
                return this._cachedAuthorize(
                    token,
                    tenantId,
                    tenantUserId,
                    privilege,
                    resource,
                    request,
                    appId
                );
            } else {

                throw new UnauthorizedException("Missing required variables");
                //return { granted: false, user: undefined }
            }
        }
    }

    /**
     * Check wether a given resource from resource mapping requires a plan and if the current plan matches this requirement
     * @param currentPlan 
     * @param resource 
     * @returns 
     */
    hasRequiredPlan(currentPlan: string, resource: string): boolean {
        const requiredPlans = this._getRequiredPlans(resource);
        return requiredPlans.length === 0 ? true : requiredPlans.includes(currentPlan);
    }

    buildAnonymousAuthContext(appId?: string, tenantId?: string): AuthContext {
        return {
            appId,
            userId: AuthGuardService.ANONYMOUS,
            tenantId,
            tenantPlan: AuthGuardService.ANONYMOUS,
            privileges: [],
            userRole: AuthGuardService.ANONYMOUS,
        }
    }

    private _getRequiredPrivileges(resource: string): string {
        const accessRight = this._getAccessRight(resource, true);
        if (accessRight instanceof Object) {
            return accessRight.privilege;
        } else {
            return accessRight;
        }
    }

    private _getRequiredPlans(resource: string): string[] {
        const accessRight = this._getAccessRight(resource, true);
        if (accessRight instanceof Object) {
            return accessRight.plans;
        } else {
            return [];
        }
    }

    /**
     * Don't use this method directly. Use `_getRequiredPrivileges` or `_getRequiredPlans`
     * @param resource The resource
     * @param isFirst (optional) used by recursion
     * @returns 
     */
    private _getAccessRight(resource: string, isFirst = true): ResourceAccessConfig {
        const paths = Object.keys(this.resourceMap);
        let pathOneLevelUp = resource.split(`/`);
        let newPath: string;

        //Try to do a full match of the resource
        if (paths.includes(resource)) {
            return this.resourceMap[resource];
        }
        //if not found is there a mapping ending with *?
        else if (isFirst) {
            pathOneLevelUp.splice(-1, 1, '*');
            newPath = pathOneLevelUp.join('/');
            if (paths.includes(pathOneLevelUp.join('/'))) {
                return this.resourceMap[resource];
            } else {
                pathOneLevelUp.splice(-1, 1, '**');
                newPath = pathOneLevelUp.join('/');
                return this._getAccessRight(newPath, false);
            }
        } else {
            // are there other mappings in this level or higher levels end ing with **?
            pathOneLevelUp = pathOneLevelUp.slice(0, -1);
            pathOneLevelUp.splice(-1, 1, '**');
            newPath = pathOneLevelUp.join('/');
            if (newPath == resource) {
                throw new Error(`no access right is defined for resource ${resource}`);
            } else {
                return this._getAccessRight(newPath, false);
            }
        }
    }

    /**
      * Wraps a cache around calling the remote API
      * @throws UnauthorizedException
      * @param token 
      * @param tenantUserId 
      * @param privilege 
      * @returns  
     */
    private async _cachedAuthorize(
        token: string,
        tenantId: string,
        tenantUserId: string,
        privilege: string,
        resource: string,
        request: Request,
        appId?: string
    ): Promise<AuthResponseDto> {
        const type = "AuthorizeResponse";
        const cacheKeys = { token, tenantUserId, privilege }
        const cache = await this.cacheService.get<AuthResponseDto>(type, cacheKeys);
        if (cache.exists) {
            return cache.data;
        } else {
            const authRawResponse = await this.clientService.getInterceptedClient(AuthGuard.buildRequestData(resource, false, this.buildAnonymousAuthContext(appId, tenantId), appId), request).authLegacy.authorize(token, tenantUserId, privilege);
            const authResponse = {
                granted: authRawResponse.granted,
                authContext: {
                    userId: authRawResponse.user.id,
                    tenantId: authRawResponse.user.tenant.id,
                    tenantPlan: authRawResponse.user.tenant.plan,
                    userRole: authRawResponse.user.role,
                }
            }
            await this.cacheService.set(type, cacheKeys, authResponse);

            return authResponse as unknown as AuthResponseDto;
        }
    }
}

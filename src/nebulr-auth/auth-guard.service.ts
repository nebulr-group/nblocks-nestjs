import * as resourceMap from 'src/../../nblocks/config/resourceMappings.json'; // Use application resourceMappings.json and not plugin
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Debugger } from '../nebulr/debugger';
import { ClientService } from '../shared/client/client.service';
import { AuthorizeResponseDto, AuthTenantResponseDto, AuthTenantUserResponseDto } from '@nebulr-group/nblocks-ts-client';
import { CacheService } from '../shared/cache/cache.service';
import { AuthGuard } from './auth-guard';

type ResourceAccessConfig = string | { privilege: string, plans: string[] };

@Injectable()
export class AuthGuardService {
    private resourceMap: Record<string, ResourceAccessConfig>;
    private logger: Debugger;
    public static ANONYMOUS = 'ANONYMOUS';

    constructor(
        private readonly clientService: ClientService,
        private readonly cacheService: CacheService
    ) {
        this.logger = new Debugger("AuthGuardService");
        this.logger.log("constructor");
        this.resourceMap = resourceMap;
    }

    // Checks if current user is authorized for a given resource, also loads the user property
    // Called by AuthGuard when intercepting all HTTP/GraphQL calls
    async isAuthorized(
        token: string,
        tenantUserId: string,
        tenantId: string,
        resource: string,
        appId?: string
    ): Promise<AuthorizeResponseDto> {
        let privilege: string;
        try {
            privilege = this._getRequiredPrivileges(resource);
        } catch (error) {
            return { granted: false, user: undefined };
        }

        if (privilege == AuthGuardService.ANONYMOUS) {
            const anonymousUser = await this.buildAnonymousUser(tenantId);
            return { granted: true, user: anonymousUser };
        } else {
            if (token && tenantUserId && privilege) {
                return this._cachedAuthorize(
                    token,
                    tenantUserId,
                    privilege,
                    resource,
                    appId
                );
            } else {

                throw new UnauthorizedException("Missing required variables");
                //return { granted: false, user: undefined }
            }
        }
    }

    hasRequiredPlan(currentPlan: string, resource: string): boolean {
        const requiredPlans = this._getRequiredPlans(resource);
        return requiredPlans.length === 0 ? true : requiredPlans.includes(currentPlan);
    }

    async buildAnonymousUser(tenantId?: string): Promise<AuthTenantUserResponseDto> {
        const tenant = { id: tenantId, name: "", locale: "" }; //await this._cachedTenant(tenantId);
        return {
            id: undefined,
            role: AuthGuardService.ANONYMOUS,
            username: AuthGuardService.ANONYMOUS,
            email: AuthGuardService.ANONYMOUS,
            onboarded: false,
            consentsToPrivacyPolicy: false,
            tenant
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
        tenantUserId: string,
        privilege: string,
        resource: string,
        appId?: string
    ): Promise<AuthorizeResponseDto> {
        const type = "AuthorizeResponse";
        const cacheKeys = { token, tenantUserId, privilege }
        const cache = await this.cacheService.get<AuthorizeResponseDto>(type, cacheKeys);
        if (cache.exists) {
            return cache.data;
        } else {
            const authResponse = await this.clientService.getInterceptedClient(AuthGuard._buildRequestData(resource, false, await this.buildAnonymousUser(), appId)).auth.authorize(token, tenantUserId, privilege);
            await this.cacheService.set(type, cacheKeys, authResponse);
            return authResponse;
        }
    }
}

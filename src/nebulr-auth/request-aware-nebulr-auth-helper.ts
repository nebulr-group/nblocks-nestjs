import { AuthTenantUserResponseDto } from '@nebulr-group/nblocks-ts-client';
import * as ContextService from 'request-context'
import { NebulrRequestData } from './auth-guard';
import { AuthGuardService } from './auth-guard.service';

/**
 * 
 */
/**
 * @deprecated The functionality is not proven for this class. Data has shown to be shared between requests. Use on own risk
 * This class is a util and helper for rare cases when you cannot access the request scoped NebulrAuthService or just an unsafe older instance of that service.
 * Typical use case is Mongoose middleware plugins that needs to retrieve and store authentication data to a document or filter documents based on authentication data. The solution is to use https://www.npmjs.com/package/request-context which is probably using deprecated NodeJS APIs.
 * See https://gitlab.com/nebulrgroup/devops/-/blob/main/README.md#using-request-scoped-data-like-authentication-data-or-currentuser-from-authservice
 */
export class RequestAwareNebulrAuthHelper {
  private static readonly namespace = "nebulr-request";
  private static readonly dataVariableName = "data"
  private static readonly timeWarningMs = 5000;

  /**
   * A request scoped AuthUser variable resolved by the AuthGuard.
   * @returns AuthUser
   */
  static getCurrentUser(): AuthTenantUserResponseDto {
    return this.getRequestData().auth.user
  }

  /**
   * Tenant ID does not always need to be set for anoymous users but if set this function should guarantee a return
   * @returns TenantId
   */
  static getTenantId(): string {
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

  /**
   * The current seeked resource the user is requesting
   * @returns boolean
   */
  static getCurrentResource(): string {
    return this.getRequestData().auth.resource;
  }

  /**
   * If this request is made using GraphQL
   * @returns boolean
   */
  static getIsGraphQL(): boolean {
    return this.getRequestData().graphql;
  }

  /**
   * Should be used by AuthGuard to store current request scoped authentication data
   * @param data NebulrRequestData
   */
  static storeRequestData(data: NebulrRequestData): void {
    ContextService.set(`${RequestAwareNebulrAuthHelper.namespace}:${RequestAwareNebulrAuthHelper.dataVariableName}`, data);
  }

  // Should be used to register the request-context middleware globally for the whole app.
  static getMiddleware(): any {
    return ContextService.middleware(RequestAwareNebulrAuthHelper.namespace)
  }

  private static getRequestData(): NebulrRequestData {
    const data: NebulrRequestData = ContextService.get(`${RequestAwareNebulrAuthHelper.namespace}:${RequestAwareNebulrAuthHelper.dataVariableName}`);
    if (!data)
      throw new Error("RequestData is Undefined. Either the middleware of RequestAwareNebulrAuthHelper has not been properly configured for app, no auth guard has resolved the user from request yet or it has been reset prior to this call.");

    const requestExecution = new Date().getTime() - data.timestamp.getTime();
    if (requestExecution > RequestAwareNebulrAuthHelper.timeWarningMs)
      console.error(`WARNING: The request used to resolve this authentication data is ${requestExecution} ms old! Either you're debugging the code, the execution is extremely slow or something dangerous is happening like shared data between requests!`);

    return data;
  }
}

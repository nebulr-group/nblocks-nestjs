import { ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NebulrAuthService } from '../nebulr-auth/nebulr-auth.service';
import { Tenant, TenantAnonymous } from './tenant.graphql-model';
import { TenantService } from './tenant.service';

@Resolver((of) => Tenant)
export class TenantResolver {
  constructor(
    private readonly tenantService: TenantService,
    private readonly nebulrAuthService: NebulrAuthService,
  ) { }

  @Query((returns) => Tenant)
  async getTenant(): Promise<Tenant> {
    return this.tenantService.getTenant();
  }

  // TODO check if this actually strips sensitive data
  @Query((returns) => TenantAnonymous)
  async getTenantAnonymous(): Promise<TenantAnonymous> {
    try {
      this.nebulrAuthService.getCurrentTenantId();
    } catch (error) {
      throw new ForbiddenException();
    }

    return this.tenantService.getTenant();
  }

  @Query((returns) => String)
  async getCustomerPortal(): Promise<string> {
    return this.tenantService.getCustomerPortal();
  }

  @Mutation((returns) => Tenant)
  async updateTenant(
    @Args('name') name: string,
    @Args('locale') locale: string,
  ): Promise<Tenant> {
    return this.tenantService.updateTenant(name, locale);
  }
}

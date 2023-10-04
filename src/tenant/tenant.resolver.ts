import { ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NebulrAuthService } from '../nebulr-auth/nebulr-auth.service';
import { CreateTenantInput, Tenant, TenantAnonymous, TenantInput } from './tenant.graphql-model';
import { TenantService } from './tenant.service';

@Resolver((of) => Tenant)
export class TenantResolver {
  constructor(
    private readonly tenantService: TenantService,
    private readonly nebulrAuthService: NebulrAuthService,
  ) { }

  @Query((returns) => Tenant, { description: "Gets a single tenant" })
  async getTenant(): Promise<Tenant> {
    return this.tenantService.getTenant();
  }

  // @Query((returns) => [Tenant], { description: "Lists all tenants" })
  // async listTenants(): Promise<Tenant[]> {
  //   return this.tenantService.listTenants();

  // }

  @Query((returns) => TenantAnonymous)
  async getTenantAnonymous(): Promise<TenantAnonymous> {
    try {
      this.nebulrAuthService.getCurrentTenantId();
    } catch (error) {
      throw new ForbiddenException();
    }

    return this.tenantService.getTenant();
  }

  @Mutation((returns) => Tenant)
  async updateTenant(
    @Args('tenant', { type: () => TenantInput }) tenant: TenantInput,
  ): Promise<Tenant> {
    return this.tenantService.updateTenant(tenant);
  }

  @Mutation((returns) => Tenant)
  async createTenantAnonymous(
    @Args('tenant', { type: () => CreateTenantInput }) tenant: CreateTenantInput,
  ): Promise<Tenant> {
    return this.tenantService.createTenant(tenant);
  }
}

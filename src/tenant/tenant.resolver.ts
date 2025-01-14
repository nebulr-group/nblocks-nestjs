import { ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NebulrAuthService } from '../nebulr-auth/nebulr-auth.service';
import {
  CreateTenantInput,
  SetTenantPlanDetailsInput,
  Tenant,
  TenantAnonymous,
  TenantInput,
  TenantPaymentDetailsGraphql,
} from './tenant.graphql-model';
import { TenantService } from './tenant.service';

@Resolver((of) => Tenant)
export class TenantResolver {
  constructor(
    private readonly tenantService: TenantService,
    private readonly nebulrAuthService: NebulrAuthService,
  ) {}

  @Query((returns) => Tenant, { description: 'Gets a single tenant' })
  async getTenant(): Promise<Tenant> {
    const result = this.tenantService.getTenant();
    return result;
  }

  @Query((returns) => TenantPaymentDetailsGraphql, {
    description: 'Gets a single tenants payment details',
  })
  async getTenantPaymentDetails(): Promise<TenantPaymentDetailsGraphql> {
    const result = await this.tenantService.getTenantPaymentDetails();
    return result;
  }

  @Mutation((returns) => TenantPaymentDetailsGraphql, {
    description: 'Sets a single tenants payment details',
  })
  async setTenantPlanDetails(
    @Args('details', { type: () => SetTenantPlanDetailsInput })
    details: SetTenantPlanDetailsInput,
  ): Promise<TenantPaymentDetailsGraphql> {
    const result = await this.tenantService.setTenantPlanDetails(details);
    return result;
  }

  @Query((returns) => TenantAnonymous)
  async getTenantAnonymous(): Promise<TenantAnonymous> {
    try {
      this.nebulrAuthService.getCurrentTenantId();
    } catch (error) {
      throw new ForbiddenException();
    }

    const result = this.tenantService.getTenant();
    return result;
  }

  @Mutation((returns) => Tenant)
  async updateTenant(
    @Args('tenant', { type: () => TenantInput }) tenant: TenantInput,
  ): Promise<Tenant> {
    const result = this.tenantService.updateTenant(tenant);
    return result;
  }

  @Mutation((returns) => Tenant)
  async createTenantAnonymous(
    @Args('tenant', { type: () => CreateTenantInput })
    tenant: CreateTenantInput,
  ): Promise<Tenant> {
    const result = this.tenantService.createTenant(tenant);
    return result;
  }
}

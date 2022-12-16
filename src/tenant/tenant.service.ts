import { TenantResponseDto } from '@nebulr-group/nblocks-ts-client';
import { CheckoutResponsetDto } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/checkout-response.dto';
import { CreateTenantRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/create-tenant-request.dto';
import { StripeTenantCheckoutIdRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/stripe-tenant-checkout-id-request.dto';
import { UpdateTenantRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/update-tenant-request.dto';
import { Injectable } from '@nestjs/common';
import { NebulrAuthService } from '../nebulr-auth/nebulr-auth.service';
import { ClientService } from '../shared/client/client.service';

@Injectable()
export class TenantService {
  constructor(
    private readonly nebulrAuthService: NebulrAuthService,
    private readonly clientService: ClientService
  ) { }

  async getTenant(): Promise<TenantResponseDto> {
    const tenantId = this.nebulrAuthService.getCurrentTenantId();
    const resp = await this.clientService.getInterceptedClient(this.nebulrAuthService.getRequest()).tenant(tenantId).get();
    return resp;
  }

  async listTenants(): Promise<TenantResponseDto[]> {
    const resp = await this.clientService.getInterceptedClient(this.nebulrAuthService.getRequest()).tenants.list();
    return resp;
  }

  /**
   * Updates a tenant. The tenant must have the same id as the tenant you currently belongs to
   * @param args 
   * @returns 
   */
  async updateTenant(args: UpdateTenantRequestDto): Promise<TenantResponseDto> {
    const tenantId = this.nebulrAuthService.getCurrentTenantId();
    const resp = await this.clientService.getInterceptedClient(this.nebulrAuthService.getRequest()).tenant(tenantId).update(args);
    return resp;
  }

  async createStripeCheckoutSession(args: StripeTenantCheckoutIdRequestDto): Promise<CheckoutResponsetDto> {
    const tenantId = this.nebulrAuthService.getCurrentTenantId();
    const resp = await this.clientService.getInterceptedClient(this.nebulrAuthService.getRequest()).tenant(tenantId).createStripeCheckoutSession(args);
    return resp;
  }

  async createTenant(args: CreateTenantRequestDto): Promise<TenantResponseDto> {
    const resp = await this.clientService.getInterceptedClient(this.nebulrAuthService.getRequest()).tenants.create(args);
    return resp;
  }

  async getCustomerPortal(): Promise<string> {
    const resp = await this.clientService.getInterceptedClient(this.nebulrAuthService.getRequest()).tenant(this.nebulrAuthService.getCurrentTenantId()).getStripeCustomerPortalUrl();
    return resp.url;
  }
}

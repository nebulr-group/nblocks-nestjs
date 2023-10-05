import { NblocksClient, TenantResponseDto } from '@nebulr-group/nblocks-ts-client';
import { CreateTenantRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/create-tenant-request.dto';
import { UpdateTenantRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/update-tenant-request.dto';
import { Injectable } from '@nestjs/common';
import { NebulrAuthService } from '../nebulr-auth/nebulr-auth.service';
import { ClientService } from '../shared/client/client.service';
import { TenantPaymentDetails } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/tenant-payment-details';
import { SetTenantPlanDetails } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/set-tenant-plan-details';

@Injectable()
export class TenantService {
  constructor(
    private readonly nebulrAuthService: NebulrAuthService,
    private readonly clientService: ClientService
  ) { }

  async getTenant(): Promise<TenantResponseDto> {
    const tenantId = this.nebulrAuthService.getCurrentTenantId();
    const resp = await this._getInterceptedClient().tenant(tenantId).get();
    return resp;
  }

  async getTenantPaymentDetails(): Promise<TenantPaymentDetails> {
    const tenantId = this.nebulrAuthService.getCurrentTenantId();
    const resp = await this._getInterceptedClient().tenant(tenantId).getPaymentDetails();
    return resp;
  }

  async setTenantPaymentDetails(args: SetTenantPlanDetails): Promise<TenantPaymentDetails> {
    const tenantId = this.nebulrAuthService.getCurrentTenantId();
    const resp = await this._getInterceptedClient().tenant(tenantId).setPaymentDetails(args);
    return resp;
  }

  async listTenants(): Promise<TenantResponseDto[]> {
    const resp = await this._getInterceptedClient().tenants.list();
    return resp;
  }

  /**
   * Updates a tenant. The tenant must have the same id as the tenant you currently belongs to
   * @param args 
   * @returns 
   */
  async updateTenant(args: UpdateTenantRequestDto): Promise<TenantResponseDto> {
    const tenantId = this.nebulrAuthService.getCurrentTenantId();
    const resp = await this._getInterceptedClient().tenant(tenantId).update(args);
    return resp;
  }

  async createTenant(args: CreateTenantRequestDto): Promise<TenantResponseDto> {
    const resp = await this._getInterceptedClient().tenants.create(args);
    return resp;
  }

  private _getInterceptedClient(): NblocksClient {
    return this.clientService.getInterceptedClient(this.nebulrAuthService.getRequest(), this.nebulrAuthService.getOriginalRequest());
  }
}

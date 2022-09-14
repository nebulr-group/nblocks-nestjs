import { TenantResponseDto } from '@nebulr-group/nblocks-ts-client';
import { CreateTenantRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/create-tenant-request.dto';
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
    const resp = await this.clientService.client.tenant(tenantId).get();
    return resp;
  }

  async listTenants(): Promise<TenantResponseDto[]> {
    const resp = await this.clientService.client.tenants.list();
    return resp;
  }

  async updateTenant(args: UpdateTenantRequestDto): Promise<TenantResponseDto> {
    const tenantId = this.nebulrAuthService.getCurrentTenantId();
    const resp = await this.clientService.client.tenant(tenantId).update(args);
    return resp;
  }

  async createTenant(args: CreateTenantRequestDto): Promise<TenantResponseDto> {
    const resp = await this.clientService.client.tenants.create(args);
    return resp;
  }

  async getCustomerPortal(): Promise<string> {
    const resp = await this.clientService.client.tenant(this.nebulrAuthService.getCurrentTenantId()).getStripeCustomerPortalUrl();
    return resp.url;
  }
}

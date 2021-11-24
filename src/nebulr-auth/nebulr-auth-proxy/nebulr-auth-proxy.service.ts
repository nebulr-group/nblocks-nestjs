import { AuthenticateRequestDto, AuthenticateResponseDto, AuthenticatedResponse, DeauthenticateResponse, UpdatePasswordRequestDto, UpdateUserInfoRequestDto, AuthTenantUserResponseDto } from '@nebulr-group/nblocks-ts-client';
import { Injectable } from '@nestjs/common';
import { ClientService } from '../../shared/client/client.service';


@Injectable()
export class NebulrAuthProxyService {

  constructor(
    private readonly clientService: ClientService,
  ) { }

  public async authenticate(
    request: AuthenticateRequestDto,
    userAgent: string
  ): Promise<AuthenticateResponseDto> {
    return this.clientService.client.auth.authenticate(request, userAgent);
  }

  public async authenticated(
    authToken: string,
  ): Promise<AuthenticatedResponse> {
    return this.clientService.client.auth.authenticated(authToken);
  }

  public async deauthenticate(authToken: string): Promise<DeauthenticateResponse> {
    return this.clientService.client.auth.deauthenticate(authToken);
  }

  public async forgotPassword(
    username: string,
  ): Promise<void> {
    await this.clientService.client.auth.forgotPassword(username);
  }

  public async updatePassword(
    request: UpdatePasswordRequestDto,
  ): Promise<void> {
    await this.clientService.client.auth.updatePassword(request)
  }

  public async updateUser(
    request: UpdateUserInfoRequestDto
  ): Promise<void> {
    await this.clientService.client.auth.updateMe(request)
  }

  public async listMyTenantUsers(
    authToken: string,
  ): Promise<AuthTenantUserResponseDto[]> {
    return this.clientService.client.auth.listMyTenantUsers(authToken);
  }
}

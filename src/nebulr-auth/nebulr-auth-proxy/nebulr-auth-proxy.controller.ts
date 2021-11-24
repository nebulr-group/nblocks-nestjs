import { AuthenticateRequestDto, AuthenticateResponseDto, AuthenticatedResponse, UpdatePasswordRequestDto, UpdateUserInfoRequestDto, AuthTenantUserResponseDto } from '@nebulr-group/nblocks-ts-client';
import { Body, Controller, Get, Post, Put, Headers } from '@nestjs/common';
import { ForgotPasswordRequestDto } from './dto/forgot-password-request.dto';
import { NebulrAuthProxyService } from './nebulr-auth-proxy.service';

@Controller('auth-proxy')
export class NebulrAuthProxyController {
  constructor(private readonly proxyService: NebulrAuthProxyService) { }

  @Post('authenticate')
  async authenticate(
    @Body() request: AuthenticateRequestDto,
    @Headers('user-agent') userAgent: string,
  ): Promise<AuthenticateResponseDto> {
    return this.proxyService.authenticate(request, userAgent);
  }

  @Get('authenticated')
  async authenticated(
    @Headers('x-auth-token') authToken: string,
  ): Promise<AuthenticatedResponse> {
    return this.proxyService.authenticated(authToken);
  }

  @Get('deauthenticate')
  async deauthenticate(
    @Headers('x-auth-token') authToken: string,
  ): Promise<Record<any, any>> {
    return this.proxyService.deauthenticate(authToken);
  }

  @Post('password')
  async forgotPassword(
    @Body() request: ForgotPasswordRequestDto,
  ): Promise<void> {
    await this.proxyService.forgotPassword(
      request.username,
    );
  }

  @Put('password')
  async updatePassword(
    @Body() request: UpdatePasswordRequestDto,
  ): Promise<void> {
    return this.proxyService.updatePassword(request);
  }

  @Put('user')
  async updateUser(
    @Headers('x-auth-token') authToken: string,
    @Body() request: UpdateUserInfoRequestDto,
  ): Promise<void> {
    request.authToken = authToken;
    return this.proxyService.updateUser(request);
  }

  @Get('tenantUsers')
  async listMyTenantUsers(
    @Headers('x-auth-token') authToken: string,
  ): Promise<AuthTenantUserResponseDto[]> {
    return this.proxyService.listMyTenantUsers(authToken);
  }
}

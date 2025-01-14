import {
  AuthenticateRequestDto,
  AuthenticateResponseDto,
  AuthenticatedResponse,
  UpdatePasswordRequestDto,
  UpdateUserInfoRequestDto,
  AuthTenantUserResponseDto,
} from '@nebulr-group/nblocks-ts-client';
import { CommitMfaCodeRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/auth/models/commit-mfa-code-request.dto';
import { CommitMfaCodeResponseDto } from '@nebulr-group/nblocks-ts-client/dist/platform/auth/models/commit-mfa-code-response.dto';
import { FinishUserMfaSetupRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/auth/models/finish-user-mfa-setup-request.dto';
import { FinishUserMfaSetupResponseDto } from '@nebulr-group/nblocks-ts-client/dist/platform/auth/models/finish-user-mfa-setup-response.dto';
import { ResetUserMfaSetupRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/auth/models/reset-user-mfa-setup-request-dto';
import { StartUserMfaSetupRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/auth/models/start-user-mfa-setup-request-dto';
import { Body, Controller, Get, Post, Put, Headers } from '@nestjs/common';
import { ForgotPasswordRequestDto } from './dto/forgot-password-request.dto';
import { NebulrAuthProxyService } from './nebulr-auth-proxy.service';

@Controller('auth-proxy')
export class NebulrAuthProxyController {
  constructor(private readonly proxyService: NebulrAuthProxyService) {}

  @Post('authenticate')
  async authenticate(
    @Body() request: AuthenticateRequestDto,
    @Headers('user-agent') userAgent: string,
  ): Promise<AuthenticateResponseDto> {
    return this.proxyService.authenticate(request, userAgent);
  }

  @Post('commitMfaCode')
  async commitMfaCode(
    @Headers('x-auth-token') authToken: string,
    @Body() request: Pick<CommitMfaCodeRequestDto, 'mfaCode'>,
  ): Promise<CommitMfaCodeResponseDto> {
    const result = await this.proxyService.commitMfaCode({
      mfaCode: request.mfaCode,
      authToken,
    });
    return result;
  }

  @Post('startMfaUserSetup')
  async startMfaUserSetup(
    @Headers('x-auth-token') authToken: string,
    @Body() request: Pick<StartUserMfaSetupRequestDto, 'phoneNumber'>,
  ): Promise<void> {
    await this.proxyService.startMfaUserSetup({
      phoneNumber: request.phoneNumber,
      authToken,
    });
  }

  @Post('finishMfaUserSetup')
  async finishMfaUserSetup(
    @Headers('x-auth-token') authToken: string,
    @Body() request: Pick<FinishUserMfaSetupRequestDto, 'mfaCode'>,
  ): Promise<FinishUserMfaSetupResponseDto> {
    return this.proxyService.finishMfaUserSetup({
      mfaCode: request.mfaCode,
      authToken,
    });
  }

  @Post('resetUserMfaSetup')
  async resetUserMfaSetup(
    @Headers('x-auth-token') authToken: string,
    @Body() request: Pick<ResetUserMfaSetupRequestDto, 'backupCode'>,
  ): Promise<void> {
    await this.proxyService.resetUserMfaSetup({
      backupCode: request.backupCode,
      authToken,
    });
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
  async sendResetPasswordLink(
    @Body() request: ForgotPasswordRequestDto,
  ): Promise<void> {
    await this.proxyService.forgotPassword(request.username);
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

import { AuthenticateRequestDto, AuthenticateResponseDto, AuthenticatedResponse, DeauthenticateResponse, UpdatePasswordRequestDto, UpdateUserInfoRequestDto, AuthTenantUserResponseDto } from '@nebulr-group/nblocks-ts-client';
import { CommitMfaCodeRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/auth/models/commit-mfa-code-request.dto';
import { CommitMfaCodeResponseDto } from '@nebulr-group/nblocks-ts-client/dist/platform/auth/models/commit-mfa-code-response.dto';
import { FinishUserMfaSetupRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/auth/models/finish-user-mfa-setup-request.dto';
import { FinishUserMfaSetupResponseDto } from '@nebulr-group/nblocks-ts-client/dist/platform/auth/models/finish-user-mfa-setup-response.dto';
import { ResetUserMfaSetupRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/auth/models/reset-user-mfa-setup-request-dto';
import { StartUserMfaSetupRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/auth/models/start-user-mfa-setup-request-dto';
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

  /**
     * Commit the MFA OTP code recieved
     * @param args `CommitMfaCodeRequestDto`
     * @returns `CommitMfaCodeResponseDto` including MFA token to be used in future calls
     */
  async commitMfaCode(args: CommitMfaCodeRequestDto): Promise<CommitMfaCodeResponseDto> {
    return this.clientService.client.auth.commitMfaCode(args);
  }

  /**
   * Initiates the MFA setup process for users missing phone number
   * @param args `StartUserMfaSetupRequestDto`
   */
  async startMfaUserSetup(args: StartUserMfaSetupRequestDto): Promise<void> {
    await this.clientService.client.auth.startMfaUserSetup(args);
  }

  /**
   * Finish the MFA setup process by providing the received OTP thus validating the phone numer and recieve MFA token and backup code
   * @param args `FinishUserMfaSetupRequestDto`
   * @returns `FinishUserMfaSetupResponseDto` including MFA token to be used in future calls and the backup code that can be used to reset the MFA in the future. The backup code should be stored safely
   */
  async finishMfaUserSetup(args: FinishUserMfaSetupRequestDto): Promise<FinishUserMfaSetupResponseDto> {
    return this.clientService.client.auth.finishMfaUserSetup(args);
  }

  /**
   * Use the previously recieved backup code to reset the MFA setup. This allows `startMfaUserSetup` to be called again
   * @param args `ResetUserMfaSetupRequestDto`
   */
  async resetUserMfaSetup(args: ResetUserMfaSetupRequestDto): Promise<void> {
    return this.clientService.client.auth.resetUserMfaSetup(args);
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

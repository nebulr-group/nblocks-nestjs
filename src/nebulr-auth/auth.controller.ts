import { AuthTenantUserResponseDto } from '@nebulr-group/nblocks-ts-client';
import { Controller, Get } from '@nestjs/common';
import { NebulrAuthService } from './nebulr-auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly nebulrAuthService: NebulrAuthService) {}

  @Get('currentUser')
  async currentUser(): Promise<AuthTenantUserResponseDto> {
    return this.nebulrAuthService.getCurrentUser();
  }
}

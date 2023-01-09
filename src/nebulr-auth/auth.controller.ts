import { Controller, Get } from '@nestjs/common';
import { AuthContextDto } from './dto/auth-context.dto';
import { NebulrAuthService } from './nebulr-auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly nebulrAuthService: NebulrAuthService
  ) {}

  @Get('currentUser')
  async currentUser(): Promise<AuthContextDto> {
    return this.nebulrAuthService.getCurrentAuthContext();
  }
}

import { forwardRef, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth-guard';
import { AuthController } from './auth.controller';
import { NebulrAuthProxyModule } from './nebulr-auth-proxy/nebulr-auth-proxy.module';
import { NebulrAuthService } from './nebulr-auth.service';
import { AuthGuardService } from './auth-guard.service';
import { SharedModule } from '../shared/shared.module';
import { NBlocksErrorToExceptionFilter } from '../nebulr/nblocks-error-to-exception-filter';

@Module({
  imports: [
    SharedModule,
    forwardRef(() => NebulrAuthProxyModule),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: NBlocksErrorToExceptionFilter,
    },
    NebulrAuthService,
    AuthGuardService,
  ],
  exports: [NebulrAuthService],
  controllers: [AuthController]
})
export class AuthModule { }

import { Module } from '@nestjs/common';
import { AuthModule } from '../nebulr-auth/nebulr-auth.module';
import { SharedModule } from '../shared/shared.module';
import { TenantResolver } from './tenant.resolver';
import { TenantService } from './tenant.service';

@Module({
  imports: [AuthModule, SharedModule],
  providers: [TenantService, TenantResolver],
  exports: [TenantService],
})
export class TenantModule {}

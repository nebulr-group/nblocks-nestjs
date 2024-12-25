import { forwardRef, Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { AuthModule } from '../nebulr-auth.module';
import { NebulrAuthProxyController } from './nebulr-auth-proxy.controller';
import { NebulrAuthProxyService } from './nebulr-auth-proxy.service';

@Module({
  imports: [SharedModule, forwardRef(() => AuthModule)],
  controllers: [NebulrAuthProxyController],
  providers: [NebulrAuthProxyService],
})
export class NebulrAuthProxyModule {}

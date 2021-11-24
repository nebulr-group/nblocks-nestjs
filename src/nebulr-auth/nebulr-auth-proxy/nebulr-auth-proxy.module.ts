import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { NebulrAuthProxyController } from './nebulr-auth-proxy.controller';
import { NebulrAuthProxyService } from './nebulr-auth-proxy.service';

@Module({
  imports: [SharedModule],
  controllers: [NebulrAuthProxyController],
  providers: [NebulrAuthProxyService],
})
export class NebulrAuthProxyModule { }

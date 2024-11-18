import { CacheModule, Module } from '@nestjs/common';
import { NebulrConfigModule } from '../nebulr/nebulr-config/nebulr-config.module';
import { ClientService } from './client/client.service';
import { CacheService } from './cache/cache.service';

@Module({
  imports: [NebulrConfigModule, CacheModule.register()],
  providers: [ClientService, CacheService],
  exports: [ClientService, CacheService],
})
export class SharedModule {}

import { CacheModule, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TenantModule } from './tenant/tenant.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { FileModule } from './file/file.module';
import { NebulrConfigModule } from './nebulr/nebulr-config/nebulr-config.module';
import { AuthModule } from './nebulr-auth/nebulr-auth.module';
import { ClientService } from './shared/client/client.service';
import { CacheService } from './shared/cache/cache.service';

@Module({
  imports: [
    NebulrConfigModule.forRoot({ graphql: true }),
    AuthModule,
    UserModule,
    TenantModule,
    FileModule,
    WebhooksModule,
    CacheModule.register(),
  ],
  controllers: [],
  providers: [CacheService, ClientService],
  exports: [CacheService, ClientService],
})
export class NBlocksModule { }

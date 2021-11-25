import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TenantModule } from './tenant/tenant.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { FileModule } from './file/file.module';
import { NebulrConfigModule } from './nebulr/nebulr-config/nebulr-config.module';
import { AuthModule } from './nebulr-auth/nebulr-auth.module';

@Module({
  imports: [
    NebulrConfigModule.forRoot({ graphql: true }),
    AuthModule,
    UserModule,
    TenantModule,
    FileModule,
    WebhooksModule
  ],
  controllers: [],
  providers: [],
})
export class NBlocksModule { }

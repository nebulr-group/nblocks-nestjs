import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TenantModule } from './tenant/tenant.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { FileModule } from './file/file.module';

/** Combining all utils except Auth */
@Module({
  imports: [
    UserModule,
    TenantModule,
    FileModule,
    WebhooksModule
  ],
  controllers: [],
  providers: [],
})
export class NBlocksModule { }

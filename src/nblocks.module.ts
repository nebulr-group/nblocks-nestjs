import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TenantModule } from './tenant/tenant.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { FileModule } from './file/file.module';
import { NebulrConfigModule } from './nebulr/nebulr-config/nebulr-config.module';
import { AuthModule } from './nebulr-auth/nebulr-auth.module';
import { SharedModule } from './shared/shared.module';
import { AppModule } from './app/app.module';

/**
 * Export every module that has providers we want should be automatically available and injectable for users without importing sub modules
 */
@Module({
  imports: [
    NebulrConfigModule.forRoot({ graphql: true }),
    AuthModule,
    UserModule,
    TenantModule,
    AppModule,
    FileModule,
    WebhooksModule,
    SharedModule
  ],
  controllers: [],
  providers: [],
  exports: [
    SharedModule,
    AuthModule
  ],
})
export class NBlocksModule { }

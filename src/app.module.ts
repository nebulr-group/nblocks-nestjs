import { Module } from '@nestjs/common';
import { NebulrConfigModule } from './nebulr/nebulr-config/nebulr-config.module';
import { AuthModule } from './nebulr-auth/nebulr-auth.module';
import { NBlocksModule } from './nblocks.module';

/**
 * For internal testing, Should not be published in plugin
 */
@Module({
  imports: [
    NebulrConfigModule.forRoot({ db: true, graphql: true, devInMemoryDb: true }),
    AuthModule,
    NBlocksModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { NBlocksModule } from './nblocks.module';

/**
 * For internal testing, Should not be published in plugin
 */
@Module({
  imports: [NBlocksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

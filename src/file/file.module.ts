import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { NebulrConfigModule } from '../nebulr/nebulr-config/nebulr-config.module';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../nebulr-auth/nebulr-auth.module';

@Module({
  imports: [HttpModule, NebulrConfigModule, AuthModule, SharedModule],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}

import { Module } from '@nestjs/common';
import { AuthModule } from '../nebulr-auth/nebulr-auth.module';
import { SharedModule } from '../shared/shared.module';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule,
    SharedModule
  ],
  providers: [
    AppService,
    AppResolver
  ],
  exports: [],
})
export class AppModule { }

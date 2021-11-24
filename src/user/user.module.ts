import { Module } from '@nestjs/common';
import { AuthModule } from '../nebulr-auth/nebulr-auth.module';
import { SharedModule } from '../shared/shared.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    AuthModule,
    SharedModule
  ],
  providers: [
    UserService,
    UserResolver
  ],
  exports: [
    UserService
  ]
})
export class UserModule { }

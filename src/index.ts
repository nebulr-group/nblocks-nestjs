import {
  AuthTenantResponseDto,
  AuthTenantUserResponseDto,
  NblocksClient,
  TenantResponseDto,
  TenantUserResponseDto,
} from '@nebulr-group/nblocks-ts-client';
import { FileModule } from './file/file.module';
import { FileService } from './file/file.service';
import { NBlocksModule } from './nblocks.module';
import { NebulrRequestData } from './nebulr-auth/dto/request-data';
import { MoongooseAuthUtils } from './nebulr-auth/mongoose-auth-utils';
import { AuthModule } from './nebulr-auth/nebulr-auth.module';
import { NebulrAuthService } from './nebulr-auth/nebulr-auth.service';
import { OrganizationPlugin } from './nebulr-auth/organization.plugin';
import { RequestAwareNebulrAuthHelper } from './nebulr-auth/request-aware-nebulr-auth-helper';
import { TenantFilterPlugin } from './nebulr-auth/tenant-filter.plugin';
import { IUserFilter } from './nebulr-auth/user-filter';
import { UserFilterPlugin } from './nebulr-auth/user-filter.plugin';
import { Debugger } from './nebulr/debugger';
import {
  ENVIRONMENT,
  NebulrConfigModule,
} from './nebulr/nebulr-config/nebulr-config.module';
import { NebulrConfigService } from './nebulr/nebulr-config/nebulr-config.service';
import { CacheService } from './shared/cache/cache.service';
import {
  ClientService,
  ClientServiceInterceptor,
} from './shared/client/client.service';
import { SharedModule } from './shared/shared.module';
import { TenantModule } from './tenant/tenant.module';
import { TenantService } from './tenant/tenant.service';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { WebhooksModule } from './webhooks/webhooks.module';

//TODO should we really re expose stuff from @nebulr-group/nblocks-ts-client
export {
  AuthModule, AuthTenantResponseDto, AuthTenantUserResponseDto, CacheService, ClientService,
  ClientServiceInterceptor, Debugger, ENVIRONMENT, FileModule,
  FileService, IUserFilter, MoongooseAuthUtils, NblocksClient, NBlocksModule, NebulrAuthService, NebulrConfigModule,
  NebulrConfigService, NebulrRequestData, OrganizationPlugin, RequestAwareNebulrAuthHelper, SharedModule, TenantFilterPlugin, TenantModule, TenantResponseDto, TenantService, TenantUserResponseDto, UserFilterPlugin, UserModule,
  UserService,
  WebhooksModule
};


import { Debugger } from './nebulr/debugger';
import { AuthModule } from './nebulr-auth/nebulr-auth.module';
import { NebulrAuthService } from './nebulr-auth/nebulr-auth.service';
import { OrganizationPlugin } from './nebulr-auth/organization.plugin';
import { TenantFilterPlugin } from './nebulr-auth/tenant-filter.plugin';
import { UserFilterPlugin } from './nebulr-auth/user-filter.plugin';
import { RequestAwareNebulrAuthHelper } from './nebulr-auth/request-aware-nebulr-auth-helper';
import { MoongooseAuthUtils } from './nebulr-auth/mongoose-auth-utils';
import { ClientService, ClientServiceInterceptor } from './shared/client/client.service';
import { CacheService } from './shared/cache/cache.service';
import { IUserFilter } from './nebulr-auth/user-filter';
import { PlatformClient, AuthTenantResponseDto, AuthTenantUserResponseDto, TenantResponseDto, TenantUserResponseDto } from '@nebulr-group/nblocks-ts-client';
import { SharedModule } from './shared/shared.module';
import { ENVIRONMENT, NebulrConfigModule } from './nebulr/nebulr-config/nebulr-config.module';
import { NebulrConfigService } from './nebulr/nebulr-config/nebulr-config.service';
import { FileModule } from './file/file.module';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { NBlocksModule } from './nblocks.module';
import { FileService } from './file/file.service';
import { TenantService } from './tenant/tenant.service';
import { UserService } from './user/user.service';
import { NebulrRequestData } from './nebulr-auth/dto/request-data';

//TODO should we really re expose stuff from @nebulr-group/nblocks-ts-client
export {
    NebulrConfigModule,
    NebulrConfigService,
    ENVIRONMENT,
    AuthModule,
    NebulrAuthService,
    AuthTenantUserResponseDto,
    AuthTenantResponseDto,
    TenantUserResponseDto,
    TenantResponseDto,
    TenantFilterPlugin,
    Debugger,
    MoongooseAuthUtils,
    SharedModule,
    ClientService,
    ClientServiceInterceptor,
    NebulrRequestData,
    CacheService,
    UserFilterPlugin,
    IUserFilter,
    PlatformClient,
    FileModule,
    FileService,
    TenantModule,
    TenantService,
    UserModule,
    UserService,
    WebhooksModule,
    NBlocksModule,
    RequestAwareNebulrAuthHelper,
    OrganizationPlugin,
};

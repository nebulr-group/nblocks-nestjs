import { PlatformClient } from '@nebulr-group/nblocks-ts-client';
import { Injectable } from '@nestjs/common';
import { ENVIRONMENT } from '../../nebulr/nebulr-config/nebulr-config.module';
import { NebulrConfigService } from '../../nebulr/nebulr-config/nebulr-config.service';

@Injectable()
export class ClientService {

    /** A ready made client instance loaded with your credentials */
    readonly client: PlatformClient;

    constructor(private readonly nebulrConfigService: NebulrConfigService) {
        this.client = new PlatformClient(
            nebulrConfigService.getNebulrPlatformApiKey(),
            1,
            false,
            nebulrConfigService.getEnvironment() === ENVIRONMENT.DEV ? 'STAGE' : 'PROD'
        );
    }
}

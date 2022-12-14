import { PlatformClient } from '@nebulr-group/nblocks-ts-client';
import { Stage } from '@nebulr-group/nblocks-ts-client/dist/platform/platform-client';
import { Injectable } from '@nestjs/common';
import { NebulrRequestData } from '../../nebulr-auth/auth-guard';
import { Debugger } from '../../nebulr/debugger';
import { ENVIRONMENT } from '../../nebulr/nebulr-config/nebulr-config.module';
import { NebulrConfigService } from '../../nebulr/nebulr-config/nebulr-config.service';

@Injectable()
export class ClientService {

    /** A ready made client instance loaded with your credentials */
    protected readonly _client: PlatformClient;
    private logger: Debugger;

    constructor(private readonly nebulrConfigService: NebulrConfigService) {
        this.logger = new Debugger("ClientService");
        this.logger.log("constructor");
        this._client = new PlatformClient(
            nebulrConfigService.getNebulrPlatformApiKey(),
            1,
            process.env.NBLOCKS_DEBUG === '*' ? true : false,
            this._getEnvironment(nebulrConfigService)
        );
    }

    private _getEnvironment(nebulrConfigService: NebulrConfigService): Stage {
        switch (nebulrConfigService.getEnvironment()) {
            case ENVIRONMENT.DEV:
                return process.env.NBLOCKS_FORCE_DEV ? 'DEV' : 'STAGE';

            default:
                return 'PROD';
        }
    }

    getClient(): PlatformClient {
        console.log("Hello from ClientService")
        return this._client;
    }

    getRequestLoadedClient(data: NebulrRequestData): PlatformClient {
        console.log(`Hello from Strict ClientService ${JSON.stringify(data.auth)}`);
        this._client.setJwt("Yomamma");
        return this._client;
    }
}

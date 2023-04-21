import { NblocksClient } from '@nebulr-group/nblocks-ts-client';
import { Stage } from '@nebulr-group/nblocks-ts-client/dist/platform/nblocks-client';
import { Injectable } from '@nestjs/common';
import { NebulrRequestData } from '../../nebulr-auth/dto/request-data';
import { Debugger } from '../../nebulr/debugger';
import { ENVIRONMENT } from '../../nebulr/nebulr-config/nebulr-config.module';
import { NebulrConfigService } from '../../nebulr/nebulr-config/nebulr-config.service';

export interface ClientServiceInterceptor {
    intercept(client: NblocksClient, data: NebulrRequestData): NblocksClient;
}

@Injectable()
export class ClientService {

    /** A ready made client instance loaded with your credentials */
    protected readonly _client: NblocksClient;
    private logger: Debugger;
    private _interceptor: ClientServiceInterceptor;

    constructor(private readonly nebulrConfigService: NebulrConfigService) {
        this.logger = new Debugger("ClientService");
        this.logger.log("constructor");
        this._client = new NblocksClient(
            {
                apiKey: nebulrConfigService.getNebulrPlatformApiKey(),
                debug: process.env.NBLOCKS_DEBUG === '*' ? true : false,
                stage: this._getEnvironment(nebulrConfigService)
            });
    }

    private _getEnvironment(nebulrConfigService: NebulrConfigService): Stage {
        switch (nebulrConfigService.getEnvironment()) {
            case ENVIRONMENT.DEV:
                return process.env.NBLOCKS_FORCE_DEV ? 'DEV' : 'STAGE';

            default:
                return 'PROD';
        }
    }

    setInterceptor(interceptor: ClientServiceInterceptor): void {
        this._interceptor = interceptor;
    }

    getClient(): NblocksClient {
        return this._client;
    }

    getInterceptedClient(data: NebulrRequestData): NblocksClient {
        if (!!this._interceptor) {
            return this._interceptor.intercept(this._client, data);
        } else {
            return this.getClient();
        }
    }
}

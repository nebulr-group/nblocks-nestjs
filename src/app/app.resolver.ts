import { Query, Resolver } from '@nestjs/graphql';
import { NebulrAuthService } from '../nebulr-auth/nebulr-auth.service';
import { App } from './app.graphql-model';
import { AppService } from './app.service';

@Resolver((of) => App)
export class AppResolver {
  constructor(
    private readonly appService: AppService,
    private readonly nebulrAuthService: NebulrAuthService,
  ) { }

  @Query((returns) => App, { description: "Gets useful App configs for the UI to consume" })
  async getApp(): Promise<App> {
    const app = await this.appService.getApp();
    return app;
  }
}

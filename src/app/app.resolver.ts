import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NebulrAuthService } from '../nebulr-auth/nebulr-auth.service';
import { App, AppConfig, PlanGraphql, UpdateCredentialsInput } from './app.graphql-model';
import { AppService } from './app.service';

@Resolver((of) => App)
export class AppResolver {
  constructor(
    private readonly appService: AppService,
    private readonly nebulrAuthService: NebulrAuthService,
  ) { }

  @Query((returns) => App, { description: "Gets useful App configs for the UI to consume" })
  async getAppAnonymous(): Promise<App> {
    const app = await this.appService.getApp();
    return app;
  }

  @Query((returns) => AppConfig, { description: "A bunch of more secret properties to render for the app config screen used by developer during quickstart" })
  async getAppConfig(): Promise<AppConfig> {
    const app = await this.appService.getAppConfig();
    return app;
  }

  @Query((returns) => [PlanGraphql], { description: "Gets the apps plan. Use this to display pricing instead of the AppConfig resolver" })
  async getAppPlans(): Promise<PlanGraphql[]> {
    const app = await this.appService.getAppConfig();
    return app.businessModel.plans;
  }

  @Mutation((returns) => Boolean, { description: "" })
  async updateAppCredentials(
    @Args({ name: 'credentials', type: () => UpdateCredentialsInput }) credentials: UpdateCredentialsInput,
  ): Promise<boolean> {
    await this.appService.updateCredentials(credentials);
    return true;
  }
}

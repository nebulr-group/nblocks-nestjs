import { Query, Resolver } from '@nestjs/graphql';
import { App, PlanGraphql } from './app.graphql-model';
import { AppService } from './app.service';

@Resolver((of) => App)
export class AppResolver {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Query((returns) => App, { description: "Gets useful App configs for the UI to consume" })
  async getAppAnonymous(): Promise<App> {
    const app = await this.appService.getApp();
    return app;
  }

  @Query((returns) => [PlanGraphql], { description: "Gets the apps plan. Use this to display pricing instead of the AppConfig resolver" })
  async getAppPlans(): Promise<PlanGraphql[]> {
    const response = await this.appService.getBusinessModel();
    return response.businessModel.plans;
  }
}

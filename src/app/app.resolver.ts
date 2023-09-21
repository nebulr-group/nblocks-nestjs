import { Query, Resolver } from '@nestjs/graphql';
import { App, PaymentOptionsGraphql } from './app.graphql-model';
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

  @Query((returns) => PaymentOptionsGraphql)
  async getPaymentOptionsAnonymous(): Promise<PaymentOptionsGraphql> {
    const [plans, taxes] = await Promise.all([this.appService.listPlans(), this.appService.listTaxes()]);
    return { plans, taxes };
  }
}

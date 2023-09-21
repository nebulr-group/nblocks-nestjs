import { Injectable } from '@nestjs/common';
import { NebulrAuthService } from '../nebulr-auth/nebulr-auth.service';
import { ClientService } from '../shared/client/client.service';
import { App } from './app.graphql-model';
import { PlanResponse } from '@nebulr-group/nblocks-ts-client/dist/platform/config/payments/plan-response';
import { TaxResponse } from '@nebulr-group/nblocks-ts-client/dist/platform/config/payments/tax-response';
import { CreateTaxRequest } from '@nebulr-group/nblocks-ts-client/dist/platform/config/payments/create-tax.request';
import { UpdateTaxRequest } from '@nebulr-group/nblocks-ts-client/dist/platform/config/payments/update-tax.request';
import { CreatePlanRequest } from '@nebulr-group/nblocks-ts-client/dist/platform/config/payments/create-plan.request';
import { UpdatePlanRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/config/payments/update-plan.request';

@Injectable()
export class AppService {
  constructor(
    private readonly clientService: ClientService,
    private readonly authService: NebulrAuthService,
  ) { }

  /**
   * Gets app. Used by getAppAnonymous so no sensitive information is added
   * @returns 
   */
  async getApp(): Promise<App> {
    const {
      id,
      uiUrl,
      websiteUrl,
      logo,
      name,
      privacyPolicyUrl,
      termsOfServiceUrl,
      onboardingFlow,
      azureAdSsoEnabled,
      googleSsoEnabled,
      passkeysEnabled
    } = await this.clientService
      .getInterceptedClient(this.authService.getRequest(), this.authService.getOriginalRequest())
      .config.getAppProfile();
    return {
      id,
      uiUrl,
      websiteUrl,
      logo,
      name,
      privacyPolicyUrl,
      termsOfServiceUrl,
      onboardingFlow,
      azureAdSsoEnabled,
      googleSsoEnabled,
      passkeysEnabled
    };
  }

  /** Payment plans */
  async listPlans(): Promise<PlanResponse[]> {
    const response = await this.clientService
      .getInterceptedClient(this.authService.getRequest(), this.authService.getOriginalRequest())
      .config.listPlans();
    return response;
  }

  /** Payment Taxes */
  async listTaxes(): Promise<TaxResponse[]> {
    const response = await this.clientService
      .getInterceptedClient(this.authService.getRequest(), this.authService.getOriginalRequest())
      .config.listTaxes();
    return response;
  }
}

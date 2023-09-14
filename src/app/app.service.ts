import { Injectable } from '@nestjs/common';
import { NebulrAuthService } from '../nebulr-auth/nebulr-auth.service';
import { ClientService } from '../shared/client/client.service';
import { App } from './app.graphql-model';
import { BusinessModel } from '@nebulr-group/nblocks-ts-client/dist/platform/models/business-model';

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

  async getBusinessModel(): Promise<{ businessModel: BusinessModel }> {
    const {
      businessModel
    } = await this.clientService
      .getInterceptedClient(this.authService.getRequest(), this.authService.getOriginalRequest())
      .config.getAppProfile();
    return {
      businessModel
    };
  }
}

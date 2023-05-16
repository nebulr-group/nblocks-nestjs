import { Injectable } from '@nestjs/common';
import { NebulrAuthService } from '../nebulr-auth/nebulr-auth.service';
import { ClientService } from '../shared/client/client.service';
import { App, AppConfig, UpdateCredentialsInput } from './app.graphql-model';

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
      uiUrl,
      websiteUrl,
      logo,
      name,
      privacyPolicyUrl,
      termsOfServiceUrl,
      onboardingFlow,
      azureAdSsoEnabled
    } = await this.clientService
      .getInterceptedClient(this.authService.getRequest())
      .config.getAppProfile();
    return {
      uiUrl,
      websiteUrl,
      logo,
      name,
      privacyPolicyUrl,
      termsOfServiceUrl,
      onboardingFlow,
      azureAdSsoEnabled
    };
  }

  async getAppConfig(): Promise<AppConfig> {
    const {
      uiUrl,
      websiteUrl,
      logo,
      name,
      privacyPolicyUrl,
      termsOfServiceUrl,
      apiUrl,
      businessModel,
      defaultRole,
      emailSenderEmail,
      emailSenderName,
      id,
      roles,
      stripeEnabled,
      azureAdSsoEnabled,
      azureMarketplaceEnabled,
      onboardingFlow,
      redirectUris,
      defaultCallbackUri,
    } = await this.clientService
      .getInterceptedClient(this.authService.getRequest())
      .config.getAppProfile();
    return {
      uiUrl,
      websiteUrl,
      logo,
      name,
      privacyPolicyUrl,
      termsOfServiceUrl,
      apiUrl,
      defaultRole,
      emailSenderEmail,
      emailSenderName,
      id,
      businessModel,
      roles: Object.keys(roles),
      stripeEnabled,
      azureAdSsoEnabled,
      azureMarketplaceEnabled,
      onboardingFlow,
      redirectUris,
      defaultCallbackUri,
    };
  }

  async updateCredentials(input: UpdateCredentialsInput): Promise<void> {
    await this.clientService
      .getInterceptedClient(this.authService.getRequest())
      .config.updateCredentials(input);
  }
}

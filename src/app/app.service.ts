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

  async getAppConfig(): Promise<AppConfig> {
    const {
      uiUrl,
      websiteUrl,
      logo,
      name,
      privacyPolicyUrl,
      termsOfServiceUrl,
      apiUrl,
      webhookUrl,
      businessModel,
      emailSenderEmail,
      emailSenderName,
      id,
      stripeEnabled,
      azureAdSsoEnabled,
      googleSsoEnabled,
      passkeysEnabled,
      azureMarketplaceEnabled,
      onboardingFlow,
      redirectUris,
      defaultCallbackUri
    } = await this.clientService
      .getInterceptedClient(this.authService.getRequest(), this.authService.getOriginalRequest())
      .config.getAppProfile();
    return {
      uiUrl,
      websiteUrl,
      logo,
      name,
      privacyPolicyUrl,
      termsOfServiceUrl,
      apiUrl,
      webhookUrl,
      emailSenderEmail,
      emailSenderName,
      id,
      businessModel,
      stripeEnabled,
      azureAdSsoEnabled,
      googleSsoEnabled,
      passkeysEnabled,
      azureMarketplaceEnabled,
      onboardingFlow,
      redirectUris,
      defaultCallbackUri
    };
  }

  async updateCredentials(input: UpdateCredentialsInput): Promise<void> {
    await this.clientService
      .getInterceptedClient(this.authService.getRequest(), this.authService.getOriginalRequest())
      .config.updateCredentials(input);
  }
}

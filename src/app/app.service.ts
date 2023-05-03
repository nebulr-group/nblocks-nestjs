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

  async getApp(): Promise<App> {
    const { uiUrl, websiteUrl, logo, name, privacyPolicyUrl, termsOfServiceUrl, onboardingFlow } = await this.clientService.getInterceptedClient(this.authService.getRequest()).config.getAppProfile();
    return { uiUrl, websiteUrl, logo, name, privacyPolicyUrl, termsOfServiceUrl, onboardingFlow }
  }

  async getAppConfig(): Promise<AppConfig> {
    const { uiUrl, websiteUrl, logo, name, privacyPolicyUrl, termsOfServiceUrl, apiUrl, businessModel, defaultRole, emailSenderEmail, emailSenderName, id, roles, stripeEnabled, azureMarketplaceEnabled, onboardingFlow } = await this.clientService.getInterceptedClient(this.authService.getRequest()).config.getAppProfile();
    return { uiUrl, websiteUrl, logo, name, privacyPolicyUrl, termsOfServiceUrl, apiUrl, defaultRole, emailSenderEmail, emailSenderName, id, businessModel, roles: Object.keys(roles), stripeEnabled, azureMarketplaceEnabled, onboardingFlow }
  }

  async updateCredentials(input: UpdateCredentialsInput): Promise<void> {
    await this.clientService.getInterceptedClient(this.authService.getRequest()).config.updateCredentials(input);
  }
}

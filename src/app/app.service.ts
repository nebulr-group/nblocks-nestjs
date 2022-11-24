import { Injectable } from '@nestjs/common';
import { ClientService } from '../shared/client/client.service';
import { App, AppConfig, UpdateCredentialsInput } from './app.graphql-model';

@Injectable()
export class AppService {
  constructor(
    private readonly clientService: ClientService
  ) { }

  async getApp(): Promise<App> {
    const { uiUrl, websiteUrl, logo, name, privacyPolicyUrl, termsOfServiceUrl } = await this.clientService.client.getApp();
    return { uiUrl, websiteUrl, logo, name, privacyPolicyUrl, termsOfServiceUrl }
  }

  async getAppConfig(): Promise<AppConfig> {
    const { uiUrl, websiteUrl, logo, name, privacyPolicyUrl, termsOfServiceUrl, apiUrl, businessModel, defaultRole, emailSenderEmail, emailSenderName, id, roles, stripeEnabled } = await this.clientService.client.getApp();
    return { uiUrl, websiteUrl, logo, name, privacyPolicyUrl, termsOfServiceUrl, apiUrl, defaultRole, emailSenderEmail, emailSenderName, id, businessModel, roles: Object.keys(roles), stripeEnabled: stripeEnabled }
  }

  async updateCredentials(input: UpdateCredentialsInput): Promise<void> {
    await this.clientService.client.updateAppCredentials(input);
  }
}

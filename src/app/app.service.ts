import { Injectable } from '@nestjs/common';
import { ClientService } from '../shared/client/client.service';
import { App } from './app.graphql-model';

@Injectable()
export class AppService {
  constructor(
    private readonly clientService: ClientService
  ) { }

  async getApp(): Promise<App> {
    const { uiUrl, websiteUrl, logo, name, privacyPolicyUrl, termsOfServiceUrl } = await this.clientService.client.getApp();
    return { uiUrl, websiteUrl, logo, name, privacyPolicyUrl, termsOfServiceUrl }
  }
}

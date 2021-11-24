import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENT } from './nebulr-config.module';

@Injectable()
export class NebulrConfigService {
  constructor(private configService: ConfigService) { }
  getEnvironment(): ENVIRONMENT {
    return process.env.APP_ENV as ENVIRONMENT;
  }

  getNebulrAuthUrl(): string {
    return `${this.getNebulrPlatformCoreUrl()}/auth/authorize`;
  }

  getNebulrPlatformCoreUrl(): string {
    return this.getConfig('NEBULR_PLATFORM_CORE_API_URL');
  }

  getNebulrPlatformApiKey(): string {
    return this.getConfig('NEBULR_PLATFORM_API_KEY');
  }

  public getConfig(parameter): string {
    const config = this.configService.get<string>(parameter);
    if (!config) {
      throw new NebulrConfigNotFoundError(
        `Config parameter ${parameter} not found for environment ${this.getEnvironment()}`,
      );
    } else {
      return config;
    }
  }
}

export class NebulrConfigNotFoundError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NebulrConfigNotFoundError.prototype);
    this.name = NebulrConfigNotFoundError.name;
  }
}

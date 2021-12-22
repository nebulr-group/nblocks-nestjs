import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENT } from './nebulr-config.module';

@Injectable()
export class NebulrConfigService {
  constructor(private configService: ConfigService) { }

  /**
   * Get the current `ENVIRONMENT` 
   * @returns Returns current `ENVIRONMENT` 
   */
  getEnvironment(): ENVIRONMENT {
    return NebulrConfigService.parseEnvironmentFromProcess();
  }

  getNebulrAuthUrl(): string {
    return `${this.getNebulrPlatformCoreUrl()}/auth/authorize`;
  }

  getNebulrPlatformCoreUrl(): string {
    return this.getConfig('NBLOCKS_CORE_API_URL');
  }

  getNebulrPlatformApiKey(): string {
    return this.getConfig('NBLOCKS_API_KEY');
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

  /**
   * Looks for a proper environment variable from the process env variables
   * Order of prio: NODE_ENV > APP_ENV > npm_lifecycle_event
   * Throws Error when current environment cannot be recognized
   * @returns The current `ENVIRONMENT`
   */
  static parseEnvironmentFromProcess(): ENVIRONMENT {
    let ENV = process.env.NODE_ENV || process.env.APP_ENV || process.env.npm_lifecycle_event;
    ENV = ENV.toLowerCase();
    if (ENV.startsWith("start:"))
      ENV = ENV.split(":")[1];

    if (!ENV) {
      throw new Error(
        'ENV is not set. Application configs will not load properly',
      );
    }

    if (![ENVIRONMENT.PROD, ENVIRONMENT.STAGE, ENVIRONMENT.DEV, ENVIRONMENT.TEST].includes(ENV as ENVIRONMENT)) {
      throw new Error(
        `Unrecognized environment. Got ${ENV}. Application configs will not load properly`,
      );
    }

    return ENV as ENVIRONMENT;
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

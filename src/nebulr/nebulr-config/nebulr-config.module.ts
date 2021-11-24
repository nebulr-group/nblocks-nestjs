import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GqlModuleOptions } from '@nestjs/graphql';
import { GraphQLModule } from '@nestjs/graphql/dist/graphql.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import { join } from 'path';
import { NebulrConfigService } from './nebulr-config.service';

// Needed so that webpack bundles necessary packages
require('apollo-server-express'); // Required by @nestjs/graphql

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [NebulrConfigService],
  exports: [NebulrConfigService],
})
export class NebulrConfigModule {
  private static getMongooseUri(
    args: { host: string; appName: string; password: string },
    env: ENVIRONMENT,
  ): string {
    const db = `${args.appName}-db-${env}`;
    const username = db;
    return `mongodb+srv://${username}:${args.password}@${args.host}/${db}`;
  }

  static forRoot(options: NebulrConfigModuleOptions): DynamicModule {
    const ENV = process.env.APP_ENV;
    if (!ENV) {
      throw new Error(
        'ENV is not set. application configs will not load properly',
      );
    }

    const graphqlOptions: Partial<GqlModuleOptions> = {};

    if (ENV == ENVIRONMENT.DEV) {
      graphqlOptions.autoSchemaFile = join(
        process.cwd(),
        'src/generated/schema.gql',
      );
    } else {
      graphqlOptions.typePaths = ['src/generated/schema.gql'];
    }

    const mongooseOptions: MongooseModuleOptions = {
      useFindAndModify: false,
      useNewUrlParser: true,
    };

    const imports = [
      ConfigModule.forRoot({
        envFilePath: ['nebulr/config/main.env', `nebulr/config/${ENV}.env`],
        expandVariables: true,
        isGlobal: true,
      }),
    ];

    if (options.db)
      if (options.devInMemoryDb && ENV == ENVIRONMENT.DEV) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const inMemoryTestModule = require('../nebulr-test/mongoose-in-memory-test.module');
        imports.push(
          inMemoryTestModule.rootMongooseTestModule(mongooseOptions),
        );
      } else
        imports.push(
          MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
              return {
                uri: this.getMongooseUri(
                  {
                    appName: configService.get<string>('APP_NAME'),
                    host: configService.get<string>('DB_URL'),
                    password: configService.get<string>('DB_PASSWORD'),
                  },
                  ENV as ENVIRONMENT,
                ),
                ...mongooseOptions,
              };
            },
            inject: [ConfigService],
          }),
        );

    if (options.graphql)
      imports.push(
        GraphQLModule.forRoot({
          debug: true,
          playground: ENV != ENVIRONMENT.PROD ? true : false,
          sortSchema: true,
          context: ({ req }) => {
            return { req };
          },
          cors: {
            credentials: true,
            origin: true,
          },
          ...graphqlOptions,
        }),
      );

    return {
      module: NebulrConfigModule,
      providers: [ConfigService],
      imports,
      exports: [ConfigService],
    };
  }
}

export class NebulrConfigModuleOptions {
  /** Init a connection to a MongoDB cluster */
  db?: boolean;

  /**
   * Only in env DEV. Use in-memory MongoDB that will be launched on startup and resetted on stop.
   */
  devInMemoryDb?: boolean;

  /** Launch GraphQl server */
  graphql?: boolean;
}

export enum ENVIRONMENT {
  DEV = 'dev',
  TEST = 'test',
  STAGE = 'stage',
  PROD = 'prod',
}

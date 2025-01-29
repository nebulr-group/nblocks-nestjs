import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GqlModuleOptions } from '@nestjs/graphql';
import { GraphQLModule } from '@nestjs/graphql/dist/graphql.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import { join } from 'path';
import { NebulrConfigService } from './nebulr-config.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

// Needed so that webpack bundles necessary packages
require('apollo-server-express'); // Required by @nestjs/graphql

/**
 * 
  MongoDB Server ->	Mongoose
  7.x	-> ^7.4.0 | ^8.0.0
  6.x	-> ^6.5.0 | ^7.0.0 | ^8.0.0
  5.x	-> ^5.13.0 | ^6.0.0 | ^7.0.0 | ^8.0.0
  4.4.x	-> ^5.10.0 | ^6.0.0 | ^7.0.0 | ^8.0.0
 */

// We're running with useUnifiedTopology, hense the use of correct variables
// The configuration has been tweeked for serverless usage. If running on dedicated servers you should probably fall back to defaults
// https://mongoosejs.com/docs/7.x/docs/deprecations.html
// https://mongoosejs.com/docs/7.x/docs/connections.html
// https://www.mongodb.com/docs/atlas/manage-connections-aws-lambda
export const mongooseOptions: MongooseModuleOptions = {
  // Below are some tweeks that are optimized for Serverless.
  maxPoolSize: 5, // Defaults to 100
  serverSelectionTimeoutMS: 10000, // Defaults to 30000
  socketTimeoutMS: 28000, // Just before severless max execution, defaults to 360000
};

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [NebulrConfigService],
  exports: [NebulrConfigService],
})
export class NebulrConfigModule {
  private static getDatabaseOptions(configService: ConfigService): {
    pass: string;
    user: string;
    dbName: string;
    uri: string;
  } {
    const connObj = {
      pass: configService.get<string>('DB_PASSWORD'),
      user: configService.get<string>('DB_USER'),
      dbName: configService.get<string>('DB_SCHEMA'),
      uri: `${configService.get<string>(
        'DB_PROTOCOL',
      )}${configService.get<string>('DB_HOST')}`,
    };
    return connObj;
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

    const imports = [
      ConfigModule.forRoot({
        envFilePath: [
          'nebulr/config/main.env',
          `nebulr/config/${ENV}.env`,
          'nblocks/config/main.env',
          `nblocks/config/${ENV}.env`,
        ],
        expandVariables: true,
        isGlobal: true,
        cache: true,
      }),
      GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        debug: true,
        playground: ENV != ENVIRONMENT.PROD ? true : false,
        sortSchema: true,
        context: ({ req }) => {
          return { req };
        },
        ...graphqlOptions,
      }) as DynamicModule,
      
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {            
            return {
              ...NebulrConfigModule.getDatabaseOptions(configService),
              ...mongooseOptions,
            };
          },
          inject: [ConfigService],
        }) as DynamicModule
      
    ];

    //So why do we do it this way? because typescript 4.9.0 is stricter with adding elements of different types to an array, ConfigModule.forRoot() returns a promise<DynamicModule>, and MongooseModule.forRootAsync returns a DynamicModule. Adding both typs to the array directly will not cause an error but pushing them will. Thus we added all of necessary configs and then removed the ones that are not needed.
    if (!options.db) {
      imports.splice(2, 1);
    }
    if (!options.graphql) {
      
      imports.splice(1, 1);
    }

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

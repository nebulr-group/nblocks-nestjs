import { Document, Schema as MongooseSchema } from 'mongoose';
import { MoongooseAuthUtils } from './mongoose-auth-utils';
import { IUserFilter } from './user-filter';
import * as Sentry from '@sentry/serverless';

export class UserFilterPlugin {
  static createOps(handler: IUserFilter): Record<string, any> {
    return { handler };
  }
  static userFilterPlugin(
    schema: MongooseSchema<Document>,
    opts: Record<string, any>,
  ): void {

    const handler: IUserFilter = opts.handler;

    const preActions = [
      'find',
      'findOne',
      'findOneAndDelete',
      'findOneAndRemove',
      'findOneAndUpdate',
    ];
    for (const action of preActions) {
      schema.pre(action, async function () {
        try {
          const entityName = this['model']['modelName'];
          const nebulrAuthService = MoongooseAuthUtils.resolveAuthServiceFromQuery(this);
          if (handler.shouldApplyFilter(nebulrAuthService.getCurrentUser(), entityName)) {
            await handler.applyPreFilter(this, nebulrAuthService.getCurrentUser(), entityName);
          }
        } catch (error) {
          console.error(error);
          Sentry.captureException(error);
          throw error;
        }

      });
    }

    //TODO add here other hooks?
  }
}

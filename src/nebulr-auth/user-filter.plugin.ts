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
    ] as const;
    type QueryAction = (typeof preActions)[number];
    for (const action of preActions) {
      schema.pre(action as QueryAction, async function () {
        try {
          const entityName = this['model']['modelName'];
          const nebulrAuthService =
            MoongooseAuthUtils.resolveAuthServiceFromQuery(this);
          if (
            handler.shouldApplyFilter(
              nebulrAuthService.getCurrentAuthContext(),
              entityName,
            )
          ) {
            await handler.applyPreFilter(
              this,
              nebulrAuthService.getCurrentAuthContext(),
              entityName,
            );
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

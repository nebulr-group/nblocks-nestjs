import { Document, Schema as MongooseSchema } from 'mongoose';
import { MoongooseAuthUtils } from './mongoose-auth-utils';
import * as Sentry from '@sentry/serverless';

/**
 * @deprecated The lingo is wrong here. Use TenantFilterPlugin for same functionality
 */
export class OrganizationPlugin {
  /**
   * @deprecated The lingo is wrong here. Use TenantFilterPlugin for same functionality
   */
  static organizationPlugin(
    schema: MongooseSchema<Document>,
    opts: Record<string, any>,
  ): void {
    const parameter = 'organizationId';

    const fieldSchema = {};
    fieldSchema[parameter] = { type: String };
    schema.add(fieldSchema);

    schema.pre('save', function (next) {
      if (this.isNew) {
        try {
          const nebulrAuthService =
            MoongooseAuthUtils.resolveAuthServiceFromDocument(this);
          const organizationId = nebulrAuthService.getCurrentTenantId();
          this[parameter] = organizationId;
        } catch (error) {
          console.error(error);
          Sentry.captureException(error);
          throw error;
        }
      }
      next();
    });

    const actions = [
      'find',
      'findOne',
      'findOneAndDelete',
      'findOneAndRemove',
      'findOneAndUpdate',
    ] as const;

    type QueryAction = (typeof actions)[number];

    for (const action of actions) {
      schema.pre(action as QueryAction, async function () {
        try {
          const nebulrAuthService =
            MoongooseAuthUtils.resolveAuthServiceFromQuery(this);
          this.where('organizationId').equals(
            nebulrAuthService.getCurrentTenantId(),
          );
        } catch (error) {
          console.error(error);
          Sentry.captureException(error);
          throw error;
        }
      });
    }
  }
}

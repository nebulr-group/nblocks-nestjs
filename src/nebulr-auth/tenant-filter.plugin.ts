import { Document, ObjectId, Schema as MongooseSchema, Types } from 'mongoose';
import { MoongooseAuthUtils } from './mongoose-auth-utils';
import * as Sentry from '@sentry/serverless';

export class TenantFilterPlugin {
  static tenantFilterPlugin(
    schema: MongooseSchema<Document>,
    opts: Record<string, any>,
  ): void {
    const fieldName = 'tenantId';

    const fieldSchema = {};
    fieldSchema[fieldName] = { type: String };
    schema.add(fieldSchema);

    schema.pre('save', function (next) {
      if (this.isNew) {
        try {
          const nebulrAuthService = MoongooseAuthUtils.resolveAuthServiceFromDocument(this);
          //TODO property should be named tenantId instead for future proof lingo
          const tenantId = nebulrAuthService.getCurrentTenantId();
          this[fieldName] = new Types.ObjectId(tenantId);
        } catch (error) {
          console.error(error);
          Sentry.captureException(error);
          throw error;
        }

      }
      next();
    });

    // findById, findByIdAndDelete are wrappers to findOne, findOneAndDelete etc
    // exists are wrappers around findOne
    const actions = [
      'find',
      'findOne',
      'findOneAndDelete',
      'findOneAndRemove',
      'findOneAndUpdate',
    ];
    for (const action of actions) {
      schema.pre(action, async function () {
        try {
          const nebulrAuthService = MoongooseAuthUtils.resolveAuthServiceFromQuery(this);
          this.where(fieldName).equals(
            new Types.ObjectId(nebulrAuthService.getCurrentTenantId()) as unknown as ObjectId
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

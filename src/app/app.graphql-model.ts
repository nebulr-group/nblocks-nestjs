import { AppModel } from '@nebulr-group/nblocks-ts-client';
import { BusinessModel } from '@nebulr-group/nblocks-ts-client/dist/platform/models/business-model';
import { Plan } from '@nebulr-group/nblocks-ts-client/dist/platform/models/plan';
import { Price } from '@nebulr-group/nblocks-ts-client/dist/platform/models/price';
import { Tax } from '@nebulr-group/nblocks-ts-client/dist/platform/models/tax';
import { UpdateCredentials } from '@nebulr-group/nblocks-ts-client/dist/platform/models/update-credentials-request.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

/** A bunch of safe to render app properties for the UI to consume */
@ObjectType()
export class App implements Pick<AppModel, 'name' | 'uiUrl' | 'logo' | 'websiteUrl' | 'privacyPolicyUrl' | 'termsOfServiceUrl'> {
  @Field(type => String, { nullable: true })
  name: string;

  @Field(type => String, { nullable: true })
  uiUrl: string;

  @Field(type => String, { nullable: true })
  logo: string;

  @Field(type => String, { nullable: true })
  websiteUrl: string;

  @Field(type => String, { nullable: true })
  privacyPolicyUrl: string;

  @Field(type => String, { nullable: true })
  termsOfServiceUrl: string;
}

/** A bunch of more secret properties to render for the app config screen used by developer during quickstart */
@ObjectType()
export class AppConfig extends App implements Pick<AppModel, 'id' | 'name' | 'uiUrl' | 'apiUrl' | 'defaultRole' | 'businessModel' | 'logo' | 'websiteUrl' | 'privacyPolicyUrl' | 'termsOfServiceUrl' | 'emailSenderName' | 'emailSenderEmail'> {

  @Field(type => String, { nullable: true })
  id: string;

  @Field(type => String, { nullable: true })
  apiUrl: string;

  @Field(type => String, { nullable: true })
  defaultRole: string;

  @Field(type => [String], { nullable: true })
  roles: string[];

  @Field(type => BusinessModelGraphql, { nullable: true })
  businessModel: BusinessModel;

  @Field(type => String, { nullable: true })
  emailSenderName: string;

  @Field(type => String, { nullable: true })
  emailSenderEmail: string;
}

// Only purpose is to att Graphql fields on the existing Business model
@ObjectType()
export class PriceGraphql implements Price {
  @Field()
  region: string;

  @Field()
  amount: number;

  @Field()
  currency: string;

  recurrenceInterval: 'day' | 'month' | 'week' | 'year';
}

// Only purpose is to att Graphql fields on the existing Business model
@ObjectType()
export class PlanGraphql implements Plan {
  @Field()
  name: string;

  @Field(() => [PriceGraphql])
  prices: Price[];
}

// Only purpose is to att Graphql fields on the existing Business model
@ObjectType()
export class TaxGraphql implements Tax {
  @Field()
  region: string;

  @Field()
  name: string;

  @Field()
  percentage: number;
}

// Only purpose is to att Graphql fields on the existing Business model
@ObjectType()
export class BusinessModelGraphql implements BusinessModel {
  @Field(() => [PlanGraphql])
  plans: Plan[];

  @Field(() => [TaxGraphql])
  taxes: Tax[];
}

@InputType()
export class UpdateCredentialsInput implements UpdateCredentials {
  @Field(type => String, { nullable: true })
  stripeSecretKey?: string;

  @Field(type => String, { nullable: true })
  stripePublicKey?: string;
}
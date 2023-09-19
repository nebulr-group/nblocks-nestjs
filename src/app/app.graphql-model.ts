import { AppModel } from '@nebulr-group/nblocks-ts-client';
import { BusinessModel } from '@nebulr-group/nblocks-ts-client/dist/platform/models/business-model';
import { OnboardingFlow } from '@nebulr-group/nblocks-ts-client/dist/platform/models/onboarding-flow';
import { Plan } from '@nebulr-group/nblocks-ts-client/dist/platform/models/plan';
import { Price } from '@nebulr-group/nblocks-ts-client/dist/platform/models/price';
import { Tax } from '@nebulr-group/nblocks-ts-client/dist/platform/models/tax';
import { Field, ObjectType } from '@nestjs/graphql';

/** A bunch of safe to render app properties for the UI to consume */
@ObjectType()
export class App implements Pick<AppModel, 'name' | 'uiUrl' | 'logo' | 'websiteUrl' | 'privacyPolicyUrl' | 'termsOfServiceUrl' | 'onboardingFlow' | 'passkeysEnabled' | 'azureAdSsoEnabled' | 'googleSsoEnabled'> {

  @Field(type => String, { nullable: true })
  id: string;

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

  @Field(type => String, { nullable: true })
  onboardingFlow: OnboardingFlow;

  @Field(type => Boolean, { nullable: true })
  azureAdSsoEnabled: boolean;

  @Field(type => Boolean, { nullable: true })
  googleSsoEnabled: boolean;

  @Field(type => Boolean, { nullable: true })
  passkeysEnabled: boolean;
}

//TODO Should we render the full Business model here?

// Only purpose is to add Graphql fields on the existing Business model
@ObjectType()
export class PriceGraphql implements Price {
  @Field()
  key: string;

  @Field()
  amount: number;

  @Field()
  currency: string;

  @Field(type => String)
  recurrenceInterval: 'day' | 'month' | 'week' | 'year';
}

// Only purpose is to add Graphql fields on the existing Business model
@ObjectType()
export class PlanGraphql implements Plan {
  @Field()
  name: string;

  @Field(() => Number, { nullable: true })
  trialDays?: number;

  @Field()
  key: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [PriceGraphql])
  prices: Price[];
}

// Only purpose is to add Graphql fields on the existing Business model
@ObjectType()
export class TaxGraphql implements Tax {
  @Field()
  countryCode: string;

  @Field()
  name: string;

  @Field()
  percentage: number;
}

// Only purpose is to add Graphql fields on the existing Business model
@ObjectType()
export class BusinessModelGraphql implements BusinessModel {
  @Field(() => [PlanGraphql])
  plans: Plan[];

  @Field(() => [TaxGraphql])
  taxes: Tax[];
}
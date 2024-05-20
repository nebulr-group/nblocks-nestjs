import { AppModel } from '@nebulr-group/nblocks-ts-client';
import { PlanResponse } from '@nebulr-group/nblocks-ts-client/dist/platform/config/payments/plan-response';
import { Price } from '@nebulr-group/nblocks-ts-client/dist/platform/config/payments/price';
import { TaxResponse } from '@nebulr-group/nblocks-ts-client/dist/platform/config/payments/tax-response';
import { OnboardingFlow } from '@nebulr-group/nblocks-ts-client/dist/platform/models/onboarding-flow';
import { Field, ObjectType } from '@nestjs/graphql';

/** A bunch of safe to render app properties for the UI to consume */
@ObjectType()
export class App implements Pick<AppModel, 'name' | 'uiUrl' | 'logo' | 'tenantSelfSignup' | 'websiteUrl' | 'privacyPolicyUrl' | 'termsOfServiceUrl' | 'onboardingFlow' | 'passkeysEnabled' | 'mfaEnabled' | 'magicLinkEnabled' | 'azureAdSsoEnabled' | 'googleSsoEnabled' | 'linkedinSsoEnabled' | 'facebookSsoEnabled' | 'githubSsoEnabled' | 'appleSsoEnabled'> {

  @Field(type => String, { nullable: true })
  id: string;

  @Field(type => String, { nullable: true })
  name: string;

  @Field(type => String, { nullable: true })
  uiUrl: string;

  @Field(type => String, { nullable: true })
  logo: string;

  @Field(type => Boolean, { nullable: true })
  tenantSelfSignup: boolean;

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
  linkedinSsoEnabled: boolean;

  @Field(type => Boolean, { nullable: true })
  passkeysEnabled: boolean;

  @Field(type => Boolean, { nullable: true })
  mfaEnabled: boolean;

  @Field(type => Boolean, { nullable: true })
  magicLinkEnabled: boolean;

  @Field(type => Boolean, { nullable: true })
  facebookSsoEnabled: boolean;

  @Field(type => Boolean, { nullable: true })
  githubSsoEnabled: boolean;

  @Field(type => Boolean, { nullable: true })
  appleSsoEnabled: boolean;
}

//TODO Should we render the full Business model here?

// Only purpose is to add Graphql fields on the existing Business model
@ObjectType()
export class PriceGraphql implements Price {

  @Field()
  amount: number;

  @Field()
  currency: string;

  @Field(type => String)
  recurrenceInterval: 'day' | 'month' | 'week' | 'year';
}

// Only purpose is to add Graphql fields on the existing Business model
@ObjectType()
export class PlanGraphql implements PlanResponse {
  @Field()
  id: string;

  @Field()
  key: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  trial: boolean;

  @Field()
  trialDays: number;

  @Field(() => [PriceGraphql])
  prices: Price[];

  @Field(type => String, { nullable: true })
  createdAt: Date;
}

// Only purpose is to add Graphql fields on the existing Business model
@ObjectType()
export class TaxGraphql implements TaxResponse {
  @Field()
  id: string;

  @Field()
  countryCode: string;

  @Field()
  name: string;

  @Field()
  percentage: number;

  @Field(type => String, { nullable: true })
  createdAt: Date;
}

@ObjectType()
export class PaymentOptionsGraphql {
  @Field(() => [PlanGraphql], { nullable: true })
  plans: PlanResponse[];

  @Field(() => [TaxGraphql], { nullable: true })
  taxes: TaxResponse[];
}
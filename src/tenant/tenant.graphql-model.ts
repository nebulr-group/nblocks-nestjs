import { TenantResponseDto } from '@nebulr-group/nblocks-ts-client';
import { PlanResponse } from '@nebulr-group/nblocks-ts-client/dist/platform/config/payments/plan-response';
import {
  Price,
  RecurrenceInterval,
} from '@nebulr-group/nblocks-ts-client/dist/platform/config/payments/price';
import {
  CreateTenantRequestDto,
  TenantOwnerRequestDto,
} from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/create-tenant-request.dto';
import { TenantPaymentDetails } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/tenant-payment-details';
import { TenantPaymentStatus } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/tenant-payment-status';
import { TenantPlanDetails } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/tenant-plan-details';
import { SetTenantPlanDetails } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/set-tenant-plan-details';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { PlanGraphql, PriceGraphql } from '../app/app.graphql-model';
import { UpdateTenantRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/update-tenant-request.dto';
import { PriceOffer } from '@nebulr-group/nblocks-ts-client/dist/platform/config/payments/price-offer';
import { BillingProvider } from '@nebulr-group/nblocks-ts-client/dist/platform/config/payments/billing-provider.enum';
import { CustomParamGraphqlInput } from '../user/user.graphql-model';

//TODO This is basically a carbon copy of TenantResponseDto. How can we leverage TS inheritage and annotations?
@ObjectType()
export class Tenant implements TenantResponseDto {
  @Field((type) => String)
  id: string;

  @Field((type) => String, { nullable: true })
  plan?: string;

  @Field((type) => Boolean, { nullable: true })
  trial: boolean;

  @Field((type) => String, { nullable: true })
  locale: string;

  @Field((type) => String, { nullable: true })
  name?: string;

  @Field((type) => String, { nullable: true })
  logo?: string;

  @Field((type) => Boolean, { nullable: true })
  mfa: boolean;

  @Field((type) => Boolean, { nullable: true })
  onboarded: boolean;

  @Field((type) => TenantPaymentStatusGraphql, { nullable: true })
  paymentStatus: TenantPaymentStatus;

  @Field((type) => String, { nullable: true })
  federationConnection?: string;

  metadata: Record<string, string>;

  @Field((type) => String, { nullable: true })
  createdAt: Date;
}

@ObjectType()
export class TenantAnonymous {
  @Field((type) => String)
  id: string;

  @Field((type) => String, { nullable: true })
  name?: string;

  @Field((type) => String, { nullable: true })
  locale: string;
}

@InputType()
export class TenantInput implements UpdateTenantRequestDto {
  @Field((type) => String, { nullable: true })
  name?: string;

  @Field((type) => String, { nullable: true })
  locale?: string;

  @Field((type) => String, { nullable: true })
  logo?: string;

  @Field((type) => Boolean, { nullable: true })
  mfa?: boolean;

  @Field((type) => String, { nullable: true })
  federationConnection?: string;
}

@InputType()
@ObjectType()
export class TenantOwnerInput implements TenantOwnerRequestDto {
  @Field((type) => String)
  email: string;

  @Field((type) => String, { nullable: true })
  firstName?: string;

  @Field((type) => String, { nullable: true })
  lastName?: string;

  @Field((type) => [CustomParamGraphqlInput], { nullable: true })
  customParams: CustomParamGraphqlInput[];
}

@InputType()
export class CreateTenantInput implements CreateTenantRequestDto {
  //TODO what todo here?
  @Field((type) => String, { nullable: true })
  plan?: string;

  @Field((type) => PriceOfferInput, { nullable: true })
  priceOffer?: PriceOffer;

  @Field((type) => TenantOwnerInput)
  owner: TenantOwnerInput;

  @Field((type) => String, { nullable: true })
  name?: string;

  @Field((type) => String, { nullable: true })
  logo?: string;
}

@ObjectType()
export class TenantPaymentDetailsGraphql implements TenantPaymentDetails {
  @Field((type) => TenantPaymentStatusGraphql)
  status: TenantPaymentStatus;

  @Field((type) => TenantPlanDetailsGraphql)
  details: TenantPlanDetails;
}

@InputType()
export class SetTenantPlanDetailsInput implements SetTenantPlanDetails {
  @Field((type) => String)
  planKey: string;

  @Field((type) => PriceOfferInput)
  priceOffer: PriceOffer;
}

@InputType()
export class PriceOfferInput implements PriceOffer {
  @Field((type) => String)
  currency: string;

  @Field((type) => String)
  recurrenceInterval: RecurrenceInterval;
}

@ObjectType()
export class TenantPaymentStatusGraphql implements TenantPaymentStatus {
  @Field((type) => Boolean)
  paymentsEnabled: boolean;

  @Field((type) => Boolean)
  shouldSelectPlan: boolean;

  @Field((type) => Boolean)
  shouldSetupPayments: boolean;

  @Field((type) => String)
  provider: BillingProvider;
}

@ObjectType()
export class TenantPlanDetailsGraphql implements TenantPlanDetails {
  @Field((type) => PlanGraphql, { nullable: true })
  plan?: PlanResponse;

  @Field((type) => PriceGraphql, { nullable: true })
  price?: Price;

  @Field((type) => Boolean)
  trial: boolean;

  @Field((type) => Number)
  trialDaysLeft: number;
}

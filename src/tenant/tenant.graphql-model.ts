import { TenantResponseDto } from '@nebulr-group/nblocks-ts-client';
import { PlanResponse } from '@nebulr-group/nblocks-ts-client/dist/platform/config/payments/plan-response';
import { Price } from '@nebulr-group/nblocks-ts-client/dist/platform/config/payments/price';
import { CreateTenantRequestDto, TenantOwnerRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/create-tenant-request.dto';
import { TenantPaymentDetails } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/tenant-payment-details';
import { TenantPaymentStatus } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/tenant-payment-status';
import { TenantPlanDetails } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/tenant-plan-details';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { PlanGraphql, PriceGraphql } from '../app/app.graphql-model';

//TODO This is basically a carbon copy of TenantResponseDto. How can we leverage TS inheritage and annotations?
@ObjectType()
export class Tenant implements TenantResponseDto {

  @Field(type => String)
  id: string;

  @Field(type => String, { nullable: true })
  plan?: string;

  @Field(type => String, { nullable: true })
  locale: string;

  @Field(type => String, { nullable: false })
  name?: string;

  @Field(type => String, { nullable: false })
  logo?: string;

  @Field(type => Boolean, { nullable: true })
  mfa: boolean;

  @Field(type => Boolean, { nullable: true })
  paymentsEnabled: boolean;

  @Field(type => Boolean, { nullable: true })
  paymentsRequired: boolean;

  @Field(type => Boolean, { nullable: true })
  onboarded: boolean

  @Field(type => String, { nullable: true })
  createdAt: Date;
}

@ObjectType()
export class TenantAnonymous {
  @Field(type => String)
  id: string;

  @Field(type => String, { nullable: true })
  name?: string;

  @Field(type => String, { nullable: true })
  locale: string;
}

@InputType()
export class TenantInput {

  @Field(type => String, { nullable: true })
  name: string;

  @Field(type => String, { nullable: true })
  plan?: string;

  @Field(type => String, { nullable: true })
  locale: string;

  @Field(type => Boolean, { nullable: true })
  mfa: boolean;
}

@InputType()
@ObjectType()
export class TenantOwnerInput implements TenantOwnerRequestDto {
  @Field(type => String)
  email: string;

  @Field(type => String, { nullable: true })
  firstName?: string;

  @Field(type => String, { nullable: true })
  lastName?: string;
}

@InputType()
export class CreateTenantInput implements CreateTenantRequestDto {

  @Field(type => String, { nullable: true })
  plan?: string;

  @Field(type => TenantOwnerInput)
  owner: TenantOwnerInput;

  @Field(type => String, { nullable: true })
  name?: string;

  @Field(type => String, { nullable: true })
  logo?: string;
}

@ObjectType()
export class TenantPaymentDetailsGraphql implements TenantPaymentDetails {
  @Field(type => TenantPaymentStatusGraphql)
  status: TenantPaymentStatus;

  @Field(type => TenantPlanDetailsGraphql)
  details: TenantPlanDetails;
}

@ObjectType()
export class TenantPaymentStatusGraphql implements TenantPaymentStatus {
  @Field(type => Boolean)
  shouldSelectPlan: boolean;

  @Field(type => Boolean)
  shouldSetupPayments: boolean;

}

@ObjectType()
export class TenantPlanDetailsGraphql implements TenantPlanDetails {
  @Field(type => PlanGraphql, { nullable: true })
  plan?: PlanResponse;

  @Field(type => PriceGraphql, { nullable: true })
  price?: Price;

  @Field(type => Boolean)
  trial: boolean;

  @Field(type => Number)
  trialDaysLeft: number;
}
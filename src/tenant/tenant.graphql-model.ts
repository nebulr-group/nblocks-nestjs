import { TenantResponseDto } from '@nebulr-group/nblocks-ts-client';
import { CreateTenantRequestDto, TenantOwnerRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/models/create-tenant-request.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

//TODO This is basically a carbon copy of TenantResponseDto. How can we leverage TS inheritage and annotations?
@ObjectType()
export class Tenant implements TenantResponseDto {

  @Field(type => String)
  id: string;

  @Field(type => String, { nullable: true })
  plan: string;

  @Field(type => String, { nullable: true })
  locale: string;

  @Field(type => String, { nullable: false })
  name?: string;

  @Field(type => String, { nullable: false })
  logo?: string;

  @Field(type => Boolean, { nullable: true })
  mfa: boolean;

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

  @Field(type => String)
  plan: string;

  @Field(type => TenantOwnerInput)
  owner: TenantOwnerInput;

  @Field(type => String, { nullable: true })
  name?: string;

  @Field(type => String, { nullable: true })
  logo?: string;
}

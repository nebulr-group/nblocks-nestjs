import { TenantUserResponseDto } from '@nebulr-group/nblocks-ts-client';
import { UpdateUserRequestDto } from '@nebulr-group/nblocks-ts-client/dist/platform/tenant/user/models/update-user-request.dto';
import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import {
  CustomParam,
  ParamType,
} from '@nebulr-group/nblocks-ts-client/dist/platform/models/custom-params-config.model';

//TODO This is basically a carbon copy of TenantUserResponseDto. How can we leverage TS inheritage and annotations?
@ObjectType()
export class User implements Omit<TenantUserResponseDto, 'tenant'> {
  @Field((type) => String)
  id: string;

  @Field((type) => String, { nullable: true })
  role: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  fullName?: string;

  @Field((type) => Boolean, { nullable: true })
  onboarded: boolean;

  @Field((type) => Boolean, { nullable: true })
  enabled: boolean;

  @Field((type) => [String], { nullable: true })
  teams: string[];

  @Field((type) => Boolean, { nullable: true })
  consentsToPrivacyPolicy: boolean;

  @Field((type) => String, { nullable: true })
  lastSeen: Date;

  @Field((type) => String, { nullable: true })
  createdAt: Date;

  @Field((type) => [CustomParamGraphql], { nullable: true })
  customParams: CustomParamGraphql[];
}

@ObjectType('CustomParam')
export class CustomParamGraphql implements CustomParam {
  @Field(() => String)
  label: string;

  @Field(() => String)
  type: ParamType;

  @Field(() => String)
  value: string;


  @Field(() => String)
  userLabel: string;

  @Field(() => String)
  regex:string
}

@InputType('CustomParamGraphqlInput')
export class CustomParamGraphqlInput implements CustomParam {
  @Field(() => String)
  label: string;

  @Field(() => String)
  type: ParamType;

  @Field(() => String)
  value: string;

  @Field(() => String)
  userLabel: string;

  @Field(() => String)
  regex: string
}

//TODO Combine into just user?
@InputType()
export class UserInput {
  @Field((type) => String)
  id: string;

  @Field((type) => String, { nullable: true })
  role: string;

  @Field((type) => Boolean, { nullable: true })
  enabled: boolean;
}

@InputType()
export class MeInput
  implements
    Pick<
      UpdateUserRequestDto,
      'consentsToPrivacyPolicy' | 'onboarded' | 'firstName' | 'lastName'
    >
{
  @Field((type) => Boolean, { nullable: true })
  consentsToPrivacyPolicy?: boolean;

  @Field((type) => Boolean, { nullable: true })
  onboarded?: boolean;

  @Field((type) => String, { nullable: true })
  firstName?: string;

  @Field((type) => String, { nullable: true })
  lastName?: string;
}

import { Field, InputType, ObjectType } from '@nestjs/graphql';

//TODO This is basically a carbon copy of TenantUserResponseDto. How can we leverage TS inheritage and annotations?
@ObjectType()
export class User {

  @Field(type => String, { nullable: true })
  id: string;

  @Field(type => String, { nullable: true })
  role: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  fullName: string;

  @Field(type => Boolean, { nullable: true })
  onboarded: boolean;

  @Field(type => Boolean, { nullable: true })
  enabled: boolean;

  @Field(type => [String], { nullable: true })
  teams: string[];

  @Field(type => Date, { nullable: true })
  createdAt: Date;
}

//TODO Combine into just user?
@InputType()
export class UserInput {

  @Field(type => String)
  id: string;

  @Field(type => String, { nullable: true })
  role: string;

  @Field(type => Boolean, { nullable: true })
  enabled: boolean;
}
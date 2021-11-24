import { Field, ObjectType } from '@nestjs/graphql';

//TODO This is basically a carbon copy of TenantResponseDto. How can we leverage TS inheritage and annotations?
@ObjectType()
export class Tenant {
  @Field(type => String, { nullable: false })
  id: string;

  @Field(type => String, { nullable: true })
  plan: string;

  @Field(type => String, { nullable: true })
  locale: string;

  @Field(type => String, { nullable: false })
  name?: string;

  @Field(type => String, { nullable: false })
  logo?: string;

  @Field(type => Date, { nullable: true })
  createdAt: Date;
}

@ObjectType()
export class TenantAnonymous {
  @Field(type => String, { nullable: false })
  id: string;

  @Field(type => String, { nullable: true })
  locale: string;
}

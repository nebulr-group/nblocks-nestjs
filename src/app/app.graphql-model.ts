import { AppModel } from '@nebulr-group/nblocks-ts-client';
import { Field, ObjectType } from '@nestjs/graphql';

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

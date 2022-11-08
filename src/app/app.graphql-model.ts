import { AppModel } from '@nebulr-group/nblocks-ts-client';
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
export class AppConfig extends App implements Pick<AppModel, 'id' | 'name' | 'uiUrl' | 'apiUrl' | 'defaultRole' | 'logo' | 'websiteUrl' | 'privacyPolicyUrl' | 'termsOfServiceUrl' | 'emailSenderName' | 'emailSenderEmail'> {
  @Field(type => String, { nullable: true })
  id: string;

  @Field(type => String, { nullable: true })
  apiUrl: string;

  @Field(type => String, { nullable: true })
  defaultRole: string;

  @Field(type => [String], { nullable: true })
  roles: string[];

  @Field(type => [String], { nullable: true })
  plans: string[];

  @Field(type => String, { nullable: true })
  emailSenderName: string;

  @Field(type => String, { nullable: true })
  emailSenderEmail: string;
}

@InputType()
export class UpdateCredentialsInput implements UpdateCredentials {
  @Field(type => String, { nullable: true })
  stripeSecretKey?: string;

  @Field(type => String, { nullable: true })
  stripePublicKey?: string;
}
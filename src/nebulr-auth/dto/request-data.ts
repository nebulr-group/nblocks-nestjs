import { AuthContext } from '@nebulr-group/nblocks-ts-client';

export class NebulrRequestData {
  timestamp: Date;
  graphql: boolean;
  appId?: string;
  auth: { authContext: AuthContext; resource: string };
}

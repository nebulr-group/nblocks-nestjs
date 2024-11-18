import { AuthContext } from '@nebulr-group/nblocks-ts-client';

export class AuthResponseDto {
  /** Wheather the user is granted to perform the action */
  granted: boolean;
  /** A resolved auth context instance */
  authContext: AuthContext;
}

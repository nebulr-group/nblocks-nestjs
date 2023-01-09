import { AuthContextDto } from "./auth-context.dto";

export class AuthResponseDto {
  /** Wheather the user is granted to perform the action */
  granted: boolean;
  /** A resolved auth context instance */
  authContext: AuthContextDto;
}

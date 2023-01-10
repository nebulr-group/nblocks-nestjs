import { JWTPayload } from 'jose/dist/types/types';

export interface JWTPayloadtDto extends JWTPayload {
  tid: string;
  aid: string;
  sub: string;
  scope: string;
  role: string;
  plan: string;
}

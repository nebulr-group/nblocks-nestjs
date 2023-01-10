import { AuthContextDto } from "./auth-context.dto";

export class NebulrRequestData {
    timestamp: Date;
    graphql: boolean;
    appId?: string;
    auth: { authContext: AuthContextDto, resource: string }
}
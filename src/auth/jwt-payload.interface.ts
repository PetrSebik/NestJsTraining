import { AccessLevel } from "./users-accesslevel.enum";

export interface JwtPayload {
    email: string;
    accessLevel: AccessLevel;
}
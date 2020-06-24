import { StrategyOptions, ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super(<StrategyOptions>{
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        });
    }

    validate(payload: any) {
        return { userId: payload.sub, userName: payload.username };
    }
}
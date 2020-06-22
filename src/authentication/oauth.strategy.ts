import { PassportStrategy } from "@nestjs/passport";
import OAuth2Strategy, { VerifyFunction, VerifyCallback } from "passport-oauth2";
import { ConfigService } from "@nestjs/config";
import { AuthenticationService } from "./authentication.service";
import { map, catchError } from "rxjs/operators";
import { UnauthorizedException, Injectable, ImATeapotException } from "@nestjs/common";

@Injectable()
export class OauthStrategy extends PassportStrategy(OAuth2Strategy) {
    constructor(config: ConfigService, private authenticationService: AuthenticationService) {
        super(<OAuth2Strategy.StrategyOptions>{
            authorizationURL: config.get('discordEndpoint') + '/oauth2/authorize',
            tokenURL: config.get('discordEndpoint') + '/oauth2/token',
            clientID: config.get('discordClientId'),
            clientSecret: config.get('discordClientSecret'),
            callbackURL: config.get('baseUrl') + '/auth/callback',
            scope: [
                'identify'
            ],
        });
    }

    validate(accessToken: string, refreshToken: string, profile: any, verfified: VerifyCallback) {
        /*this.authenticationService.validateUser(accessToken).subscribe((user) => {
            verfified(undefined, user);
        }, (error) => {
            verfified(error);
        });*/
        return this.authenticationService.validateUser(accessToken).toPromise();
    }
}
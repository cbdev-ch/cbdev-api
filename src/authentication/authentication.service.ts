import { Injectable, HttpServer, HttpService, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { stat } from 'fs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AxiosResponse } from 'axios';

@Injectable()
export class AuthenticationService {

    private discordEndpoint: string;
    private discordAuthEndpoint: string;
    private discordClientId: string;
    private discordClientSecret: string;

    private loginAttempts: {[intergrity: string]: { callbackUri: string }};

    constructor(private config: ConfigService, private http: HttpService, private jwtService: JwtService, private userService: UserService) {
        this.discordEndpoint = this.config.get('discordEndpoint');
        this.discordAuthEndpoint = this.discordEndpoint + '/oauth2';
        this.discordClientId = this.config.get('discordClientId');
        this.discordClientSecret = this.config.get('discordClientSecret');

        this.loginAttempts = {};
    }

    getLoginUri(integrity: string, callbackUri: string) {
        this.loginAttempts[integrity] = { callbackUri };

        let url = new URL(this.discordAuthEndpoint + '/authorize');
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('client_id', this.config.get('discordClientId'));
        url.searchParams.set('scope', 'identify');
        url.searchParams.set('redirect_uri', this.config.get('baseUrl') + '/auth/callback');
        url.searchParams.set('state', integrity);

        return url.toString();
    }

    getSuccessUri(integrity: string, code: string) {
        let url = new URL(this.loginAttempts[integrity].callbackUri);
        url.searchParams.set('state', integrity);
        url.searchParams.set('code', code);

        return url.toString();
    }

    getFailureUri(integrity: string, error: string, errorDescription?: string) {
        let url = new URL(this.loginAttempts[integrity].callbackUri);
        url.searchParams.set('state', integrity);
        url.searchParams.set('error', error);
        url.searchParams.set('error_description', errorDescription);

        return url.toString();
    }

    validateIntegrity(integrity: string) {
        return integrity in this.loginAttempts;
    }

    login(code: string) {
        // Get token from discord
        return this.http.post(this.discordAuthEndpoint + '/token', {
            'client_id': this.discordClientId,
            'client_secret': this.discordClientSecret,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': this.config.get('baseUrl') + '/auth/callback',
            'scope': 'identify'

        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).pipe(
            flatMap((response, index)=> {
                console.log('mami');
                let token = response.data['access_token'];
                let expiresIn = response.data['expires_in'];
                let refreshToken = response.data['refresh_token'];

                // Get user from discord
                return this.http.get(this.discordEndpoint + '/users/@me', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }).pipe(
                    map((response) => {
                        console.log('lulm');
                        let userId = response.data['id'];
                        let userName = response.data['username'];

                        // Generate JWT and return

                        return this.jwtService.sign({
                            'username': userName
                        }, {
                            subject: userId
                        });
                    })/*,
                    catchError((error, caught) => {
                        console.log(error);
                        return caught;
                    })*/
                )
            })/*,
            catchError((error, caught) => {
                let response = <AxiosResponse>error['response'];

                if (response.data['error'] === 'invalid_grant') {
                    return caught;
                }

                console.log(error);
                return caught;
            })*/
        );
    }
}
import { Injectable, HttpService, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { flatMap, map, catchError } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import qs from 'qs';
import { InjectModel } from '@nestjs/mongoose';
import { LoginAttempt } from './login-attempt.schema';
import { Model } from 'mongoose';
import moment from 'moment';
import { from } from 'rxjs';

@Injectable()
export class AuthService {

    private readonly intergrityExpirationTime: number = 60; // miliseconds until a login attempt expires

    private discordEndpoint: string;
    private discordAuthEndpoint: string;
    private discordClientId: string;
    private discordClientSecret: string;

    constructor(@InjectModel(LoginAttempt.name) private loginAttemptModel: Model<LoginAttempt>, private config: ConfigService, private http: HttpService, private jwtService: JwtService, private userService: UserService) {
        this.discordEndpoint = this.config.get('discordEndpoint');
        this.discordAuthEndpoint = this.discordEndpoint + '/oauth2';
        this.discordClientId = this.config.get('discordClientId');
        this.discordClientSecret = this.config.get('discordClientSecret');
    }

    getLoginUri(integrity: string, callbackUri: string) {
        new this.loginAttemptModel({
            integrity,
            callbackUri,
            expiresAt: moment().add(60, "seconds").toDate()
        });

        let url = new URL(this.discordAuthEndpoint + '/authorize');
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('client_id', this.config.get('discordClientId'));
        url.searchParams.set('scope', 'identify');
        url.searchParams.set('redirect_uri', this.config.get('baseUrl') + '/auth/callback');
        url.searchParams.set('state', integrity);

        return url.toString();
    }

    getSuccessUri(integrity: string, code: string) {
        let url = new URL(this.loginAttemptModel[integrity].callbackUri);
        url.searchParams.set('state', integrity);
        url.searchParams.set('code', code);

        return url.toString();
    }

    getFailureUri(integrity: string, error: string, errorDescription?: string) {
        let url = new URL(this.loginAttemptModel[integrity].callbackUri);
        url.searchParams.set('state', integrity);
        url.searchParams.set('error', error);
        url.searchParams.set('error_description', errorDescription);

        return url.toString();
    }

    validateIntegrity(integrity: string) {
        return from(this.loginAttemptModel.exists({ integrity }));
    }

    login(code: string) {
        // Get token from discord
        return this.http.post(this.discordAuthEndpoint + '/token', qs.stringify({
            'client_id': this.discordClientId,
            'client_secret': this.discordClientSecret,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': this.config.get('baseUrl') + '/auth/callback',
            'scope': 'identify'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).pipe(
            flatMap((response, index)=> {
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
                        let userId = response.data['id'];
                        let userName = response.data['username'];

                        // Generate JWT and return

                        return this.jwtService.sign({
                            'username': userName
                        }, {
                            subject: userId
                        });
                    }),
                    catchError((error, caught) => {
                        throw new InternalServerErrorException();
                    })
                )
            }),
            catchError((error, caught) => {
                let response = <AxiosResponse>error['response'];

                if (response.data['error'] === 'invalid_grant') {
                    throw new UnauthorizedException();
                }

                console.log(error);
                throw new InternalServerErrorException();
            })
        );
    }
}

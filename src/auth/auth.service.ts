import { Injectable, HttpService, InternalServerErrorException, UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common';
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
import { from, Observable } from 'rxjs';
import { use } from 'passport';
import { Interval } from '@nestjs/schedule';
import { UserDocument } from 'src/user/user.schema';

@Injectable()
export class AuthService {

    private readonly intergrityExpirationTime: number = 180; // seconds until a login attempt expires

    private discordEndpoint: string;
    private discordAuthEndpoint: string;
    private discordClientId: string;
    private discordClientSecret: string;

    constructor(@InjectModel(LoginAttempt.name) private loginAttemptModel: Model<LoginAttempt>, @InjectModel(UserDocument.name) private userModel: Model<UserDocument>,
    private config: ConfigService, private http: HttpService, private jwtService: JwtService, private userService: UserService) {

        this.discordEndpoint = this.config.get('discordEndpoint');
        this.discordAuthEndpoint = this.discordEndpoint + '/oauth2';
        this.discordClientId = this.config.get('discordClientId');
        this.discordClientSecret = this.config.get('discordClientSecret');
    }

    getLoginUri(integrity: string, callbackUri: string) {
        new this.loginAttemptModel({
            integrity,
            callbackUri,
            expiresAt: moment().add(this.intergrityExpirationTime, "seconds").toDate()
        }).save();

        let url = new URL(this.discordAuthEndpoint + '/authorize');
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('client_id', this.config.get('discordClientId'));
        url.searchParams.set('scope', 'identify');
        url.searchParams.set('redirect_uri', this.config.get('baseUrl') + '/auth/callback');
        url.searchParams.set('state', integrity);

        return url.toString();
    }

    async getSuccessUri(loginAttemptId: string, code: string) {
        let attempt = await this.loginAttemptModel.findById(loginAttemptId).exec();

        let url = new URL(attempt.callbackUri);
        url.searchParams.set('state', attempt.integrity);
        url.searchParams.set('code', code);

        return url.toString();
    }

    async getFailureUri(loginAttemptId: string, error: string, errorDescription?: string) {
        let attempt = await this.loginAttemptModel.findById(loginAttemptId).exec();

        let url = new URL(attempt.callbackUri);
        url.searchParams.set('state', attempt.integrity);
        url.searchParams.set('error', error);
        url.searchParams.set('error_description', errorDescription);

        return url.toString();
    }

    async validateIntegrity(integrity: string): Promise<string> {
        let attempt = await this.loginAttemptModel.findOne({ integrity }).exec();

        if (!attempt) throw new ForbiddenException();

        if (attempt.expiresAt.getTime() <= new Date().getTime()) throw new UnauthorizedException('Login timed out. Try again.');

        return attempt.id;
    }

    async login(code: string): Promise<string> {
        // Get token from discord
        let tokenResponse = await this.http.post(this.discordAuthEndpoint + '/token', qs.stringify({
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
            catchError((error, caught) => {
                let response = <AxiosResponse>error['response'];

                if (response.data['error'] === 'invalid_grant') {
                    throw new UnauthorizedException();
                }

                console.log(error);
                throw new InternalServerErrorException();
            })
        ).toPromise();

        let token = tokenResponse.data['access_token'];
        let expiresIn = tokenResponse.data['expires_in'];
        let refreshToken = tokenResponse.data['refresh_token'];

        // Identify user
        let discordId = await this.http.get(this.config.get('discordEndpoint') + '/users/@me', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).pipe(
            map((response) => {
                return response.data['id'];
            }),
            catchError((error, caught) => {
                console.log(error);
                throw new InternalServerErrorException();
            })
        ).toPromise();

        // Register user
        let user = await this.userService.register(discordId, token, moment().add(expiresIn, 's').toDate(), refreshToken, ['identify']);

        // Generate JWT and return
        return this.jwtService.sign({
            //'username': user.username
        }, {
            subject: user.id
        });
    }

    // Check for users which need new token
    @Interval(60000)
    updateTokens() {
        this.userModel.find({ discordTokenExpiresAt: { $lt: moment().subtract(5, 'minutes').toDate() } }).exec().then((users) => {
            users.forEach((userDoc) => {
                console.log('Updating ' + userDoc);

                userDoc.discordTokenExpiresAt = null;
                userDoc.save();

                this.http.post(this.discordAuthEndpoint + '/token', qs.stringify({
                    'client_id': this.discordClientId,
                    'client_secret': this.discordClientSecret,
                    'grant_type': 'refresh_token',
                    'refresh_token': userDoc.discordRefreshToken,
                    'redirect_uri': this.config.get('baseUrl') + '/auth/callback',
                    'scope': 'identify'
                }));
            });
        });
    }
}

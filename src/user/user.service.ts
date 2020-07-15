import { Injectable, HttpModule, HttpServer, HttpService, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, catchError, flatMap } from 'rxjs/operators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { SchedulerRegistry, Interval } from '@nestjs/schedule';
import moment from 'moment';
import { User } from './user.model';
import { UserDoc } from './user.schema';

@Injectable()
export class UserService {

    constructor(@InjectModel(UserDoc.name) private userModel: Model<UserDoc>, private config: ConfigService, private http: HttpService) {
    }

    async getByDiscordId(discordId: string): Promise<User> {
        let userDoc = await this.userModel.findOne({ discordId }).exec();
        
        return this.http.get(this.config.get('discordEndpoint') + '/users/@me', {
            headers: {
                'Authorization': 'Bearer ' + userDoc.discordToken
            }
        }).pipe(
            map((response) => {
                return new User({
                    id: discordId,
                    username: response.data['username'],
                    avatarUri: this.config.get('discordCDN') + '/avatars/' + discordId + '/' + response.data['avatar'] + '.png',
                });
            }),
            catchError((error, caught) => {
                console.log(error);
                throw new InternalServerErrorException();
            })
        ).toPromise();
    }

    async register(discordId: string, discordToken: string, discordTokenExpiresAt: Date, discordRefreshToken: string, discordScopes: string[]): Promise<User> {
        if (! await this.userModel.exists({ discordId })) {
            await new this.userModel({
                discordId,
                discordToken,
                discordTokenExpiresAt,
                discordRefreshToken,
                discordScopes,
            }).save();
        }

        return this.getByDiscordId(discordId);
    }
}

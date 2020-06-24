import { Injectable, HttpModule, HttpServer, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class UserService {

    constructor(private config: ConfigService, private http: HttpService) {
    }

    getUserByDiscordToken(discordToken: string) {
        return this.http.get(this.config.get('discordEndpoint') + '/users/@me', {
            headers: {
                'Authorization': 'Bearer ' + discordToken
            }
        }).pipe(
            map((response) => {
                // TODO check if Database has user, if not create, afterwards return user
                return {
                    userId: response.data['id'],
                    userName: response.data['username']
                };
            }),
            catchError((error, caught) => {
                console.log(error);
                return caught;
            })
        )
    }
}

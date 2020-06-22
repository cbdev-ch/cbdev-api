import { Injectable, HttpServer, HttpService, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { stat } from 'fs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
    private loginAttempts: {[intergrity: string]: { callbackUrl: string }};

    constructor(private configService: ConfigService, private http: HttpService, private jwtService: JwtService, private userService: UserService) {
    }

    validateUser(discordToken: string) {
        return this.userService.getUser(discordToken);
    }

    login(user: { userId: string, userName: string }) {
        const token = this.jwtService.sign({
            'sub': user.userId,
            'username': user.userName
        });

        return {
            'access_token': token
        }
    }
}
